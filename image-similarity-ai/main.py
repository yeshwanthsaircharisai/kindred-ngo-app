
import io
import os
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any

import numpy as np
import torch
import torch.nn.functional as F
import imagehash

from dotenv import load_dotenv
from supabase import create_client, Client

from PIL import Image, ImageOps, UnidentifiedImageError
from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModel, AutoProcessor, AutoImageProcessor


# ==================================================
# CONFIGURATION
# ==================================================

MODEL_NAME = "google/siglip2-base-patch16-224"
DINOV2_MODEL_NAME = "facebook/dinov2-small"

MAX_FILE_SIZE = 20 * 1024 * 1024
MAX_IMAGE_PIXELS = 50_000_000
MAX_IMAGE_SIZE = (1024, 1024)

ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}
PHASH_HASH_SIZE = 8

DINOV2_MATCH_THRESHOLD = 0.70
DINOV2_MATCH_COUNT = 50

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")

SUPABASE_SECRET_KEY = (
    os.getenv("SUPABASE_SECRET_KEY")
    or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

supabase: Optional[Client] = None

if SUPABASE_URL and SUPABASE_SECRET_KEY:
    try:
        supabase = create_client(
            SUPABASE_URL,
            SUPABASE_SECRET_KEY
        )
        print("Supabase client configured successfully.")

    except Exception as error:
        print("Supabase client configuration failed:", repr(error))
        supabase = None
else:
    print("Supabase credentials are missing.")


device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

processor = None
model = None

dinov2_processor = None
dinov2_model = None


# ==================================================
# JSON SERIALIZATION HELPER
# ==================================================

def make_json_safe(value):
    """
    Convert NumPy values and nested objects into
    standard Python values that FastAPI can serialize.
    """

    if isinstance(value, np.ndarray):
        return value.tolist()

    if isinstance(value, np.generic):
        return value.item()

    if isinstance(value, dict):
        return {
            str(key): make_json_safe(item)
            for key, item in value.items()
        }

    if isinstance(value, (list, tuple)):
        return [
            make_json_safe(item)
            for item in value
        ]

    return value


# ==================================================
# RESPONSE MODELS
# ==================================================

class ImageDetails(BaseModel):
    filename: str
    format: str
    width: int
    height: int
    file_size_bytes: int


class EmbeddingResponse(BaseModel):
    success: bool
    message: str
    model: str
    dimensions: int
    embedding: List[float]
    image: ImageDetails


class SimilarityResponse(BaseModel):
    success: bool
    message: str
    model: str
    similarity_score: float
    dimensions: int
    image1: ImageDetails
    image2: ImageDetails


class PhashResponse(BaseModel):
    success: bool
    message: str
    hash_algorithm: str
    hash_size: int
    hash1: str
    hash2: str
    hamming_distance: int
    similarity_percentage: float
    image1: ImageDetails
    image2: ImageDetails


class DinoSimilarityResponse(BaseModel):
    success: bool
    message: str
    model: str
    similarity_score: float
    dimensions: int
    image1: ImageDetails
    image2: ImageDetails


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str
    device: str
    dinov2_model_loaded: bool
    dinov2_model_name: str


# ==================================================
# LOAD AI MODELS
# ==================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    global processor, model
    global dinov2_processor, dinov2_model

    print("=" * 50)
    print("Loading SigLIP 2...")
    print("Model:", MODEL_NAME)
    print("Device:", device)
    print("=" * 50)

    try:
        processor = AutoProcessor.from_pretrained(MODEL_NAME)

        model = AutoModel.from_pretrained(MODEL_NAME)
        model.to(device)
        model.eval()

        print("SigLIP 2 loaded successfully.")

    except Exception as error:
        print("SigLIP 2 loading failed:", repr(error))
        raise

    print("=" * 50)
    print("Loading DINOv2...")
    print("Model:", DINOV2_MODEL_NAME)
    print("=" * 50)

    try:
        dinov2_processor = AutoImageProcessor.from_pretrained(
            DINOV2_MODEL_NAME
        )

        dinov2_model = AutoModel.from_pretrained(
            DINOV2_MODEL_NAME
        )

        dinov2_model.to(device)
        dinov2_model.eval()

        print("DINOv2 loaded successfully.")
        print("Hidden size:", dinov2_model.config.hidden_size)

    except Exception as error:
        dinov2_processor = None
        dinov2_model = None

        print("DINOv2 loading failed:", repr(error))

    yield

    print("Shutting down Kindred Image Similarity API...")


# ==================================================
# FASTAPI APPLICATION
# ==================================================

app = FastAPI(
    title="Kindred Image Similarity API",
    description=(
        "Image similarity service using SigLIP 2, "
        "DINOv2 and Perceptual Hashing."
    ),
    version="1.6.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# IMAGE PROCESSING
# ==================================================

def process_image(image_bytes: bytes, filename: str):

    try:
        image = Image.open(io.BytesIO(image_bytes))

        image_format = (image.format or "").upper()

        if image_format not in ALLOWED_FORMATS:
            raise HTTPException(
                status_code=400,
                detail="Only JPEG, PNG and WEBP images are supported."
            )

        image = ImageOps.exif_transpose(image)

        width, height = image.size

        if width <= 0 or height <= 0:
            raise HTTPException(
                status_code=400,
                detail="Invalid image dimensions."
            )

        if width * height > MAX_IMAGE_PIXELS:
            raise HTTPException(
                status_code=400,
                detail="Image exceeds the 50 megapixel limit."
            )

        image = image.convert("RGB")

        image.thumbnail(
            MAX_IMAGE_SIZE,
            Image.Resampling.LANCZOS
        )

        details = ImageDetails(
            filename=filename,
            format=image_format,
            width=width,
            height=height,
            file_size_bytes=len(image_bytes)
        )

        return image, details

    except HTTPException:
        raise

    except UnidentifiedImageError:
        raise HTTPException(
            status_code=400,
            detail=f"{filename}: Invalid image file."
        )

    except Exception as error:
        print("Image processing error:", repr(error))

        raise HTTPException(
            status_code=400,
            detail="Unable to process the uploaded image."
        )


async def read_uploaded_image(file: UploadFile):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Please upload an image."
        )

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Maximum image file size is 20 MB."
        )

    return process_image(image_bytes, file.filename)


