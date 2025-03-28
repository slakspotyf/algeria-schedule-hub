
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Plus, Bell, Settings, LogOut } from 'lucide-react';

const DashboardHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sahla-Post
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Social Automation
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/dashboard/new-post">
                <Plus className="w-4 h-4 mr-2" /> New Automation
              </Link>
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full"></span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Free Plan</p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => signOut()}>
              <LogOut className="h-5 w-5" />
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
            <div className="py-3 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">Free Plan</p>
                </div>
              </div>
            </div>
            
            <Button 
              asChild 
              variant="outline" 
              className="w-full justify-center rounded-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link to="/dashboard/new-post">
                <Plus className="w-4 h-4 mr-2" /> New Automation
              </Link>
            </Button>
            
            <Link 
              to="/dashboard/settings" 
              className="flex items-center py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="h-4 w-4 mr-3" /> Settings
            </Link>
            
            <button
              onClick={() => {
                signOut();
                setMobileMenuOpen(false);
              }}
              className="flex items-center py-2 w-full text-left hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
