import { AISignal } from '../../types/ai.types';
import { generateTradingSignal } from './marketAnalysis';

export async function generateSignals(symbols: string[]): Promise<AISignal[]> {
  const signals: AISignal[] = [];

  for (const symbol of symbols) {
    try {
      const signal = await generateTradingSignal(symbol);
      
      signals.push({
        id: `${symbol}-${Date.now()}`,
        symbol: signal.symbol,
        type: signal.type as 'BUY' | 'SELL',
        confidence: signal.confidence,
        entryPrice: signal.entryPrice,
        targetPrice: signal.targetPrice,
        stopLoss: signal.stopLoss,
        riskReward: calculateRiskReward(signal.entryPrice, signal.targetPrice, signal.stopLoss),
        reason: signal.reason,
        indicators: ['AI Analysis', 'Trend', 'Volume'],
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        status: 'active',
      });
    } catch (error) {
      console.error(`Failed to generate signal for ${symbol}:`, error);
    }
  }

  return signals.sort((a, b) => b.confidence - a.confidence);
}

function calculateRiskReward(entry: number, target: number, stopLoss: number): number {
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(target - entry);
  return risk > 0 ? Math.round((reward / risk) * 100) / 100 : 0;
}

export async function checkSignalStatus(signal: AISignal, currentPrice: number): Promise<AISignal['status']> {
  if (signal.type === 'BUY') {
    if (currentPrice >= signal.targetPrice) return 'hit_target';
    if (currentPrice <= signal.stopLoss) return 'hit_stop';
  } else {
    if (currentPrice <= signal.targetPrice) return 'hit_target';
    if (currentPrice >= signal.stopLoss) return 'hit_stop';
  }
  
  if (Date.now() > signal.expiresAt) return 'expired';
  
  return 'active';
}
