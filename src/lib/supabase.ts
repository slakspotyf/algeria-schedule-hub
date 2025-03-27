
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
      scopes: getPlatformScopes(provider),
    }
  });
  
  if (error) throw error;
  return data;
};

// Get specific scopes needed for each platform
const getPlatformScopes = (provider: string): string => {
  switch (provider) {
    case 'google':
      // Scopes for YouTube access
      return 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube';
    case 'facebook':
      // Scopes for Facebook and Instagram
      return 'pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish';
    case 'twitter':
      // Twitter requires special scopes
      return 'tweet.read tweet.write users.read';
    case 'linkedin_oidc':
      // LinkedIn scopes
      return 'r_liteprofile w_member_social';
    default:
      return '';
  }
};

// Export a function to check if we're in demo mode
export const isInDemoMode = () => {
  return !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;
};

// Function to save OAuth tokens after successful authentication
export const saveOAuthConnection = async (provider: string, tokens: any) => {
  try {
    const user = supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('connected_platforms')
      .upsert({
        user_id: (await user).data.user?.id,
        platform_name: provider,
        platform_user_id: tokens.providerUserId || `${provider}_user`,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken || null,
        profile_data: tokens.profileData || null,
        token_expires_at: tokens.expiresAt ? new Date(tokens.expiresAt).toISOString() : null
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving OAuth connection:", error);
    return false;
  }
};
