import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subscription, SubscriptionLimits, FREE_LIMITS, PLUS_LIMITS } from '../types/subscription.types';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: Subscription | null;
  limits: SubscriptionLimits;
  isPlus: boolean;
  canUseImage: () => boolean;
  canUseMarketAnalysis: () => boolean;
  canUseAIChat: (section: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [limits, setLimits] = useState<SubscriptionLimits>(FREE_LIMITS);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    // Fetch from Supabase
    // This is a placeholder - implement actual fetch
    setSubscription(null);
    setLimits(FREE_LIMITS);
  };

  const isPlus = subscription?.plan === 'plus_monthly' || subscription?.plan === 'plus_yearly';

  const canUseImage = () => {
    if (isPlus) return true;
    // Check daily limit for free users
    return true; // Implement actual check
  };

  const canUseMarketAnalysis = () => {
    if (isPlus) return true;
    // Check 30 minute limit for free users
    return true; // Implement actual check
  };

  const canUseAIChat = (section: string) => {
    if (section === 'market' && !isPlus) return false;
    return true;
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      limits: isPlus ? PLUS_LIMITS : FREE_LIMITS,
      isPlus,
      canUseImage,
      canUseMarketAnalysis,
      canUseAIChat,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
