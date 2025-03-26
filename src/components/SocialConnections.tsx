
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePlatformConnections } from '@/hooks/usePlatformConnections';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { PlusCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type PlatformIconProps = {
  name: string;
  icon: string;
  color: string;
  isConnected: boolean;
  onClick: () => void;
  isLoading?: boolean;
};

const PlatformIcon = ({ name, icon, color, isConnected, onClick, isLoading }: PlatformIconProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto py-4 px-4 flex-col items-center justify-center gap-3 rounded-xl relative overflow-hidden",
        isConnected ? "border-primary/50" : "border-dashed",
        "transition-all duration-300 hover:scale-105"
      )}
      onClick={onClick}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full transition-transform duration-1000",
          isHovered && "translate-x-full"
        )}
      ></div>
      
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center relative transition-all duration-300",
        isConnected ? color : `${color}/10`,
        isHovered && "scale-110"
      )}>
        {isLoading ? (
          <RefreshCw className="w-6 h-6 text-white animate-spin" />
        ) : (
          <img src={icon} alt={name} className="w-6 h-6" />
        )}
        {isConnected && (
          <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-background w-4 h-4 rounded-full" />
        )}
      </div>
      <span className="text-sm relative z-10">
        {isConnected ? `${name} Connected` : `Connect ${name}`}
      </span>
    </Button>
  );
};

const SocialConnections = () => {
  const { platforms, isLoading, connectPlatform, disconnectPlatform } = usePlatformConnections();
  const { user, signInWithSocialProvider } = useAuth();
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Map platform name to OAuth provider
  const getProviderName = (platformName: string): 'google' | 'facebook' | 'twitter' | 'linkedin_oidc' | null => {
    const providerMap: Record<string, 'google' | 'facebook' | 'twitter' | 'linkedin_oidc'> = {
      'YouTube': 'google',
      'Google': 'google',
      'Facebook': 'facebook',
      'Instagram': 'facebook', // Instagram uses Facebook login
      'Twitter': 'twitter',
      'Twitter/X': 'twitter',
      'LinkedIn': 'linkedin_oidc',
    };
    
    return providerMap[platformName] || null;
  };

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
          try {
            await signInWithSocialProvider(provider);
            // After successful OAuth, the platform will be connected
          } catch (error) {
            console.error("Error connecting platform:", error);
            throw error;
          }
        } else {
          // For platforms without direct OAuth
          await connectPlatform(platform.name);
          toast({
            title: "Platform connected",
            description: `Your ${platform.name} account has been connected successfully`
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

  // Get first 4 platforms for main display
  const displayPlatforms = platforms.slice(0, 4);
  const hasConnections = platforms.some(p => p.isConnected);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Connected Platforms</h2>
      <div className={cn(
        "glass-card p-6 transition-all duration-300",
        isAnimating && "scale-[0.98] opacity-95"
      )}>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-muted/50 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayPlatforms.map((platform) => (
                <PlatformIcon
                  key={platform.name}
                  name={platform.name}
                  icon={platform.icon}
                  color={platform.color}
                  isConnected={platform.isConnected}
                  onClick={() => handlePlatformClick(platform)}
                  isLoading={connectingPlatform === platform.name}
                />
              ))}
            </div>
            
            {!hasConnections && (
              <div className="mt-6 p-4 border border-dashed border-yellow-300/50 rounded-lg bg-yellow-50/10 flex items-center gap-3 animate-pulse">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <p className="text-sm text-muted-foreground">
                  Connect your social media accounts to start posting content across platforms
                </p>
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm" className="text-muted-foreground group transition-all duration-300 hover:bg-primary/5">
                <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" /> 
                Connect More Platforms
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialConnections;
