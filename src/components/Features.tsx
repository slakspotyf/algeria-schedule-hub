
import { CalendarDays, Repeat, BarChart3, Layers, Globe, Lock } from 'lucide-react';

const features = [
  {
    icon: <CalendarDays className="h-10 w-10 text-primary" />,
    title: "Easy Scheduling",
    description: "Plan your content calendar weeks or months in advance with our intuitive scheduling interface."
  },
  {
    icon: <Repeat className="h-10 w-10 text-primary" />,
    title: "Auto-Posting",
    description: "Set it and forget it. Your content will automatically post at optimal times for maximum engagement."
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "Analytics Dashboard",
    description: "Track performance across all platforms in one place with detailed engagement metrics."
  },
  {
    icon: <Layers className="h-10 w-10 text-primary" />,
    title: "Content Library",
    description: "Store and organize all your media files in one centralized, easy-to-access location."
  },
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: "Multiple Platforms",
    description: "Connect and manage all your social accounts from YouTube to LinkedIn in one dashboard."
  },
  {
    icon: <Lock className="h-10 w-10 text-primary" />,
    title: "Secure Access",
    description: "Your account and social media connections are protected with enterprise-grade security."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full filter blur-3xl"></div>
      
      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold animate-fade-in">
            Streamline Your Social Media Workflow
          </h2>
          <p className="mt-4 text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Sahla-Post provides all the tools you need to manage your social media presence efficiently
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground flex-grow">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 md:mt-32 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-30"></div>
          <div className="glass-card p-8 md:p-12 relative">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 animate-fade-in-left">
                  Create Once, Share Everywhere
                </h2>
                <p className="text-muted-foreground mb-6 animate-fade-in-left" style={{ animationDelay: "0.1s" }}>
                  Upload your content once and customize it for each platform automatically. Save hours of manual work with our smart adaptation tools.
                </p>
                <ul className="space-y-3 animate-fade-in-left" style={{ animationDelay: "0.2s" }}>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    <span>Automatic content resizing for each platform</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    <span>Caption optimization with platform-specific hashtags</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    <span>Preview your posts before they go live</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 animate-fade-in-right">
                <img 
                  src="https://images.unsplash.com/photo-1469041797191-50ace28483c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
                  alt="Content creation workflow" 
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
