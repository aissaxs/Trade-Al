export interface Ticker {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  bidPrice: string;
  askPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
}

export interface Candlestick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBook {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export interface Trade {
  id: number;
  symbol: string;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
}

export interface MarketDepth {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
}

export interface TrendAnalysis {
  direction: 'bullish' | 'bearish' | 'sideways';
  strength: number;
  indicators: {
    ema20: number;
    ema50: number;
    ema200: number;
    rsi: number;
    macd: number;
    bollingerUpper: number;
    bollingerLower: number;
  };
}

export interface SupportResistance {
  support: number[];
  resistance: number[];
  pivotPoint: number;
}

export interface MarketSentiment {
  overall: 'bullish' | 'bearish' | 'neutral';
  fearGreedIndex: number;
  longShortRatio: number;
  fundingRate: number;
}
