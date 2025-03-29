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
        const demoPlatforms = defaultPlatforms.map(platform => ({
          ...platform,
          isConnected: Math.random() > 0.5
        }));
        setPlatforms(demoPlatforms);
        return;
      }
      
      const { data: oauthData, error: oauthError } = await supabase
        .from('connected_platforms')
        .select('*')
        .eq('user_id', user.id);

      if (oauthError) throw oauthError;
      
      const { data: apiData, error: apiError } = await supabase
        .from('platform_api_credentials')
        .select('*')
        .eq('user_id', user.id);
        
      if (apiError) throw apiError;

      const oauthConnections = new Set(oauthData.map(item => item.platform_name.toLowerCase()));
      const apiConnections = new Set(apiData.map(item => item.platform_name.toLowerCase()));
      
      const connectedPlatformNames = new Set([...oauthConnections, ...apiConnections]);
      
      const mergedPlatforms = defaultPlatforms.map(platform => {
        const isConnected = connectedPlatformNames.has(platform.name.toLowerCase());
        
        const oauthConnection = oauthData.find(conn => 
          conn.platform_name.toLowerCase() === platform.name.toLowerCase()
        );
        
        const apiConnection = apiData.find(conn => 
          conn.platform_name.toLowerCase() === platform.name.toLowerCase()
        );
        
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
      setPlatforms(defaultPlatforms);
    } finally {
      setIsLoading(false);
    }
  };

  const connectPlatform = async (platformName: string) => {
    if (!user) return false;
    
    if (isDemoMode) {
      setPlatforms(prev => 
        prev.map(p => p.name === platformName ? { ...p, isConnected: true } : p)
      );
      return true;
    }

    try {
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
    
    if (isDemoMode) {
      setPlatforms(prev => 
        prev.map(p => p.name === platformName ? { ...p, isConnected: false } : p)
      );
      return true;
    }

    try {
      await supabase
        .from('connected_platforms')
        .delete()
        .eq('user_id', user.id)
        .eq('platform_name', platformName);
        
      await supabase
        .from('platform_api_credentials')
        .delete()
        .eq('user_id', user.id)
        .eq('platform_name', platformName);

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
