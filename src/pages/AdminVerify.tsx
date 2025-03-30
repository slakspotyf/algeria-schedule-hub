
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminVerify = () => {
  const [searchParams] = useSearchParams();
  const verificationId = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verification, setVerification] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        if (!verificationId) {
          setError('Missing verification ID');
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('payment_verifications')
          .select('*')
          .eq('id', verificationId)
          .single();

        if (error) throw error;
        
        setVerification(data);
      } catch (err) {
        console.error('Error fetching verification:', err);
        setError('Failed to load verification details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerification();
  }, [verificationId]);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!verificationId) return;
    
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { verificationId, action }
      });

      if (error) throw error;
      
      setResult(`Payment verification has been ${action === 'approve' ? 'approved' : 'rejected'}`);
      toast({
        title: 'Success',
        description: `Payment verification has been ${action === 'approve' ? 'approved' : 'rejected'}`,
      });
    } catch (err) {
      console.error(`Error ${action}ing payment:`, err);
      setError(`Failed to ${action} payment`);
      toast({
        title: 'Error',
        description: `Failed to ${action} payment. Please try again.`,
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading verification...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Error</h2>
            <p className="text-muted-foreground mt-2">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Success</h2>
            <p className="text-muted-foreground mt-2">{result}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <Card className="p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Verify Payment</h2>
        
        {verification && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Plan:</div>
              <div>{verification.plan_id === 'standard' ? 'Standard ($9.99)' : 'Premium ($19.99)'}</div>
              
              <div className="text-sm text-muted-foreground">User:</div>
              <div>{verification.user_email}</div>
              
              <div className="text-sm text-muted-foreground">Binance Email:</div>
              <div>{verification.binance_email}</div>
              
              <div className="text-sm text-muted-foreground">Transaction ID:</div>
              <div className="break-all">{verification.transaction_id}</div>
              
              <div className="text-sm text-muted-foreground">Amount:</div>
              <div>{verification.amount}</div>
              
              <div className="text-sm text-muted-foreground">Status:</div>
              <div className="capitalize">{verification.status}</div>
              
              <div className="text-sm text-muted-foreground">Date:</div>
              <div>{new Date(verification.created_at).toLocaleString()}</div>
            </div>
            
            <div className="flex justify-between gap-4 mt-6">
              <Button 
                variant="destructive" 
                onClick={() => handleAction('reject')} 
                disabled={isProcessing || verification.status !== 'pending'}
                className="w-1/2"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                Reject
              </Button>
              
              <Button 
                onClick={() => handleAction('approve')} 
                disabled={isProcessing || verification.status !== 'pending'}
                className="w-1/2"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Approve
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminVerify;
