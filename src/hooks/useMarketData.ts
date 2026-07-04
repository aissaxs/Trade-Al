import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicker, fetchCandles, setSelectedSymbol } from '../store/slices/marketSlice';
import { RootState } from '../store/store';
import { Ticker, Candlestick } from '../types/market.types';

export function useMarketData(symbol: string = 'BTCUSDT') {
  const dispatch = useDispatch();
  const { tickers, candles, isLoading, error } = useSelector((state: RootState) => state.market);

  const [selectedInterval, setSelectedInterval] = useState('1h');

  useEffect(() => {
    dispatch(setSelectedSymbol(symbol));
    dispatch(fetchTicker(symbol) as any);
    dispatch(fetchCandles({ symbol, interval: selectedInterval }) as any);
  }, [dispatch, symbol, selectedInterval]);

  const refresh = useCallback(() => {
    dispatch(fetchTicker(symbol) as any);
    dispatch(fetchCandles({ symbol, interval: selectedInterval }) as any);
  }, [dispatch, symbol, selectedInterval]);

  const changeInterval = useCallback((interval: string) => {
    setSelectedInterval(interval);
  }, []);

  const currentTicker = tickers.find(t => t.symbol === symbol);

  return {
    ticker: currentTicker,
    candles,
    isLoading,
    error,
    selectedInterval,
    refresh,
    changeInterval,
  };
}
