
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePlatformConnections } from '@/hooks/usePlatformConnections';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import PlatformIcon from './PlatformIcon';
import { usePlatformConnection } from '@/hooks/usePlatformConnection';
import { triggerN8nWebhook, startSubscriptionListener } from '@/utils/n8nIntegration';

const SocialConnections = () => {
  const { platforms, isLoading, connectPlatform, disconnectPlatform, refreshPlatforms } = usePlatformConnections();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const {
    connectingPlatform,
    isAnimating,
    handlePlatformClick,
    checkOAuthResponse
  } = usePlatformConnection(refreshPlatforms, connectPlatform, disconnectPlatform);

  // Check for OAuth response in URL when component mounts
  useEffect(() => {
    checkOAuthResponse();
    
    // Start the subscription listener when the component mounts
    const initializeWebhook = async () => {
      try {
        await startSubscriptionListener();
        console.log("Subscription webhook listener started");
      } catch (error) {
        console.error("Failed to start subscription webhook listener:", error);
      }
    };
    
    initializeWebhook();
  }, []);

  // Notify n8n when platforms change
  useEffect(() => {
    if (user && platforms.length > 0 && !isLoading) {
      const connectedPlatforms = platforms.filter(p => p.isConnected).map(p => p.name);
      
      // Only send the webhook if there are connected platforms
      if (connectedPlatforms.length > 0) {
        const webhookUrl = "https://achraf40.app.n8n.cloud/webhook/91b1d56c-b9a2-49db-9671-d7e4260765de";
        
        triggerN8nWebhook(webhookUrl, {
          user_email: user.email,
          user_id: user.id,
          connected_platforms: connectedPlatforms,
          event_type: "platform_connection_update",
          timestamp: new Date().toISOString()
        }).then(() => {
          console.log("n8n webhook triggered for platform updates");
        }).catch(error => {
          console.error("Error triggering n8n webhook:", error);
        });
      }
    }
  }, [platforms, user, isLoading]);

  // Filter to only show YouTube, TikTok, Facebook, Instagram
  const filteredPlatforms = platforms.filter(p => 
    ['YouTube', 'TikTok', 'Facebook', 'Instagram'].includes(p.name)
  );
  
  const hasConnections = filteredPlatforms.some(p => p.isConnected);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t('connect_platforms')}</h2>
      </div>
      
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
              {filteredPlatforms.map((platform) => (
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
              <div className="mt-6 p-4 border border-dashed border-yellow-300/50 rounded-lg bg-yellow-50/10 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <p className="text-sm text-muted-foreground">
                  {t('dashboard_connect_accounts')}
                </p>
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-muted-foreground group transition-all duration-300 hover:bg-primary/5"
                onClick={() => {
                  const webhookUrl = "https://achraf40.app.n8n.cloud/webhook/91b1d56c-b9a2-49db-9671-d7e4260765de";
                  if (user) {
                    triggerN8nWebhook(webhookUrl, {
                      user_email: user.email,
                      request_type: "sync_all_platforms"
                    }).then(() => {
                      toast({
                        title: "Automation Started",
                        description: "Your social media platforms are being synced with automations",
                      });
                    });
                  }
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" /> 
                {hasConnections ? t('dashboard_sync_automations') : t('dashboard_connect_more')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialConnections;
