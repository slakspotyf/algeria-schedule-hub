
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Log a warning if credentials are missing but don't crash the app
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase credentials. The app will function in demo mode. For full functionality, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

// Create the Supabase client with the URL and anonymous key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a function to check if we're in demo mode
export const isInDemoMode = () => {
  return !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
};
