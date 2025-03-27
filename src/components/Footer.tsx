
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-16 bg-secondary/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sahla-Post
              </span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-xs">
              Automating social media management for creators and businesses across Algeria.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20 transition-colors">
                <span className="sr-only">Facebook</span>
                <div className="w-5 h-5 bg-foreground/80 rounded-sm"></div>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20 transition-colors">
                <span className="sr-only">Twitter</span>
                <div className="w-5 h-5 bg-foreground/80 rounded-sm"></div>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20 transition-colors">
                <span className="sr-only">Instagram</span>
                <div className="w-5 h-5 bg-foreground/80 rounded-sm"></div>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#platforms" className="text-muted-foreground hover:text-foreground transition-colors">Platforms</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Guides</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Partners</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} Sahla-Post. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
