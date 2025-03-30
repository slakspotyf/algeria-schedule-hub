
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Loader2, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface BinancePaymentProps {
  planId: string;
}

interface PaymentFormData {
  email: string;
  transactionId: string;
  amount: string;
}

const BinancePayment = ({ planId }: BinancePaymentProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>({
    defaultValues: {
      email: '',
      transactionId: '',
      amount: planId === 'standard' ? '9.99' : '19.99',
    }
  });

  const binanceEmail = 'hassad.med.achraf@gmail.com';
  const binanceId = '384371330';

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const onSubmit = async (data: PaymentFormData) => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to complete this action",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: responseData, error } = await supabase.functions.invoke('notify-payment', {
        body: {
          email: data.email,
          userEmail: user.email,
          planId,
          transactionId: data.transactionId,
          amount: data.amount,
        },
      });

      if (error) throw error;

      toast({
        title: "Payment verification submitted",
        description: "We've received your payment details and will verify it soon.",
      });
    } catch (error) {
      console.error('Error submitting payment verification:', error);
      toast({
        title: "Payment verification failed",
        description: "Unable to submit payment verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay with Binance</CardTitle>
        <CardDescription>
          Send the exact amount to the Binance account below and verify your payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Binance Email</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => copyToClipboard(binanceEmail, 'email')}
              >
                {copied === 'email' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm">{binanceEmail}</p>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Binance ID</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => copyToClipboard(binanceId, 'id')}
              >
                {copied === 'id' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm">{binanceId}</p>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Amount to Send</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => copyToClipboard(planId === 'standard' ? '9.99' : '19.99', 'amount')}
              >
                {copied === 'amount' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm">${planId === 'standard' ? '9.99' : '19.99'} USDT</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Your Binance Email</Label>
              <Input
                id="email"
                placeholder="Enter your Binance email"
                {...register("email", { required: "Binance email is required" })}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                placeholder="Enter transaction ID from Binance"
                {...register("transactionId", { required: "Transaction ID is required" })}
              />
              {errors.transactionId && <p className="text-sm text-red-500">{errors.transactionId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount Sent (USDT)</Label>
              <Input
                id="amount"
                placeholder="Amount sent in USDT"
                {...register("amount", { required: "Amount is required" })}
              />
              {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Payment
              </>
            ) : (
              "Verify Payment"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-muted-foreground text-center">
          After verification, your subscription will be activated within 24 hours.
          <br />You will receive a confirmation email once approved.
        </p>
      </CardFooter>
    </Card>
  );
};

export default BinancePayment;
