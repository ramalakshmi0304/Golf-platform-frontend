import { createClient } from '@supabase/supabase-js';

// Vite-specific environment variable access
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing. Check your .env file.");
}

/**
 * Centered Supabase Client
 * Use this for Auth (Login/Signup) and real-time database subscriptions.
 * For sensitive operations (like updating roles), use the custom 'api' Axios service instead.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);