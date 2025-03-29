
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-16 algerian-pattern relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('app_name')}
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              {t('footer_description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-primary">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-primary">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-primary">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-primary">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">{t('footer_product')}</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">{t('nav_features')}</a></li>
              <li><a href="#platforms" className="text-muted-foreground hover:text-primary transition-colors">{t('nav_platforms')}</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">{t('nav_pricing')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer_roadmap')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">{t('footer_resources')}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer_blog')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer_help')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer_guides')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer_api')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">{t('footer_company')}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer_about')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer_careers')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer_contact')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer_partners')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} {t('app_name')}. {t('footer_rights')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer_privacy')}</Link>
            <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer_terms')}</Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer_cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
