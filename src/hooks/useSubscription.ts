import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { FREE_LIMITS, PLUS_LIMITS } from '../types/subscription.types';

export function useSubscription() {
  const { subscription } = useSelector((state: RootState) => state.subscription);
  
  const [limits, setLimits] = useState(FREE_LIMITS);
  const [isPlus, setIsPlus] = useState(false);

  useEffect(() => {
    if (subscription?.plan === 'plus_monthly' || subscription?.plan === 'plus_yearly') {
      setLimits(PLUS_LIMITS);
      setIsPlus(true);
    } else {
      setLimits(FREE_LIMITS);
      setIsPlus(false);
    }
  }, [subscription]);

  const canUseImage = (): boolean => {
    if (isPlus) return true;
    // Check daily limit for free users - implement actual check
    return true;
  };

  const canUseMarketAnalysis = (): boolean => {
    if (isPlus) return true;
    // Check 30 minute limit for free users
    return true;
  };

  const canUseAIChat = (section: string): boolean => {
    if (section === 'market' && !isPlus) return false;
    return true;
  };

  const getRemainingTime = (): number => {
    if (!subscription?.expiresAt) return 0;
    const now = new Date();
    const expires = new Date(subscription.expiresAt);
    return Math.max(0, expires.getTime() - now.getTime());
  };

  return {
    subscription,
    limits,
    isPlus,
    canUseImage,
    canUseMarketAnalysis,
    canUseAIChat,
    getRemainingTime,
  };
}
