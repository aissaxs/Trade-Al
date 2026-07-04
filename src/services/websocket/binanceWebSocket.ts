class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private callbacks: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;

  connect() {
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    
    this.ws.onopen = () => {
      console.log('Binance WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        data.forEach((ticker: any) => {
          const symbol = ticker.s;
          const callbacks = this.callbacks.get(symbol) || [];
          callbacks.forEach(cb => cb(ticker));
        });
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.attemptReconnect();
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  subscribe(symbol: string, callback: Function) {
    if (!this.callbacks.has(symbol)) {
      this.callbacks.set(symbol, []);
    }
    this.callbacks.get(symbol)?.push(callback);
    
    // Subscribe to individual symbol stream
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: [`${symbol.toLowerCase()}@ticker`],
        id: Date.now(),
      }));
    }
  }

  unsubscribe(symbol: string, callback: Function) {
    const callbacks = this.callbacks.get(symbol) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  disconnect() {
    this.ws?.close();
    this.callbacks.clear();
  }
}

export const binanceWS = new BinanceWebSocket();