# ==================================================
# SIGLIP 2 EMBEDDING
# ==================================================

def generate_siglip_embedding(image: Image.Image) -> List[float]:

    if model is None or processor is None:
        raise RuntimeError("SigLIP 2 model is not loaded.")

    inputs = processor(
        images=image,
        return_tensors="pt"
    )

    inputs = {
        key: value.to(device) if torch.is_tensor(value) else value
        for key, value in inputs.items()
    }

    with torch.inference_mode():

        outputs = model.get_image_features(**inputs)

        features = getattr(
            outputs,
            "pooler_output",
            None
        )

        if features is None:
            raise ValueError("SigLIP 2 pooled features unavailable.")

        if features.ndim == 1:
            features = features.unsqueeze(0)

        features = F.normalize(
            features.float(),
            p=2,
            dim=1
        )

        return features[0].cpu().tolist()


# ==================================================
# DINOV2 EMBEDDING
# ==================================================

def generate_dinov2_embedding(image: Image.Image) -> List[float]:

    if dinov2_model is None or dinov2_processor is None:
        raise RuntimeError("DINOv2 model is not loaded.")

    inputs = dinov2_processor(
        images=image,
        return_tensors="pt"
    )

    inputs = {
        key: value.to(device) if torch.is_tensor(value) else value
        for key, value in inputs.items()
    }

    with torch.inference_mode():

        outputs = dinov2_model(**inputs)

        features = outputs.last_hidden_state

        if features.ndim != 3 or features.shape[1] < 1:
            raise ValueError("Invalid DINOv2 feature shape.")

        cls_features = features[:, 0, :]

        if cls_features.shape[1] != dinov2_model.config.hidden_size:
            raise ValueError("Unexpected DINOv2 embedding dimensions.")

        normalized_features = F.normalize(
            cls_features.float(),
            p=2,
            dim=1
        )

        return normalized_features[0].cpu().tolist()


# ==================================================
# PERCEPTUAL HASH
# ==================================================

def generate_phash(image: Image.Image) -> str:

    return str(
        imagehash.phash(
            image,
            hash_size=PHASH_HASH_SIZE
        )
    )


