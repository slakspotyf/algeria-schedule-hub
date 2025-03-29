
import { CalendarDays, Repeat, BarChart3, Layers, Globe, Lock } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";

const features = [
  {
    icon: <CalendarDays className="h-10 w-10 text-primary" />,
    title: "features_scheduling_title",
    description: "features_scheduling_desc"
  },
  {
    icon: <Repeat className="h-10 w-10 text-primary" />,
    title: "features_autoposting_title",
    description: "features_autoposting_desc"
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "features_analytics_title",
    description: "features_analytics_desc"
  },
  {
    icon: <Layers className="h-10 w-10 text-primary" />,
    title: "features_library_title",
    description: "features_library_desc"
  },
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: "features_platforms_title",
    description: "features_platforms_desc"
  },
  {
    icon: <Lock className="h-10 w-10 text-primary" />,
    title: "features_security_title",
    description: "features_security_desc"
  }
];

const Features = () => {
  const { t } = useLanguage();
  
  return (
    <section id="features" className="py-20 md:py-32 relative overflow-hidden moroccan-tile">
      {/* Background decorative elements */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full filter blur-3xl"></div>
      
      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            {t('features_badge')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold animate-fade-in bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('features_title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {t('features_subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card animate-fade-in relative overflow-hidden group"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="mb-5 p-3 rounded-lg bg-primary/10 inline-block">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{t(feature.title)}</h3>
                <p className="text-muted-foreground flex-grow">{t(feature.description)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 md:mt-32 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-30"></div>
          <div className="glass-card p-8 md:p-12 relative border border-white/30">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-1/2">
                <div className="algerian-accent-border">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 animate-fade-in-left bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {t('features_section_title')}
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6 animate-fade-in-left" style={{ animationDelay: "0.1s" }}>
                  {t('features_section_desc')}
                </p>
                <ul className="space-y-3 animate-fade-in-left" style={{ animationDelay: "0.2s" }}>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    <span>{t('features_point_1')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    <span>{t('features_point_2')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    <span>{t('features_point_3')}</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 animate-fade-in-right">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-50"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1469041797191-50ace28483c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
                    alt="Content creation workflow" 
                    className="rounded-xl shadow-lg w-full h-auto relative border border-white/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
