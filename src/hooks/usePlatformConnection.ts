
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getProviderName } from '@/utils/platformUtils';
import { signInWithProvider } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

export const usePlatformConnection = (
  refreshPlatforms: () => void,
  connectPlatform: (name: string) => Promise<boolean>,
  disconnectPlatform: (name: string) => Promise<boolean>
) => {
  const { user } = useAuth();
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePlatformClick = async (platform: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect your social accounts",
        variant: "destructive"
      });
      return;
    }

    setConnectingPlatform(platform.name);
    setIsAnimating(true);
    
    try {
      if (platform.isConnected) {
        await disconnectPlatform(platform.name);
        toast({
          title: "Platform disconnected",
          description: `Your ${platform.name} account has been disconnected`
        });
      } else {
        // Get the OAuth provider for this platform
        const provider = getProviderName(platform.name);
        
        if (provider) {
          // Initiate social login flow for this platform
          await signInWithProvider(provider);
          // The OAuth redirect will happen, and when the user returns
          // the connection will be established in the AuthContext
          
          // Success toast will be shown after return from OAuth flow
        } else {
          // For platforms without direct OAuth
          await connectPlatform(platform.name);
          toast({
            title: "API Connection Required",
            description: `Please go to the Connections page to set up your ${platform.name} API credentials`
          });
        }
      }
    } catch (error) {
      console.error("Error toggling platform:", error);
      toast({
        title: "Error",
        description: `Failed to ${platform.isConnected ? 'disconnect' : 'connect'} ${platform.name}`,
        variant: "destructive"
      });
    } finally {
      setConnectingPlatform(null);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  // Check for OAuth response in URL when component mounts
  const checkOAuthResponse = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // If we have a new OAuth session
    if (session?.provider_token && session?.provider_refresh_token) {
      // The provider information might be in user metadata or elsewhere
      // Get provider info from user metadata
      const providerInfo = session.user?.app_metadata?.provider || 'unknown';
      
      // Store the OAuth tokens
      const tokens = {
        accessToken: session.provider_token,
        refreshToken: session.provider_refresh_token,
        providerUserId: session.user?.id,
        profileData: session.user?.user_metadata
      };
      
      await connectPlatform(providerInfo);
      
      toast({
        title: "Platform Connected",
        description: `Your ${providerInfo} account has been successfully connected`
      });
      
      // Refresh platform connections
      refreshPlatforms();
    }
  };

  return {
    connectingPlatform,
    isAnimating,
    handlePlatformClick,
    checkOAuthResponse
  };
};
