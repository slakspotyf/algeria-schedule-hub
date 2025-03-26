
const platforms = [
  {
    name: "YouTube",
    icon: "/assets/youtube.svg", 
    color: "bg-red-500"
  },
  {
    name: "Instagram",
    icon: "/assets/instagram.svg",
    color: "bg-pink-500"
  },
  {
    name: "TikTok",
    icon: "/assets/tiktok.svg",
    color: "bg-black"
  },
  {
    name: "Facebook",
    icon: "/assets/facebook.svg",
    color: "bg-blue-600"
  },
  {
    name: "Snapchat",
    icon: "/assets/snapchat.svg",
    color: "bg-yellow-400"
  },
  {
    name: "Twitter/X",
    icon: "/assets/twitter.svg",
    color: "bg-sky-500"
  },
  {
    name: "LinkedIn",
    icon: "/assets/linkedin.svg",
    color: "bg-blue-700"
  }
];

const Platforms = () => {
  return (
    <section id="platforms" className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/50 relative overflow-hidden">
      {/* Background decorative circle */}
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
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-12">
          {platforms.map((platform, index) => (
            <div 
              key={platform.name}
              className="glass-card p-6 flex flex-col items-center w-[140px] h-[140px] justify-center transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-full ${platform.color} flex items-center justify-center mb-3`}>
                <div className="w-6 h-6 bg-white rounded"></div>
              </div>
              <span className="font-medium">{platform.name}</span>
            </div>
          ))}
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
