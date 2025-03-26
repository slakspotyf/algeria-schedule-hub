
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import PlatformAPIConnection from '@/components/PlatformAPIConnection';
import { RefreshCw, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const platformsData = [
  {
    name: "YouTube",
    icon: "/assets/youtube.svg", 
    color: "bg-red-500",
  },
  {
    name: "Instagram",
    icon: "/assets/instagram.svg",
    color: "bg-pink-500",
  },
  {
    name: "TikTok",
    icon: "/assets/tiktok.svg",
    color: "bg-black",
  },
  {
    name: "Facebook",
    icon: "/assets/facebook.svg",
    color: "bg-blue-600",
  },
  {
    name: "Twitter/X",
    icon: "/assets/twitter.svg",
    color: "bg-sky-500",
  },
  {
    name: "LinkedIn",
    icon: "/assets/linkedin.svg",
    color: "bg-blue-700",
  }
];

const SocialMediaConnections = () => {
  const { user, isDemoMode } = useAuth();
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConnectedPlatforms();
  }, [user]);

  const fetchConnectedPlatforms = async () => {
    setIsLoading(true);
    
    try {
      if (isDemoMode) {
        // In demo mode, randomly set some platforms as connected
        const demoConnections = platformsData
          .filter(() => Math.random() > 0.5)
          .map(p => p.name);
        setConnectedPlatforms(demoConnections);
      } else if (user) {
        // Fetch connected platforms from Supabase
        const { data, error } = await supabase
          .from('platform_api_credentials')
          .select('platform_name')
          .eq('user_id', user.id);

        if (error) throw error;
        
        setConnectedPlatforms(data.map(item => item.platform_name));
      }
    } catch (error) {
      console.error("Error fetching connected platforms:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load connected platforms"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (platformName: string) => {
    if (isDemoMode) {
      // In demo mode, just update UI
      setConnectedPlatforms(prev => [...prev, platformName]);
      return;
    }
    
    // Real connection would be handled in the PlatformAPIConnection component
    // This function gets called after successful API key storage
    setConnectedPlatforms(prev => [...prev, platformName]);
  };

  const handleDisconnect = async (platformName: string) => {
    // Remove from connected platforms
    setConnectedPlatforms(prev => prev.filter(name => name !== platformName));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Social Media Connections</h1>
              <p className="text-muted-foreground mt-1">
                Connect your social media accounts to post directly from the dashboard
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchConnectedPlatforms} disabled={isLoading}>
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Refresh</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div 
                  key={`skeleton-${index}`} 
                  className="h-[220px] rounded-xl bg-muted/50 animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {platformsData.map((platform) => (
                <div 
                  key={platform.name}
                  className="glass-card p-6 h-[220px] transition-all duration-300 animate-fade-in"
                >
                  <PlatformAPIConnection
                    platformName={platform.name}
                    platformIcon={platform.icon}
                    platformColor={platform.color}
                    isConnected={connectedPlatforms.includes(platform.name)}
                    onConnect={() => handleConnect(platform.name)}
                    onDisconnect={() => handleDisconnect(platform.name)}
                  />
                </div>
              ))}
              
              <div className="glass-card p-6 h-[220px] border-dashed flex flex-col items-center justify-center text-muted-foreground transition-all duration-300 hover:bg-background">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-center mb-2">Add Custom Platform</h3>
                <p className="text-sm text-center mb-4">Connect to another platform</p>
                <Button variant="outline" className="mt-auto">
                  <Plus className="h-4 w-4 mr-2" /> Add Platform
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SocialMediaConnections;
