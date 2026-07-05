export function calculateLotSize(
  balance: number,
  riskPercentage: number,
  stopLossPips: number,
  pipValue: number
): number {
  const riskAmount = balance * (riskPercentage / 100);
  const lotSize = riskAmount / (stopLossPips * pipValue);
  return Math.round(lotSize * 100) / 100;
}

export function calculateRiskReward(
  entry: number,
  target: number,
  stopLoss: number
): number {
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(target - entry);
  return Math.round((reward / risk) * 100) / 100;
}

export function calculateProfitLoss(
  entry: number,
  exit: number,
  amount: number,
  type: 'BUY' | 'SELL'
): number {
  const diff = type === 'BUY' ? exit - entry : entry - exit;
  return Math.round(diff * amount * 100) / 100;
}

export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  return ((current - previous) / previous) * 100;
}

export function calculateSupportResistance(
  highs: number[],
  lows: number[]
): { support: number; resistance: number } {
  const support = Math.min(...lows);
  const resistance = Math.max(...highs);
  return { support, resistance };
}

export function calculateMovingAverage(
  prices: number[],
  period: number
): number {
  if (prices.length < period) return 0;
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}
