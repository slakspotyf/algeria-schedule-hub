
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isInDemoMode } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isDemoMode: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isDemoMode = isInDemoMode();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        // Simulate successful sign in for demo mode
        const demoUser = { id: 'demo-user-id', email: email };
        setUser(demoUser as User);
        navigate('/dashboard');
        toast({
          title: "Demo Mode: Welcome!",
          description: "You've signed in with demo credentials."
        });
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message || "Failed to sign in. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        // Simulate successful sign up for demo mode
        toast({
          title: "Demo Mode: Account created",
          description: "In demo mode, no actual account is created. Please sign in with any credentials."
        });
        navigate('/login');
        return;
      }
      
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account."
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Failed to create account. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        // Simulate successful sign out for demo mode
        setUser(null);
        navigate('/');
        toast({
          title: "Demo Mode: Signed out",
          description: "You've been signed out of the demo account."
        });
        return;
      }
      
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Signed out",
        description: "You've been successfully signed out."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
