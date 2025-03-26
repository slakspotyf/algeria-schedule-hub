
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import SocialConnections from '@/components/SocialConnections';
import { 
  BarChart, Calendar, Clock, PlusCircle 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Get first part of email for greeting
  const username = user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, {username}!</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your content</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 transition duration-300 hover:shadow-md hover:bg-background/80">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Posts</p>
                  <h3 className="text-3xl font-bold mt-1">0</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">10</span> posts remaining on free plan
                </p>
              </div>
            </div>
            
            <div className="glass-card p-6 transition duration-300 hover:shadow-md hover:bg-background/80">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Scheduled Posts</p>
                  <h3 className="text-3xl font-bold mt-1">0</h3>
                </div>
                <div className="p-2 bg-accent/10 rounded-full">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  No upcoming posts scheduled
                </p>
              </div>
            </div>
            
            <div className="glass-card p-6 transition duration-300 hover:shadow-md hover:bg-background/80">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Posted Content</p>
                  <h3 className="text-3xl font-bold mt-1">0</h3>
                </div>
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Clock className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Create your first post to get started
                </p>
              </div>
            </div>
          </div>

          {/* Connected Platforms */}
          <SocialConnections />
          
          {/* Empty State - Recent Posts */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
            <div className="glass-card p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first post to schedule and automate your content across multiple platforms.
              </p>
              <Button asChild className="rounded-full animate-pulse hover:animate-none">
                <a href="/dashboard/new-post">Create Your First Post</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
