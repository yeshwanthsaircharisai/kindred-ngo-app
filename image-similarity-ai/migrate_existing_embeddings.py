import asyncio
from urllib.parse import urlparse

import httpx

import main as backend


# ==================================================
# CONFIGURATION
# ==================================================

PAGE_SIZE = 500
HTTP_TIMEOUT = 60

SUCCESS_COUNT = 0
SKIPPED_COUNT = 0
FAILED_COUNT = 0


# ==================================================
# FETCH EXISTING EMBEDDINGS
# ==================================================

def get_existing_embedding_post_ids():

    client = backend.require_supabase()

    existing_ids = set()
    offset = 0

    print("\nChecking existing embedding records...")

    while True:

        result = (
            client.table("post_image_embeddings")
            .select("post_id")
            .range(offset, offset + PAGE_SIZE - 1)
            .execute()
        )

        rows = result.data or []

        for row in rows:
            if row.get("post_id"):
                existing_ids.add(str(row["post_id"]))

        if len(rows) < PAGE_SIZE:
            break

        offset += PAGE_SIZE

    print("Existing embedding records:", len(existing_ids))

    return existing_ids


# ==================================================
# FETCH EXISTING POSTS
# ==================================================

def get_existing_posts():

    client = backend.require_supabase()

    posts = []
    offset = 0

    print("\nFetching existing posts from Supabase...")

    while True:

        result = (
            client.table("posts")
            .select("id,user_id,image_url")
            .range(offset, offset + PAGE_SIZE - 1)
            .execute()
        )

        rows = result.data or []

        for post in rows:

            image_url = post.get("image_url")

            if image_url and image_url.strip():
                posts.append(post)

        if len(rows) < PAGE_SIZE:
            break

        offset += PAGE_SIZE

    print("Posts containing images:", len(posts))

    return posts


# ==================================================
# DOWNLOAD EXISTING IMAGE
# ==================================================

async def download_image(http_client, image_url):

    parsed_url = urlparse(image_url)

    if parsed_url.scheme not in ("http", "https"):
        raise ValueError("Invalid image URL. Expected HTTP or HTTPS.")

    response = await http_client.get(image_url)

    response.raise_for_status()

    image_bytes = response.content

    if not image_bytes:
        raise ValueError("Downloaded image is empty.")

    if len(image_bytes) > backend.MAX_FILE_SIZE:
        raise ValueError("Image exceeds the 20 MB limit.")

    filename = parsed_url.path.split("/")[-1]

    if not filename:
        filename = "existing_post_image.jpg"

    return image_bytes, filename


# ==================================================
# GENERATE AND SAVE EMBEDDINGS
# ==================================================

async def migrate_post(http_client, post, existing_ids):

    global SUCCESS_COUNT
    global SKIPPED_COUNT
    global FAILED_COUNT

    post_id = str(post["id"])
    user_id = post.get("user_id")
    image_url = post.get("image_url")

    print("\n" + "=" * 55)
    print("Processing post:", post_id)

    # Skip posts that already have an embedding record.

    if post_id in existing_ids:

        print("SKIPPED: Embedding already exists.")

        SKIPPED_COUNT += 1
        return

    try:

        if not user_id:
            raise ValueError("Post does not have a user_id.")

        if not image_url:
            raise ValueError("Post does not have an image_url.")

        # Download image from public Supabase Storage.

        image_bytes, filename = await download_image(
            http_client,
            image_url
        )

        # Use your existing image-processing function.

        image, details = backend.process_image(
            image_bytes,
            filename
        )

        # Generate DINOv2 embedding.

        dinov2_embedding = (
            backend.generate_dinov2_embedding(image)
        )

        # Generate SigLIP 2 embedding.

        siglip_embedding = (
            backend.generate_siglip_embedding(image)
        )

        # Generate perceptual hash.

        phash_value = backend.generate_phash(image)

        # Verify embedding dimensions.

        if len(dinov2_embedding) != 384:
            raise ValueError(
                f"Expected 384 DINOv2 dimensions, "
                f"received {len(dinov2_embedding)}."
            )

        if len(siglip_embedding) != 768:
            raise ValueError(
                f"Expected 768 SigLIP dimensions, "
                f"received {len(siglip_embedding)}."
            )

        # Save all embedding data in Supabase.

        payload = {
            "post_id": post_id,
            "user_id": str(user_id),
            "image_url": image_url,
            "dinov2_embedding": dinov2_embedding,
            "siglip_embedding": siglip_embedding,
            "phash": phash_value,
        }

        result = (
            backend.require_supabase()
            .table("post_image_embeddings")
            .insert(payload)
            .execute()
        )

        if not result.data:
            raise RuntimeError(
                "Supabase did not confirm the embedding insertion."
            )

        SUCCESS_COUNT += 1

        print("SUCCESS: Embeddings saved.")
        print("DINOv2 dimensions:", len(dinov2_embedding))
        print("SigLIP dimensions:", len(siglip_embedding))
        print("pHash:", phash_value)

    except Exception as error:

        FAILED_COUNT += 1

        print("FAILED:", post_id)
        print("Reason:", repr(error))


# ==================================================
# MAIN MIGRATION
# ==================================================

async def run_migration():

    global SUCCESS_COUNT
    global SKIPPED_COUNT
    global FAILED_COUNT

    print("\n")
    print("=" * 55)
    print("KINDRED EXISTING IMAGE EMBEDDING MIGRATION")
    print("=" * 55)

    backend.require_supabase()

    # Load both AI models using your existing backend lifespan.

    async with backend.lifespan(backend.app):

        print("\nAI models loaded.")

        if backend.model is None:
            raise RuntimeError("SigLIP 2 model is not loaded.")

        if backend.dinov2_model is None:
            raise RuntimeError("DINOv2 model is not loaded.")

        # Fetch existing data.

        existing_ids = get_existing_embedding_post_ids()

        posts = get_existing_posts()

        if not posts:

            print("\nNo existing image posts found.")
            return

        print("\nStarting migration...")
        print("Total images to check:", len(posts))

        timeout = httpx.Timeout(
            HTTP_TIMEOUT,
            connect=20.0
        )

        async with httpx.AsyncClient(
            timeout=timeout,
            follow_redirects=True
        ) as http_client:

            for index, post in enumerate(posts, start=1):

                print(
                    f"\nProgress: {index}/{len(posts)}"
                )

                await migrate_post(
                    http_client,
                    post,
                    existing_ids
                )

        print("\n")
        print("=" * 55)
        print("MIGRATION COMPLETED")
        print("=" * 55)

        print("Successfully saved:", SUCCESS_COUNT)
        print("Skipped:", SKIPPED_COUNT)
        print("Failed:", FAILED_COUNT)

        print("=" * 55)


# ==================================================
# RUN SCRIPT
# ==================================================

if __name__ == "__main__":

    try:
        asyncio.run(run_migration())

    except KeyboardInterrupt:
        print("\nMigration stopped by user.")

    except Exception as error:
        print("\nMigration could not complete:")
        print(repr(error))