
import { useState } from 'react';
import PlatformCard from './PlatformCard';
import { usePlatformConnections } from '@/hooks/usePlatformConnections';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';

const Platforms = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { platforms, isLoading, connectPlatform, disconnectPlatform } = usePlatformConnections();

  const handleConnect = async (platformName: string) => {
    setIsAnimating(true);
    await connectPlatform(platformName);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleDisconnect = async (platformName: string) => {
    setIsAnimating(true);
    await disconnectPlatform(platformName);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <section id="platforms" className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/50 relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full opacity-60 animate-spin-slow"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/10 rounded-full opacity-60 animate-spin-slow" style={{ animationDuration: '30s' }}></div>
      
      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold animate-fade-in">
            Connect All Your Social Platforms
          </h2>
          <p className="mt-4 text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Sahla-Post seamlessly integrates with all major social media platforms
          </p>
        </div>
        
        <div 
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 transition-all duration-500",
            isAnimating && "scale-[0.98] opacity-90"
          )}
        >
          {isLoading ? (
            // Loading skeleton
            Array(6).fill(0).map((_, index) => (
              <div 
                key={`skeleton-${index}`} 
                className="h-[200px] rounded-xl bg-muted/50 animate-pulse"
              ></div>
            ))
          ) : (
            // Actual platform cards
            platforms.map((platform, index) => (
              <PlatformCard
                key={platform.name}
                name={platform.name}
                icon={platform.icon}
                color={platform.color}
                isConnected={platform.isConnected}
                onConnect={() => handleConnect(platform.name)}
                onDisconnect={() => handleDisconnect(platform.name)}
              />
            ))
          )}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" size="sm" className="text-muted-foreground">
            <PlusCircle className="h-4 w-4 mr-2" /> More Platforms Coming Soon
          </Button>
        </div>
        
        <div className="mt-20 md:mt-32 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 animate-fade-in">
              Ready to Simplify Your Social Media Management?
            </h2>
            <p className="text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Join thousands of content creators and businesses in Algeria who save hours every week with Sahla-Post.
            </p>
            <div className="inline-block bg-white shadow-md rounded-full p-1 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-3 font-medium transition-all">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Platforms;
