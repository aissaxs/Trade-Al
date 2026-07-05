import { chatWithAI } from './aiService';
import { get24hStats, getCandles } from '../api/binanceApi';
import { calculateMovingAverage, calculateSupportResistance } from '../../utils/calculations';

export async function analyzeMarket(symbol: string) {
  try {
    // Fetch market data
    const ticker = await get24hStats(symbol);
    const candles = await getCandles(symbol, '1h', 100);

    // Calculate indicators
    const closes = candles.map(c => c.close);
    const ma20 = calculateMovingAverage(closes, 20);
    const ma50 = calculateMovingAverage(closes, 50);
    const { support, resistance } = calculateSupportResistance(
      candles.map(c => c.high),
      candles.map(c => c.low)
    );

    // Generate AI analysis
    const marketData = {
      price: parseFloat(ticker.lastPrice),
      change24h: parseFloat(ticker.priceChangePercent),
      volume: parseFloat(ticker.volume),
      high24h: parseFloat(ticker.highPrice),
      low24h: parseFloat(ticker.lowPrice),
      ma20,
      ma50,
      support,
      resistance,
    };

    const analysis = await chatWithAI(`
      حلل السوق لـ ${symbol}:
      السعر: ${marketData.price}
      التغير 24س: ${marketData.change24h}%
      MA20: ${ma20}
      MA50: ${ma50}
      الدعم: ${support}
      المقاومة: ${resistance}
      
      أعطِ:
      1. الاتجاه
      2. إشارة
      3. الأهداف
      4. التحذيرات
    `);

    return {
      symbol,
      data: marketData,
      analysis,
      timestamp: Date.now(),
    };
  } catch (error: any) {
    console.error('Market analysis error:', error);
    throw new Error('فشل في تحليل السوق.');
  }
}

export async function generateTradingSignal(symbol: string) {
  try {
    const analysis = await analyzeMarket(symbol);
    
    // Parse signal from analysis
    const signal = {
      symbol,
      type: analysis.analysis.includes('BUY') ? 'BUY' : 
            analysis.analysis.includes('SELL') ? 'SELL' : 'HOLD',
      confidence: extractConfidence(analysis.analysis),
      entryPrice: analysis.data.price,
      targetPrice: extractTarget(analysis.analysis, analysis.data.price),
      stopLoss: extractStopLoss(analysis.analysis, analysis.data.price),
      reason: analysis.analysis,
      timestamp: Date.now(),
    };

    return signal;
  } catch (error) {
    throw new Error('فشل في توليد الإشارة.');
  }
}

function extractConfidence(text: string): number {
  const match = text.match(/(\d+)%/);
  return match ? parseInt(match[1]) : 50;
}

function extractTarget(text: string, currentPrice: number): number {
  const match = text.match(/هدف[:\s]*(\d+\.?\d*)/i);
  return match ? parseFloat(match[1]) : currentPrice * 1.05;
}

function extractStopLoss(text: string, currentPrice: number): number {
  const match = text.match(/وقف[:\s]*(\d+\.?\d*)/i);
  return match ? parseFloat(match[1]) : currentPrice * 0.95;
}
