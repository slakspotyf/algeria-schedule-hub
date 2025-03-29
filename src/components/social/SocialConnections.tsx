
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
  }, []);

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
              <Button variant="outline" size="sm" className="text-muted-foreground group transition-all duration-300 hover:bg-primary/5">
                <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" /> 
                {t('dashboard_connect_more')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialConnections;
