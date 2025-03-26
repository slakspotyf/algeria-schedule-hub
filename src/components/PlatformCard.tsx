
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithProvider } from '@/lib/supabase';

interface PlatformCardProps {
  name: string;
  icon: string;
  color: string;
  isConnected?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const PlatformCard = ({ 
  name, 
  icon, 
  color, 
  isConnected = false,
  onConnect,
  onDisconnect
}: PlatformCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { user, isDemoMode, signInWithSocialProvider } = useAuth();

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

  const handleAuth = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect your social accounts",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      if (isConnected) {
        // Handle disconnect
        if (onDisconnect) await onDisconnect();
        toast({
          title: "Platform disconnected",
          description: `Your ${name} account has been disconnected`
        });
      } else {
        // Get the OAuth provider for this platform
        const provider = getProviderName(name);
        
        if (provider && !isDemoMode) {
          // Initiate social login flow for this platform
          try {
            await signInWithSocialProvider(provider);
            // After successful OAuth, onConnect will be called when redirected back
          } catch (error) {
            console.error("Error connecting platform:", error);
            throw error;
          }
        } else {
          // For demo mode or platforms without direct OAuth
          if (onConnect) await onConnect();
          toast({
            title: "Platform connected",
            description: `Your ${name} account has been connected`
          });
        }
      }
    } catch (error) {
      console.error("Error connecting platform:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect platform. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-500",
        "border border-border hover:border-primary/50",
        "transform hover:scale-105 hover:shadow-lg",
        "bg-gradient-to-br from-background to-secondary/20",
        isConnected && "ring-2 ring-primary/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Effect */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-transform duration-1000",
          isHovered ? "translate-x-full" : "-translate-x-full"
        )}
      ></div>
      
      <div className="p-6 flex flex-col items-center justify-center gap-4 h-full">
        <div 
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-500",
            color,
            isHovered && "scale-110 shadow-md"
          )}
        >
          <img src={icon} alt={name} className="w-8 h-8" />
        </div>
        
        <h3 className="font-medium text-center">{name}</h3>
        
        <div className="mt-2 w-full">
          <Button 
            variant={isConnected ? "outline" : "default"}
            size="sm"
            className={cn(
              "w-full transition-all duration-300",
              isConnected ? "bg-background text-foreground" : "text-white",
              isConnected && "hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            )}
            onClick={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting
              </span>
            ) : isConnected ? (
              <span>Disconnect</span>
            ) : (
              <span>Connect {name}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlatformCard;
