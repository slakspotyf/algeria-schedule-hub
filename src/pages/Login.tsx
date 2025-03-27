import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Facebook } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, signInWithSocialProvider, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      await signIn(email, password);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter' | 'linkedin_oidc') => {
    setError('');
    try {
      await signInWithSocialProvider(provider);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
      </Link>
      
      <div className="w-full max-w-md space-y-8 glass-card p-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your Sahla-Post account</p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              min={6}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="relative my-6">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-background px-2 text-sm text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <img src="/assets/google.svg" alt="Google" className="w-5 h-5" />
            Google
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            Facebook
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            By signing in, you agree to our{' '}
            <Link to="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
