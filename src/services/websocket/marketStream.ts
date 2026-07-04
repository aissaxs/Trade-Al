import { binanceWS } from './binanceWebSocket';

export function startMarketStream(symbols: string[], onUpdate: (data: any) => void) {
  binanceWS.connect();

  symbols.forEach(symbol => {
    binanceWS.subscribe(symbol, (ticker: any) => {
      onUpdate({
        symbol: ticker.s,
        price: ticker.c,
        priceChange: ticker.p,
        priceChangePercent: ticker.P,
        high: ticker.h,
        low: ticker.l,
        volume: ticker.v,
        quoteVolume: ticker.q,
        timestamp: ticker.E,
      });
    });
  });

  return () => {
    binanceWS.disconnect();
  };
}

export function subscribeToSymbol(symbol: string, callback: (data: any) => void) {
  binanceWS.subscribe(symbol, callback);
}

export function unsubscribeFromSymbol(symbol: string, callback: (data: any) => void) {
  binanceWS.unsubscribe(symbol, callback);
}