def compare_phashes(hash1: str, hash2: str):

    parsed_hash1 = imagehash.hex_to_hash(hash1)
    parsed_hash2 = imagehash.hex_to_hash(hash2)

    hamming_distance = parsed_hash1 - parsed_hash2

    total_bits = PHASH_HASH_SIZE * PHASH_HASH_SIZE

    similarity_percentage = (
        (total_bits - hamming_distance) / total_bits
    ) * 100

    return int(hamming_distance), float(round(similarity_percentage, 2))


# ==================================================
# DINOV2 COSINE SIMILARITY
# ==================================================

def compare_dinov2_embeddings(
    embedding1: List[float],
    embedding2: List[float]
) -> float:

    if len(embedding1) != len(embedding2):
        raise ValueError("Embedding dimensions do not match.")

    tensor1 = torch.tensor(
        embedding1,
        dtype=torch.float32
    ).unsqueeze(0)

    tensor2 = torch.tensor(
        embedding2,
        dtype=torch.float32
    ).unsqueeze(0)

    similarity = F.cosine_similarity(
        tensor1,
        tensor2,
        dim=1
    )

    return max(-1.0, min(1.0, float(similarity.item())))


# ==================================================
# SUPABASE HELPERS
# ==================================================

def require_supabase() -> Client:

    if supabase is None:
        raise HTTPException(
            status_code=503,
            detail="Supabase backend configuration is unavailable."
        )

    return supabase


def get_authenticated_user_id(
    authorization: Optional[str]
) -> str:

    client = require_supabase()

    if (
        not authorization
        or not authorization.lower().startswith("bearer ")
    ):
        raise HTTPException(
            status_code=401,
            detail="Supabase Bearer access token is required."
        )

    access_token = authorization.split(" ", 1)[1].strip()

    if not access_token:
        raise HTTPException(
            status_code=401,
            detail="Bearer token is empty."
        )

    try:
        user_response = client.auth.get_user(access_token)

        user = getattr(user_response, "user", None)

        if user is None or not getattr(user, "id", None):
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired Supabase access token."
            )

        return str(user.id)

    except HTTPException:
        raise

    except Exception as error:
        print("Authentication error:", repr(error))

        raise HTTPException(
            status_code=401,
            detail="Could not validate Supabase access token."
        )


# ==================================================
# POST OWNERSHIP VERIFICATION
# ==================================================

def verify_post_ownership(
    post_id: str,
    authenticated_user_id: str
) -> None:

    client = require_supabase()

    try:
        print("=" * 50)
        print("VERIFYING POST OWNERSHIP")
        print("Post ID:", post_id)
        print("Authenticated User ID:", authenticated_user_id)

        result = (
            client.table("posts")
            .select("id,user_id")
            .eq("id", post_id)
            .limit(1)
            .execute()
        )

        rows = result.data or []

        print("Ownership query returned:", len(rows), "record(s)")

        if not rows:
            raise HTTPException(
                status_code=404,
                detail=f"Post {post_id} was not found in public.posts."
            )

        post = rows[0]

        print("Database Post ID:", post.get("id"))
        print("Database User ID:", post.get("user_id"))

        if str(post.get("user_id")) != str(authenticated_user_id):
            raise HTTPException(
                status_code=403,
                detail="You can only register embeddings for your own posts."
            )

        print("POST OWNERSHIP VERIFIED SUCCESSFULLY")
        print("=" * 50)

    except HTTPException:
        raise

    except Exception as error:

        print("=" * 50)
        print("POST OWNERSHIP VERIFICATION FAILED")
        print("Error type:", type(error).__name__)
        print("Actual error:", repr(error))
        print("=" * 50)

        raise HTTPException(
            status_code=500,
            detail=f"Post ownership verification failed: {str(error)}"
        )


# ==================================================
# ROOT
# ==================================================

@app.get("/")
async def root():

    return {
        "success": True,
        "message": "Kindred Image Similarity API is running.",
        "model": MODEL_NAME,
        "features": [
            "SigLIP 2",
            "DINOv2",
            "Perceptual Hashing",
            "Supabase similarity search",
            "Embedding registration"
        ],
        "docs": "/docs"
    }


# ==================================================
# HEALTH
# ==================================================

@app.get("/health", response_model=HealthResponse)
async def health():

    return HealthResponse(
        status="healthy" if model is not None else "model_not_loaded",
        model_loaded=model is not None,
        model_name=MODEL_NAME,
        device=str(device),
        dinov2_model_loaded=(
            dinov2_model is not None
            and dinov2_processor is not None
        ),
        dinov2_model_name=DINOV2_MODEL_NAME
    )


