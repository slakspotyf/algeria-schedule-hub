
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export type Platform = {
  name: string;
  icon: string;
  color: string;
  isConnected: boolean;
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
  profileData?: any;
}

export const usePlatformConnections = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isDemoMode } = useAuth();

  const defaultPlatforms = [
    {
      name: "YouTube",
      icon: "/assets/youtube.svg", 
      color: "bg-red-500",
      isConnected: false
    },
    {
      name: "Instagram",
      icon: "/assets/instagram.svg",
      color: "bg-pink-500",
      isConnected: false
    },
    {
      name: "TikTok",
      icon: "/assets/tiktok.svg",
      color: "bg-black",
      isConnected: false
    },
    {
      name: "Facebook",
      icon: "/assets/facebook.svg",
      color: "bg-blue-600",
      isConnected: false
    },
    {
      name: "Twitter/X",
      icon: "/assets/twitter.svg",
      color: "bg-sky-500",
      isConnected: false
    },
    {
      name: "LinkedIn",
      icon: "/assets/linkedin.svg",
      color: "bg-blue-700",
      isConnected: false
    }
  ];

  const fetchConnectedPlatforms = async () => {
    if (!user) {
      setPlatforms(defaultPlatforms);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        // In demo mode, return default platforms with some randomly connected
        const demoPlatforms = defaultPlatforms.map(platform => ({
          ...platform,
          isConnected: Math.random() > 0.5
        }));
        setPlatforms(demoPlatforms);
        return;
      }
      
      // Get connected platforms from database - first check connected_platforms table
      const { data: oauthData, error: oauthError } = await supabase
        .from('connected_platforms')
        .select('*')
        .eq('user_id', user.id);

      if (oauthError) throw oauthError;
      
      // Then check platform_api_credentials table for API key based connections
      const { data: apiData, error: apiError } = await supabase
        .from('platform_api_credentials')
        .select('*')
        .eq('user_id', user.id);
        
      if (apiError) throw apiError;

      // Combine the results from both tables
      const oauthConnections = new Set(oauthData.map(item => item.platform_name.toLowerCase()));
      const apiConnections = new Set(apiData.map(item => item.platform_name.toLowerCase()));
      
      // A platform is connected if it exists in either table
      const connectedPlatformNames = new Set([...oauthConnections, ...apiConnections]);
      
      const mergedPlatforms = defaultPlatforms.map(platform => {
        const isConnected = connectedPlatformNames.has(platform.name.toLowerCase());
        
        // Find the platform connection details
        const oauthConnection = oauthData.find(conn => 
          conn.platform_name.toLowerCase() === platform.name.toLowerCase()
        );
        
        const apiConnection = apiData.find(conn => 
          conn.platform_name.toLowerCase() === platform.name.toLowerCase()
        );
        
        // Merge data from both sources, prioritizing OAuth data
        return {
          ...platform,
          isConnected,
          userId: oauthConnection?.platform_user_id || apiConnection?.user_id,
          accessToken: oauthConnection?.access_token || apiConnection?.access_token,
          refreshToken: oauthConnection?.refresh_token || apiConnection?.refresh_token,
          profileData: oauthConnection?.profile_data || apiConnection?.additional_data
        };
      });

      setPlatforms(mergedPlatforms);
    } catch (error) {
      console.error("Error fetching platform connections:", error);
      toast({
        title: "Error",
        description: "Failed to load connected platforms",
        variant: "destructive"
      });
      // Fallback to default platforms
      setPlatforms(defaultPlatforms);
    } finally {
      setIsLoading(false);
    }
  };

  const connectPlatform = async (platformName: string) => {
    if (!user) return false;
    
    // In a real implementation, we would save the connection after OAuth
    if (isDemoMode) {
      // For demo, just update the UI
      setPlatforms(prev => 
        prev.map(p => p.name === platformName ? { ...p, isConnected: true } : p)
      );
      return true;
    }

    try {
      // Create a record in the connected_platforms table
      const { error } = await supabase
        .from('connected_platforms')
        .upsert({
          user_id: user.id,
          platform_name: platformName,
          platform_user_id: `user_${Math.random().toString(36).substring(7)}`,
          access_token: `temp_token_${Math.random().toString(36).substring(7)}`,
          profile_data: { username: `${platformName.toLowerCase()}_user` }
        });

      if (error) throw error;

      // Update local state
      setPlatforms(prev => 
        prev.map(p => p.name === platformName ? { ...p, isConnected: true } : p)
      );
      
      return true;
    } catch (error) {
      console.error("Error connecting platform:", error);
      return false;
    }
  };

  const disconnectPlatform = async (platformName: string) => {
    if (!user) return false;
    
    // For demo mode, just update UI
    if (isDemoMode) {
      setPlatforms(prev => 
        prev.map(p => p.name === platformName ? { ...p, isConnected: false } : p)
      );
      return true;
    }

    try {
      // Remove from connected_platforms table
      await supabase
        .from('connected_platforms')
        .delete()
        .eq('user_id', user.id)
        .eq('platform_name', platformName);
        
      // Also remove from platform_api_credentials if exists
      await supabase
        .from('platform_api_credentials')
        .delete()
        .eq('user_id', user.id)
        .eq('platform_name', platformName);

      // Update local state
      setPlatforms(prev => 
        prev.map(p => p.name === platformName ? { ...p, isConnected: false } : p)
      );
      
      return true;
    } catch (error) {
      console.error("Error disconnecting platform:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchConnectedPlatforms();
  }, [user]);

  return {
    platforms,
    isLoading,
    connectPlatform,
    disconnectPlatform,
    refreshPlatforms: fetchConnectedPlatforms
  };
};
