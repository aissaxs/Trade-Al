export type PlanType = 'free' | 'plus_monthly' | 'plus_yearly';

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanType;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startedAt: string;
  expiresAt: string;
  paymentMethod: string;
  autoRenew: boolean;
  cancelledAt?: string;
}

export interface SubscriptionLimits {
  dailyImages: number;
  marketAnalysisMinutes: number;
  chatMessages: number;
  hasAIChatInMarket: boolean;
  hasDetailedAnalysis: boolean;
  hasVIPSignals: boolean;
  hasWeeklyReports: boolean;
}

export const FREE_LIMITS: SubscriptionLimits = {
  dailyImages: 3,
  marketAnalysisMinutes: 30,
  chatMessages: 50,
  hasAIChatInMarket: false,
  hasDetailedAnalysis: false,
  hasVIPSignals: false,
  hasWeeklyReports: false,
};

export const PLUS_LIMITS: SubscriptionLimits = {
  dailyImages: Infinity,
  marketAnalysisMinutes: Infinity,
  chatMessages: Infinity,
  hasAIChatInMarket: true,
  hasDetailedAnalysis: true,
  hasVIPSignals: true,
  hasWeeklyReports: true,
};

export interface PaymentData {
  amount: number;
  currency: string;
  method: 'card' | 'google_pay' | 'apple_pay' | 'paypal';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  createdAt: string;
}
