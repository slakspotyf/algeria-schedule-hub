
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const { user } = useAuth();

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
        if (onDisconnect) onDisconnect();
        toast({
          title: "Platform disconnected",
          description: `Your ${name} account has been disconnected`
        });
      } else {
        // Handle connect
        if (onConnect) onConnect();
        // In a real implementation, we would redirect to OAuth flow here
        // For now, we'll just show a toast notification
        toast({
          title: "Connect with " + name,
          description: "Redirecting to authentication page...",
        });
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
        "relative group overflow-hidden rounded-xl transition-all duration-300",
        "border border-border hover:border-primary/50",
        "transform hover:scale-105 hover:shadow-lg",
        "bg-gradient-to-br from-background to-secondary/20",
        isConnected && "ring-2 ring-primary/50"
      )}
    >
      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent 
                    -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <div className="p-6 flex flex-col items-center justify-center gap-4 h-full">
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110",
          color
        )}>
          <img src={icon} alt={name} className="w-8 h-8" />
        </div>
        
        <h3 className="font-medium text-center">{name}</h3>
        
        <Button 
          variant={isConnected ? "outline" : "default"}
          size="sm"
          className={cn(
            "mt-2 w-full transition-all duration-300",
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
              Processing
            </span>
          ) : isConnected ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  );
};

export default PlatformCard;
