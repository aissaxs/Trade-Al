import { useEffect, useRef, useState, useCallback } from 'react';
import { binanceWS } from '../services/websocket/binanceWebSocket';

export function useWebSocket(symbols: string[]) {
  const [prices, setPrices] = useState<Map<string, any>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const callbacksRef = useRef<Map<string, Function>>(new Map());

  useEffect(() => {
    binanceWS.connect();
    setIsConnected(true);

    const handleUpdate = (symbol: string) => (data: any) => {
      setPrices(prev => {
        const next = new Map(prev);
        next.set(symbol, {
          price: data.c,
          change: data.P,
          high: data.h,
          low: data.l,
          volume: data.v,
          timestamp: data.E,
        });
        return next;
      });
    };

    symbols.forEach(symbol => {
      const callback = handleUpdate(symbol);
      callbacksRef.current.set(symbol, callback);
      binanceWS.subscribe(symbol, callback);
    });

    return () => {
      symbols.forEach(symbol => {
        const callback = callbacksRef.current.get(symbol);
        if (callback) {
          binanceWS.unsubscribe(symbol, callback);
        }
      });
      binanceWS.disconnect();
      setIsConnected(false);
    };
  }, [symbols]);

  const getPrice = useCallback((symbol: string) => {
    return prices.get(symbol);
  }, [prices]);

  return {
    prices,
    isConnected,
    getPrice,
  };
}
