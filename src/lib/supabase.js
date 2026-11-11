import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Check Supabase configuration
if (!supabaseUrl) {
  console.warn(
    '[Supabase Configuration] Missing EXPO_PUBLIC_SUPABASE_URL environment variable. Please verify your .env file.'
  );
}

if (!supabasePublishableKey) {
  console.warn(
    '[Supabase Configuration] Missing EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable. Please verify your .env file.'
  );
}

// Initialize Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabasePublishableKey || '',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// ==================================================
// GET CURRENT USER'S ACCESS TOKEN
// ==================================================

export const getSupabaseAccessToken = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session) {
      throw new Error(
        'No active session. Please log in to Kindred.'
      );
    }

    return session.access_token;

  } catch (error) {
    console.error(
      '[Supabase Authentication] Failed to retrieve access token:',
      error.message
    );

    throw error;
  }
};

// ==================================================
// GET AUTHORIZATION HEADER FOR FASTAPI
// ==================================================

export const getSupabaseAuthorizationHeader = async () => {
  const accessToken = await getSupabaseAccessToken();

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

// Default export
export default supabase;