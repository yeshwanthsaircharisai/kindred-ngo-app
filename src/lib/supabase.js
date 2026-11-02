import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

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

export default supabase;

