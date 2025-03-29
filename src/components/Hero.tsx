
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden relative desert-pattern">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-70 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-70 animate-pulse-slow"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hero content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              {t('hero_badge')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('hero_title')}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t('hero_description')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" className="rounded-full text-base px-8 bg-primary hover:bg-primary/90 group">
                <Link to="/signup" className="flex items-center">
                  {t('hero_cta')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="rounded-full text-base px-8 border-primary text-primary hover:bg-primary/10"
                onClick={() => {
                  // In a real app, this would show a video demo
                  alert("Demo video would play here!");
                }}
              >
                <Link to="#demo">{t('hero_watch_demo')}</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {t('hero_free_plan')}
            </p>
          </div>
          
          {/* Hero image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-70"></div>
              <div className="glass overflow-hidden p-2 animate-scale rounded-2xl border border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
                  alt="Sahla-Post Dashboard Preview" 
                  className="w-full h-auto rounded-xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -top-5 -right-5 md:top-5 md:right-0 glass-card py-2 px-4 rounded-full shadow-lg animate-float border border-white/30">
              <p className="text-sm font-medium text-primary">4 Social Platforms</p>
            </div>
            <div className="absolute bottom-5 -left-5 md:bottom-10 md:-left-10 glass-card py-2 px-4 rounded-full shadow-lg animate-float border border-white/30" style={{ animationDelay: "1s" }}>
              <p className="text-sm font-medium text-primary">Automated Posting</p>
            </div>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="mt-16 md:mt-24 py-8 border-t border-primary/10">
          <p className="text-center text-sm text-muted-foreground mb-6">{t('hero_trusted')}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="w-24 h-8 bg-gradient-to-r from-primary/40 to-primary/20 rounded-md"></div>
            <div className="w-24 h-8 bg-gradient-to-r from-primary/40 to-primary/20 rounded-md"></div>
            <div className="w-24 h-8 bg-gradient-to-r from-primary/40 to-primary/20 rounded-md"></div>
            <div className="w-24 h-8 bg-gradient-to-r from-primary/40 to-primary/20 rounded-md"></div>
            <div className="w-24 h-8 bg-gradient-to-r from-primary/40 to-primary/20 rounded-md"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
