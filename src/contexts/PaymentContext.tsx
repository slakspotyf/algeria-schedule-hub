
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PaymentService, PaymentMethod, Subscription } from '@/services/PaymentService';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentContextType {
  paymentMethods: PaymentMethod[];
  subscription: Subscription | null;
  isLoading: boolean;
  refreshPaymentData: () => Promise<void>;
  createSubscription: (planId: string, paymentMethodId: string) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPaymentData = async () => {
    if (!user) {
      setPaymentMethods([]);
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [methods, sub] = await Promise.all([
        PaymentService.getPaymentMethods(),
        PaymentService.getSubscription()
      ]);
      
      setPaymentMethods(methods);
      setSubscription(sub);
    } catch (error) {
      console.error("Error refreshing payment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPaymentData();
  }, [user]);

  const createSubscription = async (planId: string, paymentMethodId: string) => {
    const success = await PaymentService.createSubscription(planId, paymentMethodId);
    if (success) {
      await refreshPaymentData();
    }
    return success;
  };

  const cancelSubscription = async () => {
    const success = await PaymentService.cancelSubscription();
    if (success) {
      await refreshPaymentData();
    }
    return success;
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentMethods,
        subscription,
        isLoading,
        refreshPaymentData,
        createSubscription,
        cancelSubscription
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
