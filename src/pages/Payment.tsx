
import React, { useState } from 'react';
import { usePayment } from '@/contexts/PaymentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/DashboardHeader';
import { Loader2, CreditCard, Check, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import BinancePayment from '@/components/BinancePayment';

const Payment = () => {
  const { t } = useLanguage();
  const { paymentMethods, subscription, isLoading, createSubscription, cancelSubscription } = usePayment();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('standard');

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

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
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
              <Card className="mb-6">
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
              
              {!subscription && (
                <Card>
                  <CardHeader>
                    <CardTitle>Choose a Plan</CardTitle>
                    <CardDescription>
                      Select the plan you'd like to subscribe to
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Card 
                        className={`cursor-pointer transition-all ${selectedPlanId === 'standard' ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}`} 
                        onClick={() => handlePlanSelect('standard')}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Standard</CardTitle>
                          <CardDescription>$9.99/month</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
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
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer transition-all ${selectedPlanId === 'premium' ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}`} 
                        onClick={() => handlePlanSelect('premium')}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Premium</CardTitle>
                          <CardDescription>$19.99/month</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
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
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Tabs defaultValue="binance">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="binance">Binance</TabsTrigger>
                        <TabsTrigger value="card" disabled>Credit Card</TabsTrigger>
                      </TabsList>
                      <TabsContent value="binance" className="mt-4">
                        <BinancePayment planId={selectedPlanId} />
                      </TabsContent>
                      <TabsContent value="card">
                        <Card>
                          <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">
                              Credit card payments coming soon
                            </p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Benefits</CardTitle>
                  <CardDescription>
                    What you get with your plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-bold text-lg">Standard Plan</h3>
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
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-bold text-lg">Premium Plan</h3>
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
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4">
                  <p className="text-xs text-muted-foreground text-center">
                    30-day money-back guarantee.
                    <br />No contracts, cancel anytime.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Payment;