# ==================================================
# SIGLIP EMBEDDING ENDPOINT
# ==================================================

@app.post("/api/v1/embedding", response_model=EmbeddingResponse)
async def create_embedding(
    file: UploadFile = File(...)
):

    try:
        image, details = await read_uploaded_image(file)

        embedding = generate_siglip_embedding(image)

        return EmbeddingResponse(
            success=True,
            message="Image embedding generated successfully.",
            model=MODEL_NAME,
            dimensions=len(embedding),
            embedding=embedding,
            image=details
        )

    except HTTPException:
        raise

    except Exception as error:
        print("Embedding endpoint error:", repr(error))

        raise HTTPException(
            status_code=500,
            detail=f"Embedding generation failed: {str(error)}"
        )

    finally:
        await file.close()


# ==================================================
# SIGLIP IMAGE COMPARISON
# ==================================================

@app.post("/api/v1/compare", response_model=SimilarityResponse)
async def compare_images(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...)
):

    try:
        processed1, details1 = await read_uploaded_image(image1)
        processed2, details2 = await read_uploaded_image(image2)

        embedding1 = generate_siglip_embedding(processed1)
        embedding2 = generate_siglip_embedding(processed2)

        tensor1 = torch.tensor(embedding1).unsqueeze(0)
        tensor2 = torch.tensor(embedding2).unsqueeze(0)

        similarity = F.cosine_similarity(
            tensor1,
            tensor2,
            dim=1
        )

        score = max(-1.0, min(1.0, float(similarity.item())))

        return SimilarityResponse(
            success=True,
            message="Image comparison completed successfully.",
            model=MODEL_NAME,
            similarity_score=score,
            dimensions=len(embedding1),
            image1=details1,
            image2=details2
        )

    except HTTPException:
        raise

    except Exception as error:
        print("Comparison error:", repr(error))

        raise HTTPException(
            status_code=500,
            detail=f"Image comparison failed: {str(error)}"
        )

    finally:
        await image1.close()
        await image2.close()


# ==================================================
# PHASH IMAGE COMPARISON
# ==================================================

@app.post("/api/v1/phash", response_model=PhashResponse)
async def compare_images_phash(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...)
):

    try:
        processed1, details1 = await read_uploaded_image(image1)
        processed2, details2 = await read_uploaded_image(image2)

        hash1 = generate_phash(processed1)
        hash2 = generate_phash(processed2)

        distance, percentage = compare_phashes(hash1, hash2)

        return PhashResponse(
            success=True,
            message="pHash comparison completed successfully.",
            hash_algorithm="pHash",
            hash_size=PHASH_HASH_SIZE,
            hash1=hash1,
            hash2=hash2,
            hamming_distance=distance,
            similarity_percentage=percentage,
            image1=details1,
            image2=details2
        )

    except HTTPException:
        raise

    except Exception as error:
        print("pHash comparison error:", repr(error))

        raise HTTPException(
            status_code=500,
            detail=f"pHash comparison failed: {str(error)}"
        )

    finally:
        await image1.close()
        await image2.close()


# ==================================================
# DINOV2 IMAGE COMPARISON
# ==================================================

@app.post("/api/v1/dinov2", response_model=DinoSimilarityResponse)
async def compare_images_dinov2(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...)
):

    try:
        processed1, details1 = await read_uploaded_image(image1)
        processed2, details2 = await read_uploaded_image(image2)

        embedding1 = generate_dinov2_embedding(processed1)
        embedding2 = generate_dinov2_embedding(processed2)

        score = compare_dinov2_embeddings(
            embedding1,
            embedding2
        )

        return DinoSimilarityResponse(
            success=True,
            message="DINOv2 comparison completed successfully.",
            model=DINOV2_MODEL_NAME,
            similarity_score=score,
            dimensions=len(embedding1),
            image1=details1,
            image2=details2
        )

    except HTTPException:
        raise

    except Exception as error:
        print("DINOv2 comparison error:", repr(error))

        raise HTTPException(
            status_code=500,
            detail=f"DINOv2 comparison failed: {str(error)}"
        )

    finally:
        await image1.close()
        await image2.close()


# ==================================================
# DINOV2 SUPABASE SEARCH AND EMBEDDING REGISTRATION
# ==================================================

