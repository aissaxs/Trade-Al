export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  imageUrl?: string;
  analysis?: AIAnalysis;
}

export interface AIAnalysis {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  patterns: string[];
  supportLevels: number[];
  resistanceLevels: number[];
  recommendation: 'buy' | 'sell' | 'hold' | 'wait';
  targets?: {
    entry: number;
    stopLoss: number;
    takeProfit: number;
  };
  reasoning: string;
}

export interface AIChatSession {
  id: string;
  userId: string;
  section: 'home' | 'learn' | 'capital' | 'market';
  messages: AIMessage[];
  createdAt: number;
  updatedAt: number;
  isSaved: boolean;
}

export interface AIImageAnalysis {
  imageUrl: string;
  analysis: string;
  patterns: string[];
  signals: string[];
  confidence: number;
}

export interface AILearningProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  lastPosition: number;
  quizScore: number;
  chatHistory: AIMessage[];
  updatedAt: number;
}

export interface AISignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  confidence: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  riskReward: number;
  reason: string;
  indicators: string[];
  createdAt: number;
  expiresAt: number;
  status: 'active' | 'expired' | 'hit_target' | 'hit_stop';
  }
