
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { triggerN8nWebhook } from '@/utils/n8nIntegration';
import { usePlatformConnections } from '@/hooks/usePlatformConnections';
import { CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';

const N8nIntegration = () => {
  const [webhookUrl, setWebhookUrl] = useState<string>("https://achraf40.app.n8n.cloud/webhook/91b1d56c-b9a2-49db-9671-d7e4260765de");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { platforms } = usePlatformConnections();
  
  const handleTriggerWorkflow = async () => {
    if (!webhookUrl) {
      toast({
        title: "Missing Webhook URL",
        description: "Please provide an n8n webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Collect data about connected platforms to send to n8n
      const connectedPlatforms = platforms
        .filter(p => p.isConnected)
        .map(p => p.name);
        
      // Send user data and platform connections to n8n
      await triggerN8nWebhook(webhookUrl, {
        user_email: user?.email,
        connected_platforms: connectedPlatforms,
        request_type: "dashboard_sync",
      });
      
      toast({
        title: "Workflow Triggered",
        description: "Your n8n workflow has been triggered successfully.",
      });
    } catch (error) {
      console.error("Failed to trigger n8n workflow:", error);
      toast({
        title: "Error",
        description: "Failed to trigger the workflow. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="p-6 bg-gradient-to-br from-background to-secondary/20 border border-border">
      <div className="flex items-start space-x-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <PlayCircle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">n8n Integration</h3>
          <p className="text-muted-foreground">
            Trigger workflows in n8n to automate your social media tasks
          </p>
        </div>
      </div>
      
      <div className="space-y-4 mt-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Connected to n8n</span>
        </div>
        <div className="flex items-center space-x-2">
          {platforms.filter(p => p.isConnected).length > 0 ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500" />
          )}
          <span>
            {platforms.filter(p => p.isConnected).length} platform(s) available for automation
          </span>
        </div>
        
        <div className="pt-2">
          <Input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="n8n Webhook URL"
            className="mb-3"
          />
          
          <Button 
            onClick={handleTriggerWorkflow}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Triggering...
              </span>
            ) : "Trigger n8n Workflow"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default N8nIntegration;
