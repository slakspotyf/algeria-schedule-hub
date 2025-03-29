
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export type PaymentMethod = {
  id: string;
  provider: string;
  payment_method_id: string;
  is_default: boolean;
  card_last_four?: string;
  card_brand?: string;
  expiry_month?: number;
  expiry_year?: number;
  billing_name?: string;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export const PaymentService = {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load payment methods."
      });
      return [];
    }
  },

  async getSubscription(): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load subscription information."
      });
      return null;
    }
  },

  async createSubscription(planId: string, paymentMethodId: string): Promise<boolean> {
    try {
      // This would actually call a Supabase Edge Function that interacts with Stripe
      // For now, we'll mock this functionality
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");
      
      // In a real implementation, this would be handled by a secure server-side function
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          plan_id: planId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancel_at_period_end: false
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your subscription has been created."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create subscription."
      });
      return false;
    }
  },

  async cancelSubscription(): Promise<boolean> {
    try {
      // This would actually call a Supabase Edge Function that interacts with Stripe
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          cancel_at_period_end: true
        })
        .eq('status', 'active')
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Subscription Canceled",
        description: "Your subscription will end at the end of the current billing period."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel subscription."
      });
      return false;
    }
  }
};
