
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use the values from our supabase/config.toml file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qgctizhfwngianypbztg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnY3Rpemhmd25naWFueXBienRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NTY4NzcsImV4cCI6MjA1ODUzMjg3N30.ZwjlRx3_VFyLHpeQBvXBdPJrKN2ISnk8y_JbY8OFizY';

// Log a warning if credentials are missing but don't crash the app
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using default Supabase credentials. For full functionality with OAuth providers, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

// Create the Supabase client with proper auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
  }
});

// OAuth sign-in helper functions
export const signInWithProvider = async (provider: 'google' | 'facebook' | 'twitter' | 'linkedin_oidc') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    }
  });
  
  if (error) throw error;
  return data;
};

// Export a function to check if we're in demo mode
export const isInDemoMode = () => {
  return !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
};