@app.post("/api/v1/image-similarity/search")
async def search_and_optionally_store_image(
    file: UploadFile = File(...),
    post_id: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    save_embedding: bool = Form(False),
    authorization: Optional[str] = Header(None),
):

    if dinov2_model is None or dinov2_processor is None:
        raise HTTPException(
            status_code=503,
            detail="DINOv2 model is not ready."
        )

    client = require_supabase()

    authenticated_user_id = get_authenticated_user_id(
        authorization
    )

    if save_embedding:

        if not post_id or not image_url:
            raise HTTPException(
                status_code=400,
                detail="post_id and image_url are required."
            )

        verify_post_ownership(
            post_id,
            authenticated_user_id
        )

    elif post_id:
        verify_post_ownership(
            post_id,
            authenticated_user_id
        )

    try:
        # 1. Read and process uploaded image
        image, details = await read_uploaded_image(file)

        # 2. Generate DINOv2 embedding
        dinov2_embedding = generate_dinov2_embedding(image)

        # 3. Generate perceptual hash
        phash_value = generate_phash(image)

        # 4. Search similar images in Supabase
        rpc_result = client.rpc(
            "match_post_image_embeddings",
            {
                "query_embedding": dinov2_embedding,
                "match_threshold": DINOV2_MATCH_THRESHOLD,
                "match_count": DINOV2_MATCH_COUNT,
                "exclude_post_id": post_id,
            }
        ).execute()

        # 5. Process similarity matches
        matches: List[Dict[str, Any]] = []

        for row in (rpc_result.data or []):

            phash_comparison = None

            if row.get("phash"):

                try:
                    distance, percentage = compare_phashes(
                        phash_value,
                        row["phash"]
                    )

                    phash_comparison = {
                        "hamming_distance": int(distance),
                        "similarity_percentage": float(percentage)
                    }

                except Exception as error:
                    print(
                        "pHash comparison skipped:",
                        repr(error)
                    )

            similarity_value = row.get("dinov2_similarity")

            if similarity_value is not None:
                similarity_value = float(similarity_value)

            matches.append({
                "embedding_record_id": row.get("id"),
                "post_id": row.get("post_id"),
                "image_url": row.get("image_url"),
                "dinov2_similarity": similarity_value,
                "phash_comparison": phash_comparison
            })

        # 6. Optionally save embedding in Supabase
        embedding_saved = False

        if save_embedding:

            insert_result = client.table(
                "post_image_embeddings"
            ).insert({
                "post_id": post_id,
                "user_id": authenticated_user_id,
                "image_url": image_url,
                "dinov2_embedding": dinov2_embedding,
                "phash": phash_value
            }).execute()

            if not insert_result.data:
                raise RuntimeError(
                    "Supabase did not confirm embedding insertion."
                )

            embedding_saved = True

            print("=" * 50)
            print("IMAGE EMBEDDING REGISTERED SUCCESSFULLY")
            print("Post ID:", post_id)
            print("User ID:", authenticated_user_id)
            print("=" * 50)

        # 7. Find highest similarity score
        highest_similarity = max(
            (
                float(item["dinov2_similarity"])
                for item in matches
                if item["dinov2_similarity"] is not None
            ),
            default=None
        )

        # 8. Build response
        response_data = {
            "success": True,
            "message": (
                "Image similarity search completed and embedding saved."
                if embedding_saved
                else "Image similarity search completed."
            ),
            "model": DINOV2_MODEL_NAME,
            "dimensions": len(dinov2_embedding),
            "image": details.model_dump(),
            "phash": phash_value,
            "match_threshold": DINOV2_MATCH_THRESHOLD,
            "possible_duplicate": len(matches) > 0,
            "highest_similarity": highest_similarity,
            "match_count": len(matches),
            "matches": matches,
            "embedding_saved": embedding_saved
        }

        # 9. Ensure the complete response is JSON serializable
        return make_json_safe(response_data)

    except HTTPException:
        raise

    except Exception as error:

        print("=" * 50)
        print("IMAGE SIMILARITY ENDPOINT FAILED")
        print("Error type:", type(error).__name__)
        print("Actual error:", repr(error))
        print("=" * 50)

        raise HTTPException(
            status_code=500,
            detail=f"Image similarity search failed: {str(error)}"
        )

    finally:
        await file.close()


# ==================================================
# RUN APPLICATION
# ==================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False
    )
