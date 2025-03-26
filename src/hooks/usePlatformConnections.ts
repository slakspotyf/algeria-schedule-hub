
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      
      // Get connected platforms from database
      const { data, error } = await supabase
        .from('connected_platforms')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Map database results to platform objects
      const connectedPlatformNames = new Set(data.map(item => item.platform_name.toLowerCase()));
      
      const mergedPlatforms = defaultPlatforms.map(platform => ({
        ...platform,
        isConnected: connectedPlatformNames.has(platform.name.toLowerCase())
      }));

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
      // Simulate platform connection - in reality this would happen after OAuth
      const platformData = {
        user_id: user.id,
        platform_name: platformName,
        platform_user_id: `demo_${platformName}_${user.id.substring(0, 8)}`,
        access_token: `demo_token_${Math.random().toString(36).substring(7)}`,
        profile_data: { username: `${platformName.toLowerCase()}_user` }
      };

      const { error } = await supabase
        .from('connected_platforms')
        .insert(platformData);

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
      const { error } = await supabase
        .from('connected_platforms')
        .delete()
        .eq('user_id', user.id)
        .eq('platform_name', platformName);

      if (error) throw error;

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
