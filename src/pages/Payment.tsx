
import React, { useState } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DashboardHeader from '@/components/DashboardHeader';
import { Loader2, CreditCard, Check, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const Payment = () => {
  const { t } = useLanguage();
  const { paymentMethods, subscription, isLoading, createSubscription, cancelSubscription } = usePayment();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setProcessingPlan(planId);
    try {
      // In a real implementation, we would show a payment method form here
      // For demo purposes, we'll just create a subscription with a mock payment method
      await createSubscription(planId, 'mock_payment_method');
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      await cancelSubscription();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Payment & Subscription</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Status</CardTitle>
                  <CardDescription>
                    Manage your current subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {subscription ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {subscription.plan_id === 'standard' ? 'Standard Plan' : 
                             subscription.plan_id === 'premium' ? 'Premium Plan' : 'Free Plan'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Status: {subscription.status}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Current period started</p>
                          <p className="font-medium">
                            {format(new Date(subscription.current_period_start), 'MMMM d, yyyy')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current period ends</p>
                          <p className="font-medium">
                            {format(new Date(subscription.current_period_end), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      
                      {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                        <Button 
                          variant="outline" 
                          className="mt-4 w-full sm:w-auto"
                          onClick={handleCancelSubscription}
                        >
                          Cancel subscription
                        </Button>
                      )}
                      
                      {subscription.cancel_at_period_end && (
                        <div className="flex items-start space-x-2 p-3 bg-muted rounded-md mt-4">
                          <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Your subscription will end on</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(subscription.current_period_end), 'MMMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md bg-muted/50">
                      <p className="text-muted-foreground">You don't have an active subscription yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {method.card_brand} •••• {method.card_last_four}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Expires {method.expiry_month}/{method.expiry_year}
                              </p>
                            </div>
                          </div>
                          {method.is_default && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md bg-muted/50">
                      <p className="text-muted-foreground">No payment methods added yet.</p>
                      <Button variant="outline" className="mt-4">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add payment method
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Plans</CardTitle>
                  <CardDescription>
                    Choose a plan that works for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md p-4 relative">
                    <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-bold uppercase py-1 px-3 rounded-full">
                      Popular
                    </div>
                    <h3 className="font-bold text-lg">Standard</h3>
                    <div className="flex items-baseline mt-2 mb-4">
                      <span className="text-3xl font-bold">$9.99</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" /> Unlimited posts
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" /> All social platforms
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" /> Advanced analytics
                      </li>
                    </ul>
                    <Button 
                      className="w-full"
                      disabled={processingPlan === 'standard' || subscription?.plan_id === 'standard'}
                      onClick={() => handleSubscribe('standard')}
                    >
                      {processingPlan === 'standard' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : subscription?.plan_id === 'standard' ? (
                        'Current plan'
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-bold text-lg">Premium</h3>
                    <div className="flex items-baseline mt-2 mb-4">
                      <span className="text-3xl font-bold">$19.99</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" /> Everything in Standard
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" /> AI caption assistance
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" /> Team collaboration (5 seats)
                      </li>
                    </ul>
                    <Button 
                      className="w-full"
                      disabled={processingPlan === 'premium' || subscription?.plan_id === 'premium'}
                      onClick={() => handleSubscribe('premium')}
                    >
                      {processingPlan === 'premium' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : subscription?.plan_id === 'premium' ? (
                        'Current plan'
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Payment;
