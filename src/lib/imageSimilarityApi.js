
import { File } from 'expo-file-system';
import { getSupabaseAuthorizationHeader } from './supabase';

// Backend URL configuration:
// Web on the same computer: http://127.0.0.1:8000
// Android Studio emulator: http://10.0.2.2:8000
// Physical phone: http://YOUR_COMPUTER_LAN_IP:8000
//
// EXPO_PUBLIC_IMAGE_SIMILARITY_API_URL can override the default.
const API_BASE_URL = (
  process.env.EXPO_PUBLIC_IMAGE_SIMILARITY_API_URL ||
  'http://10.0.2.2:8000'
).replace(/\/$/, '');

const readApiResponse = async (response) => {
  const responseText = await response.text();

  if (!responseText) return {};

  try {
    return JSON.parse(responseText);
  } catch {
    return {
      detail: responseText || `Request failed (${response.status})`,
    };
  }
};

const getErrorMessage = (result, status, fallback) => {
  const detail = result?.detail;

  if (typeof detail === 'string') return detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item?.msg || String(item)).join(', ');
  }

  return result?.message || ` ${fallback} (HTTP ${status})`.trim();
};

// Build multipart form data using Expo's File implementation.
// Do not manually set Content-Type: fetch adds the multipart boundary.
const createImageFormData = (imageUri, options = {}) => {
  if (!imageUri) {
    throw new Error('Please select an image first.');
  }

  const file = new File(imageUri);
  const formData = new FormData();

  formData.append('file', file);
  formData.append(
    'save_embedding',
    options.saveEmbedding ? 'true' : 'false'
  );

  if (options.postId) {
    formData.append('post_id', String(options.postId));
  }

  if (options.imageUrl) {
    formData.append('image_url', options.imageUrl);
  }

  return formData;
};

const getAuthHeaders = async () => {
  const headers = await getSupabaseAuthorizationHeader();

  if (!headers?.Authorization) {
    throw new Error(
      'Your Kindred session has expired. Please sign in again.'
    );
  }

  return {
    ...headers,
    Accept: 'application/json',
  };
};

// Check whether the FastAPI service is reachable.
export const testImageSimilarityBackend = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const health = await readApiResponse(response);

    if (!response.ok) {
      throw new Error(
        getErrorMessage(
          health,
          response.status,
          'Backend health check failed'
        )
      );
    }

    return {
      success: true,
      message: 'Kindred successfully connected to FastAPI!',
      health,
    };
  } catch (error) {
    console.error(
      '[ImageSimilarity] Backend connection error:',
      error
    );

    throw new Error(
      error?.message?.includes('Network request failed')
        ? `Cannot reach the image similarity server at ${API_BASE_URL}. Check the API URL and make sure FastAPI is running.`
        : error.message ||
        'Could not connect to the image similarity server.'
    );
  }
};

// Search indexed Kindred post images.
// This does not save a new embedding.
export const searchSimilarImages = async (imageUri) => {
  try {
    const headers = await getAuthHeaders();

    const formData = createImageFormData(imageUri, {
      saveEmbedding: false,
    });

    const response = await fetch(
      `${API_BASE_URL}/api/v1/image-similarity/search`,
      {
        method: 'POST',
        headers,
        body: formData,
      }
    );

    const result = await readApiResponse(response);

    if (!response.ok) {
      throw new Error(
        getErrorMessage(
          result,
          response.status,
          'Similarity search failed'
        )
      );
    }

    if (result.success === false) {
      throw new Error(
        result.message || 'Similarity search was not successful.'
      );
    }

    return result;
  } catch (error) {
    console.error('[ImageSimilarity] Search error:', error);
    throw error;
  }
};

// Save the embedding after the post has been created in Supabase.
export const savePostImageEmbedding = async ({
  imageUri,
  postId,
  imageUrl,
}) => {
  try {
    if (!imageUri) {
      throw new Error('The selected image is missing.');
    }

    if (!postId || !imageUrl) {
      throw new Error(
        'Post ID and image URL are required to save the embedding.'
      );
    }

    const headers = await getAuthHeaders();

    const formData = createImageFormData(imageUri, {
      saveEmbedding: true,
      postId,
      imageUrl,
    });

    const response = await fetch(
      `${API_BASE_URL}/api/v1/image-similarity/search`,
      {
        method: 'POST',
        headers,
        body: formData,
      }
    );

    const result = await readApiResponse(response);

    if (!response.ok) {
      throw new Error(
        getErrorMessage(
          result,
          response.status,
          'Embedding save failed'
        )
      );
    }

    if (result.success === false) {
      throw new Error(
        result.message || 'The image embedding could not be saved.'
      );
    }

    return result;
  } catch (error) {
    console.error(
      '[ImageSimilarity] Embedding save error:',
      error
    );

    throw error;
  }
};
