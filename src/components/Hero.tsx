
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-70 animate-pulse-slow"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hero content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
              Automate Your Social Media Presence in Algeria
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Schedule, post, and analyze your content across multiple platforms with one intuitive dashboard. Save time and grow your audience effortlessly.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="rounded-full text-base px-8">
                <a href="#signup">Get Started Free</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full text-base px-8">
                <a href="#demo">Watch Demo</a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
              No credit card required. 10 free posts per month.
            </p>
          </div>
          
          {/* Hero image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-50"></div>
              <div className="glass-card overflow-hidden p-2 animate-scale">
                <img 
                  src="https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
                  alt="Sahla-Post Dashboard Preview" 
                  className="w-full h-auto rounded-xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -top-5 -right-5 md:top-5 md:right-0 glass-card py-2 px-4 rounded-full shadow-lg animate-float">
              <p className="text-sm font-medium">7 Social Platforms</p>
            </div>
            <div className="absolute bottom-5 -left-5 md:bottom-10 md:-left-10 glass-card py-2 px-4 rounded-full shadow-lg animate-float" style={{ animationDelay: "1s" }}>
              <p className="text-sm font-medium">Automated Posting</p>
            </div>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="mt-16 md:mt-24 py-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground mb-6">Trusted by businesses across Algeria</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70">
            <div className="w-24 h-6 bg-foreground/80 rounded"></div>
            <div className="w-24 h-6 bg-foreground/80 rounded"></div>
            <div className="w-24 h-6 bg-foreground/80 rounded"></div>
            <div className="w-24 h-6 bg-foreground/80 rounded"></div>
            <div className="w-24 h-6 bg-foreground/80 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
