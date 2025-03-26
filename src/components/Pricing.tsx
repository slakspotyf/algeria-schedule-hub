
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "Free",
    features: [
      "10 posts per month",
      "YouTube & Instagram only",
      "Basic analytics",
      "7-day content calendar",
      "Email support"
    ],
    cta: "Get Started",
    highlight: false
  },
  {
    name: "Standard",
    description: "Most popular for creators",
    price: "$9.99",
    period: "per month",
    features: [
      "Unlimited posts",
      "YouTube, Instagram, TikTok & Facebook",
      "Advanced analytics",
      "30-day content calendar",
      "Priority email support",
      "Content library storage",
      "Team collaboration (1 seat)"
    ],
    cta: "Choose Standard",
    highlight: true
  },
  {
    name: "Premium",
    description: "For professionals & businesses",
    price: "$19.99",
    period: "per month",
    features: [
      "Unlimited posts",
      "All social platforms (7 total)",
      "Advanced analytics & reports",
      "90-day content calendar",
      "Priority email & chat support",
      "Unlimited content library",
      "Team collaboration (5 seats)",
      "AI caption assistance",
      "White-label reports"
    ],
    cta: "Choose Premium",
    highlight: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-secondary/50 to-transparent"></div>
      
      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold animate-fade-in">
            Choose the Perfect Plan for Your Needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Flexible options for creators and businesses of all sizes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`${plan.highlight ? 'pricing-card-highlight' : 'pricing-card'} animate-fade-in`}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              {plan.highlight && (
                <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
                  <span className="bg-accent text-accent-foreground text-xs font-bold uppercase py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground mb-1">{plan.period}</span>}
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full rounded-full ${plan.highlight ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                variant={plan.highlight ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-2 animate-fade-in">All plans include</p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="bg-secondary px-3 py-1 rounded-full text-sm">No credit card required</span>
            <span className="bg-secondary px-3 py-1 rounded-full text-sm">Cancel anytime</span>
            <span className="bg-secondary px-3 py-1 rounded-full text-sm">Secure payments</span>
            <span className="bg-secondary px-3 py-1 rounded-full text-sm">24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
