
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, signInWithProvider } from '@/lib/supabase';
import { RefreshCw, LinkIcon, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PlatformAPIConnectionProps {
  platformName: string;
  platformIcon: string;
  platformColor: string;
  isConnected: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
}

const PlatformAPIConnection = ({
  platformName,
  platformIcon,
  platformColor,
  isConnected,
  onConnect,
  onDisconnect
}: PlatformAPIConnectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Map platform name to OAuth provider
  const getOAuthProvider = (platformName: string): 'google' | 'facebook' | 'twitter' | 'linkedin_oidc' | null => {
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

  const supportsOAuth = !!getOAuthProvider(platformName);

  const handleSaveAPICredentials = async () => {
    if (!apiKey && !supportsOAuth) {
      setError('API Key is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Store API credentials in Supabase
      const { error: supabaseError } = await supabase
        .from('platform_api_credentials')
        .upsert({
          user_id: user?.id,
          platform_name: platformName,
          api_key: apiKey,
          api_secret: apiSecret,
          created_at: new Date().toISOString()
        });

      if (supabaseError) throw supabaseError;

      await onConnect();
      
      toast({
        title: "Connected Successfully",
        description: `Your ${platformName} API credentials have been saved.`
      });
      
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Error saving API credentials:", err);
      setError(err.message || `Failed to connect to ${platformName}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthConnect = async () => {
    setIsLoading(true);
    
    try {
      const provider = getOAuthProvider(platformName);
      if (!provider) {
        throw new Error(`OAuth not supported for ${platformName}`);
      }
      
      await signInWithProvider(provider);
      // OAuth flow will redirect and then be handled on return
    } catch (err: any) {
      console.error("Error initiating OAuth flow:", err);
      setError(err.message || `Failed to connect to ${platformName}`);
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    
    try {
      // Remove API credentials from Supabase
      if (user) {
        // Remove from connected_platforms table (OAuth connections)
        await supabase
          .from('connected_platforms')
          .delete()
          .eq('user_id', user.id)
          .eq('platform_name', platformName);
          
        // Remove from platform_api_credentials table (API key connections)
        await supabase
          .from('platform_api_credentials')
          .delete()
          .eq('user_id', user.id)
          .eq('platform_name', platformName);
      }

      await onDisconnect();
      
      toast({
        title: "Disconnected",
        description: `Your ${platformName} account has been disconnected.`
      });
    } catch (err: any) {
      console.error("Error disconnecting platform:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || `Failed to disconnect from ${platformName}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConnectionInstructions = () => {
    if (supportsOAuth) {
      return `Connect your ${platformName} account with OAuth to post directly from the dashboard.`;
    }
    
    switch (platformName.toLowerCase()) {
      case 'youtube':
        return 'You need to create a project in Google Cloud Console and enable the YouTube Data API v3.';
      case 'facebook':
        return 'You need to create an app in Facebook Developer Portal and enable the necessary permissions.';
      case 'twitter':
      case 'twitter/x':
        return 'You need to create a project in Twitter Developer Portal and get API keys.';
      case 'instagram':
        return 'You need to create an app in Facebook Developer Portal and connect to the Instagram Graph API.';
      case 'linkedin':
        return 'You need to create an app in LinkedIn Developer Portal and request the necessary permissions.';
      case 'tiktok':
        return 'You need to register as a TikTok developer and create an app to get API credentials.';
      default:
        return `You need to register as a developer on ${platformName} and get API credentials.`;
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto ${platformColor}`}>
          <img src={platformIcon} alt={platformName} className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-medium text-center mb-2">{platformName}</h3>
        
        <p className="text-sm text-muted-foreground text-center mb-4">
          {isConnected 
            ? `Connected and ready to post` 
            : `Connect to post directly to ${platformName}`}
        </p>
        
        <div className="mt-auto">
          {isConnected ? (
            <Button 
              variant="outline"
              className="w-full"
              disabled={isLoading}
              onClick={handleDisconnect}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>Disconnect</>
              )}
            </Button>
          ) : supportsOAuth ? (
            <Button 
              variant="default"
              className="w-full"
              disabled={isLoading}
              onClick={handleOAuthConnect}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <><LinkIcon className="mr-2 h-4 w-4" /> Connect with {platformName}</>
              )}
            </Button>
          ) : (
            <Button 
              variant="default"
              className="w-full"
              disabled={isLoading}
              onClick={() => setIsDialogOpen(true)}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <><LinkIcon className="mr-2 h-4 w-4" /> Connect API</>
              )}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img src={platformIcon} alt={platformName} className="w-5 h-5" />
              Connect to {platformName}
            </DialogTitle>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="bg-secondary/30 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium mb-2">Instructions:</h4>
            <p className="text-sm text-muted-foreground">{getConnectionInstructions()}</p>
          </div>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="apiSecret">API Secret (if required)</Label>
              <Input
                id="apiSecret"
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Enter your API secret"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAPICredentials} disabled={isLoading}>
              {isLoading ? (
                <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Connecting...</>
              ) : (
                <>Connect</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlatformAPIConnection;
