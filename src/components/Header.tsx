
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useLanguage();
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
        isScrolled ? 'glass py-3 shadow-md' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('app_name')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              {t('nav_features')}
            </a>
            <a href="#platforms" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              {t('nav_platforms')}
            </a>
            <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
              {t('nav_pricing')}
            </a>
            <LanguageSelector />
            <Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10 hover:text-primary">
              <Link to="/login">{t('nav_login')}</Link>
            </Button>
            <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
              <Link to="/signup">{t('nav_signup')}</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="text-primary hover:bg-primary/10"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass animate-fade-in border-t border-border/40">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <a 
              href="#features" 
              className="block text-foreground/80 hover:text-primary transition-colors py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav_features')}
            </a>
            <a 
              href="#platforms" 
              className="block text-foreground/80 hover:text-primary transition-colors py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav_platforms')}
            </a>
            <a 
              href="#pricing" 
              className="block text-foreground/80 hover:text-primary transition-colors py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav_pricing')}
            </a>
            <div className="pt-2 flex flex-col space-y-3">
              <Button asChild variant="outline" className="w-full justify-center rounded-full border-primary text-primary hover:bg-primary/10">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>{t('nav_login')}</Link>
              </Button>
              <Button asChild className="w-full justify-center rounded-full bg-primary hover:bg-primary/90">
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>{t('nav_signup')}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
