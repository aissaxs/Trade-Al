import { API_CONFIG, ENDPOINTS } from '../../config/api.config';
import { Ticker, Candlestick } from '../../types/market.types';

const BASE_URL = API_CONFIG.BINANCE_BASE_URL;

export async function getPrice(symbol: string): Promise<{ symbol: string; price: string }> {
  const response = await fetch(`${BASE_URL}${ENDPOINTS.BINANCE_TICKER}?symbol=${symbol}`);
  if (!response.ok) throw new Error('Failed to fetch price');
  return response.json();
}

export async function getAllPrices(): Promise<{ symbol: string; price: string }[]> {
  const response = await fetch(`${BASE_URL}${ENDPOINTS.BINANCE_TICKER}`);
  if (!response.ok) throw new Error('Failed to fetch prices');
  return response.json();
}

export async function get24hStats(symbol: string): Promise<Ticker> {
  const response = await fetch(`${BASE_URL}${ENDPOINTS.BINANCE_24H}?symbol=${symbol}`);
  if (!response.ok) throw new Error('Failed to fetch 24h stats');
  return response.json();
}

export async function getCandles(
  symbol: string,
  interval: string = '1h',
  limit: number = 100
): Promise<Candlestick[]> {
  const response = await fetch(
    `${BASE_URL}${ENDPOINTS.BINANCE_KLINES}?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );
  if (!response.ok) throw new Error('Failed to fetch candles');
  
  const data = await response.json();
  return data.map((candle: any[]) => ({
    time: candle[0],
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    volume: parseFloat(candle[5]),
  }));
}

export async function getOrderBook(symbol: string, limit: number = 100) {
  const response = await fetch(
    `${BASE_URL}${ENDPOINTS.BINANCE_DEPTH}?symbol=${symbol}&limit=${limit}`
  );
  if (!response.ok) throw new Error('Failed to fetch order book');
  return response.json();
}

export async function getRecentTrades(symbol: string, limit: number = 50) {
  const response = await fetch(
    `${BASE_URL}${ENDPOINTS.BINANCE_TRADES}?symbol=${symbol}&limit=${limit}`
  );
  if (!response.ok) throw new Error('Failed to fetch trades');
  return response.json();
}
