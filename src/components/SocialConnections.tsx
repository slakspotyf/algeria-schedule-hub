
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePlatformConnections } from '@/hooks/usePlatformConnections';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type PlatformIconProps = {
  name: string;
  icon: string;
  color: string;
  isConnected: boolean;
  onClick: () => void;
};

const PlatformIcon = ({ name, icon, color, isConnected, onClick }: PlatformIconProps) => (
  <Button
    variant="outline"
    className={cn(
      "h-auto py-4 px-4 flex-col items-center justify-center gap-3 rounded-xl",
      isConnected ? "border-primary/50" : "border-dashed",
      "transition-all duration-300 hover:scale-105"
    )}
    onClick={onClick}
  >
    <div className={cn(
      "w-12 h-12 rounded-full flex items-center justify-center relative",
      isConnected ? color : `${color}/10`
    )}>
      <img src={icon} alt={name} className="w-6 h-6" />
      {isConnected && (
        <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-background w-4 h-4 rounded-full" />
      )}
    </div>
    <span className="text-sm">{isConnected ? `${name} Connected` : `Connect ${name}`}</span>
  </Button>
);

const SocialConnections = () => {
  const { platforms, isLoading, connectPlatform, disconnectPlatform } = usePlatformConnections();
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const handlePlatformClick = async (platform: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect your social accounts",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(platform.name);
    
    try {
      if (platform.isConnected) {
        await disconnectPlatform(platform.name);
        toast({
          title: "Platform disconnected",
          description: `Your ${platform.name} account has been disconnected`
        });
      } else {
        await connectPlatform(platform.name);
        toast({
          title: "Platform connected",
          description: `Your ${platform.name} account has been connected successfully`
        });
      }
    } catch (error) {
      console.error("Error toggling platform:", error);
      toast({
        title: "Error",
        description: `Failed to ${platform.isConnected ? 'disconnect' : 'connect'} ${platform.name}`,
        variant: "destructive"
      });
    } finally {
      setIsConnecting(null);
    }
  };

  // Get first 4 platforms for main display
  const displayPlatforms = platforms.slice(0, 4);
  const hasConnections = platforms.some(p => p.isConnected);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Connected Platforms</h2>
      <div className="glass-card p-6">
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
                />
              ))}
            </div>
            
            {!hasConnections && (
              <div className="mt-6 p-4 border border-dashed border-yellow-300/50 rounded-lg bg-yellow-50/10 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <p className="text-sm text-muted-foreground">
                  Connect your social media accounts to start posting content across platforms
                </p>
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm" className="text-muted-foreground">
                <PlusCircle className="h-4 w-4 mr-2" /> Connect More Platforms
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialConnections;
