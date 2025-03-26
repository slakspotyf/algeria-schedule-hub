
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3 shadow-sm' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sahla-Post
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors text-sm font-medium">
              Features
            </a>
            <a href="#platforms" className="text-foreground/80 hover:text-foreground transition-colors text-sm font-medium">
              Platforms
            </a>
            <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors text-sm font-medium">
              Pricing
            </a>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/signup">Get Started</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <a 
              href="#features" 
              className="block text-foreground/80 hover:text-foreground transition-colors py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#platforms" 
              className="block text-foreground/80 hover:text-foreground transition-colors py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Platforms
            </a>
            <a 
              href="#pricing" 
              className="block text-foreground/80 hover:text-foreground transition-colors py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <div className="pt-2 flex flex-col space-y-3">
              <Button asChild variant="outline" className="w-full justify-center rounded-full">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              </Button>
              <Button asChild className="w-full justify-center rounded-full">
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
