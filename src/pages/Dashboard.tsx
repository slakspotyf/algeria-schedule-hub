
import { useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import SocialConnections from '@/components/social/SocialConnections';
import N8nIntegration from '@/components/N8nIntegration';

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { subscription, isLoading: subscriptionLoading } = usePayment();

  useEffect(() => {
    // Update document title
    document.title = "Dashboard | Sahla-Post";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
              <p className="text-muted-foreground mt-1">
                Manage and automate your social media content in one place
              </p>
            </div>
          </div>

          {/* Main dashboard grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - wider for social connections */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 bg-gradient-to-br from-background to-secondary/20 border border-border">
                <h2 className="text-xl font-semibold mb-4">Social Media Connections</h2>
                <SocialConnections />
              </Card>
              
              {/* Additional dashboard cards can go here */}
            </div>
            
            {/* Right column - automations & integrations */}
            <div className="space-y-6">
              <N8nIntegration />
              
              {/* Subscription status card */}
              <Card className="p-6 bg-gradient-to-br from-background to-secondary/20 border border-border">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {subscription ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Subscription</h3>
                    <p className="text-muted-foreground">
                      {subscriptionLoading 
                        ? "Loading subscription status..."
                        : subscription 
                          ? `${subscription.plan_id.charAt(0).toUpperCase() + subscription.plan_id.slice(1)} plan - Active` 
                          : "No active subscription"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
