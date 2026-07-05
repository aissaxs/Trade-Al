import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../utils/constants';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  height?: number;
  showIndicators?: boolean;
  showDrawingTools?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TradingViewChart({
  symbol,
  interval = '1h',
  height = 400,
  showIndicators = true,
  showDrawingTools = true,
}: TradingViewChartProps) {
  const { theme, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const chartHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <script src="https://unpkg.com/lightweight-charts@4.1.0/dist/lightweight-charts.standalone.production.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 0; 
            background: ${theme.colors.background}; 
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          #chart-container { 
            width: 100%; 
            height: 100%; 
            position: relative;
          }
          #chart { 
            width: 100%; 
            height: 100%; 
          }
          .toolbar {
            position: absolute;
            top: 8px;
            left: 8px;
            right: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 10;
            pointer-events: none;
          }
          .toolbar-group {
            display: flex;
            gap: 4px;
            pointer-events: auto;
          }
          .tool-btn {
            background: ${theme.colors.surface};
            border: 1px solid ${theme.colors.border};
            color: ${theme.colors.textSecondary};
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .tool-btn:hover, .tool-btn.active {
            background: ${theme.colors.primary};
            color: white;
            border-color: ${theme.colors.primary};
          }
          .price-display {
            background: ${theme.colors.surface};
            border: 1px solid ${theme.colors.border};
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            color: ${theme.colors.text};
            font-family: monospace;
          }
          .loading-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: ${theme.colors.background};
            z-index: 100;
          }
          .spinner {
            width: 30px;
            height: 30px;
            border: 3px solid ${theme.colors.border};
            border-top-color: ${theme.colors.primary};
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div id="chart-container">
          <div class="toolbar">
            <div class="toolbar-group">
              <button class="tool-btn active" onclick="changeInterval('1m')">1M</button>
              <button class="tool-btn" onclick="changeInterval('5m')">5M</button>
              <button class="tool-btn" onclick="changeInterval('15m')">15M</button>
              <button class="tool-btn" onclick="changeInterval('1h')">1H</button>
              <button class="tool-btn" onclick="changeInterval('4h')">4H</button>
              <button class="tool-btn" onclick="changeInterval('1d')">1D</button>
            </div>
            <div class="price-display" id="current-price">--</div>
          </div>
          <div id="chart"></div>
        </div>

        <script>
          let chart, candleSeries, volumeSeries;
          let ma7Series, ma25Series, ma99Series;
          let bollingerUpper, bollingerMiddle, bollingerLower;
          let currentInterval = '${interval}';
          let currentSymbol = '${symbol}';
          let ws = null;
          let isDrawing = false;
          let drawingTool = null;
          let drawings = [];

          // Initialize chart
          function initChart() {
            chart = LightweightCharts.createChart(document.getElementById('chart'), {
              layout: {
                background: { color: '${theme.colors.background}' },
                textColor: '${theme.colors.textSecondary}',
              },
              grid: {
                vertLines: { color: '${theme.colors.border}', style: 1 },
                horzLines: { color: '${theme.colors.border}', style: 1 },
              },
              crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
                vertLine: {
                  color: '${theme.colors.primary}',
                  width: 1,
                  style: 2,
                  labelBackgroundColor: '${theme.colors.primary}',
                },
                horzLine: {
                  color: '${theme.colors.primary}',
                  width: 1,
                  style: 2,
                  labelBackgroundColor: '${theme.colors.primary}',
                },
              },
              rightPriceScale: {
                borderColor: '${theme.colors.border}',
                scaleMargins: { top: 0.1, bottom: 0.2 },
              },
              timeScale: {
                borderColor: '${theme.colors.border}',
                timeVisible: true,
                secondsVisible: false,
              },
              handleScroll: { vertTouchDrag: false },
              handleScale: { axisPressedMouseMove: true },
            });

            // Candlestick series
            candleSeries = chart.addCandlestickSeries({
              upColor: '${theme.colors.chartUp}',
              downColor: '${theme.colors.chartDown}',
              borderUpColor: '${theme.colors.chartUp}',
              borderDownColor: '${theme.colors.chartDown}',
              wickUpColor: '${theme.colors.chartUp}',
              wickDownColor: '${theme.colors.chartDown}',
            });

            // Volume series
            volumeSeries = chart.addHistogramSeries({
              color: '${theme.colors.primary}80',
              priceFormat: { type: 'volume' },
              priceScaleId: 'volume',
              scaleMargins: { top: 0.8, bottom: 0 },
            });

            chart.priceScale('volume').applyOptions({
              scaleMargins: { top: 0.8, bottom: 0 },
            });

            ${showIndicators ? `
            // Moving Averages
            ma7Series = chart.addLineSeries({
              color: '#FF6D00',
              lineWidth: 1,
              title: 'MA7',
            });
            ma25Series = chart.addLineSeries({
              color: '#00B0FF',
              lineWidth: 1,
              title: 'MA25',
            });
            ma99Series = chart.addLineSeries({
              color: '#E040FB',
              lineWidth: 1,
              title: 'MA99',
            });

            // Bollinger Bands
            bollingerUpper = chart.addLineSeries({
              color: '#FFD600',
              lineWidth: 1,
              lineStyle: 2,
              title: 'BB Upper',
            });
            bollingerMiddle = chart.addLineSeries({
              color: '#FFD600',
              lineWidth: 1,
              title: 'BB Middle',
            });
            bollingerLower = chart.addLineSeries({
              color: '#FFD600',
              lineWidth: 1,
              lineStyle: 2,
              title: 'BB Lower',
            });
            ` : ''}

            ${showDrawingTools ? `
            // Drawing tools setup
            chart.subscribeClick((param) => {
              if (isDrawing && param.point) {
                addDrawingPoint(param.point.x, param.point.y, param.time, param.price);
              }
            });
            ` : ''}

            // Price display update
            chart.subscribeCrosshairMove((param) => {
              if (param.point && param.time) {
                const price = param.point.y;
                document.getElementById('current-price').textContent = 
                  currentSymbol + ': ' + price.toFixed(2);
              }
            });

            // Resize handler
            window.addEventListener('resize', () => {
              chart.applyOptions({
                width: window.innerWidth,
                height: window.innerHeight,
              });
            });
          }

          // Calculate Moving Average
          function calculateMA(data, period) {
            const ma = [];
            for (let i = 0; i < data.length; i++) {
              if (i < period - 1) {
                ma.push({ time: data[i].time, value: null });
                continue;
              }
              let sum = 0;
              for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
              }
              ma.push({ time: data[i].time, value: sum / period });
            }
            return ma;
          }

          // Calculate Bollinger Bands
          function calculateBollinger(data, period = 20, multiplier = 2) {
            const upper = [], middle = [], lower = [];
            for (let i = 0; i < data.length; i++) {
              if (i < period - 1) {
                upper.push({ time: data[i].time, value: null });
                middle.push({ time: data[i].time, value: null });
                lower.push({ time: data[i].time, value: null });
                continue;
              }
              let sum = 0;
              for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
              }
              const avg = sum / period;
              let variance = 0;
              for (let j = 0; j < period; j++) {
                variance += Math.pow(data[i - j].close - avg, 2);
              }
              const stdDev = Math.sqrt(variance / period);
              upper.push({ time: data[i].time, value: avg + (multiplier * stdDev) });
              middle.push({ time: data[i].time, value: avg });
              lower.push({ time: data[i].time, value: avg - (multiplier * stdDev) });
            }
            return { upper, middle, lower };
          }

          // Fetch historical data
          async function fetchData(symbol, interval) {
            try {
              const response = await fetch(
                'https://api.binance.com/api/v3/klines?symbol=' + symbol + '&interval=' + interval + '&limit=500'
              );
              const data = await response.json();
              
              const candles = data.map(c => ({
                time: c[0] / 1000,
                open: parseFloat(c[1]),
                high: parseFloat(c[2]),
                low: parseFloat(c[3]),
                close: parseFloat(c[4]),
              }));

              const volumes = data.map(c => ({
                time: c[0] / 1000,
                value: parseFloat(c[5]),
                color: parseFloat(c[4]) >= parseFloat(c[1]) ? '${theme.colors.chartUp}80' : '${theme.colors.chartDown}80',
              }));

              candleSeries.setData(candles);
              volumeSeries.setData(volumes);
              chart.timeScale().fitContent();

              ${showIndicators ? `
              // Calculate and set indicators
              const ma7 = calculateMA(candles, 7);
              const ma25 = calculateMA(candles, 25);
              const ma99 = calculateMA(candles, 99);
              ma7Series.setData(ma7);
              ma25Series.setData(ma25);
              ma99Series.setData(ma99);

              const bb = calculateBollinger(candles);
              bollingerUpper.setData(bb.upper);
              bollingerMiddle.setData(bb.middle);
              bollingerLower.setData(bb.lower);
              ` : ''}

              return candles[candles.length - 1];
            } catch (err) {
              console.error('Fetch error:', err);
              return null;
            }
          }

          // WebSocket for live updates
          function connectWebSocket(symbol) {
            if (ws) ws.close();
            
            const streamName = symbol.toLowerCase() + '@kline_' + currentInterval;
            ws = new WebSocket('wss://stream.binance.com:9443/ws/' + streamName);

            ws.onmessage = (event) => {
              const msg = JSON.parse(event.data);
              const k = msg.k;
              
              const candle = {
                time: k.t / 1000,
                open: parseFloat(k.o),
                high: parseFloat(k.h),
                low: parseFloat(k.l),
                close: parseFloat(k.c),
              };

              candleSeries.update(candle);
              
              const volume = {
                time: k.t / 1000,
                value: parseFloat(k.v),
                color: parseFloat(k.c) >= parseFloat(k.o) ? '${theme.colors.chartUp}80' : '${theme.colors.chartDown}80',
              };
              volumeSeries.update(volume);

              document.getElementById('current-price').textContent = 
                symbol + ': ' + candle.close.toFixed(2) + ' | Vol: ' + (parseFloat(k.v) / 1000).toFixed(1) + 'K';
            };

            ws.onerror = (err) => {
              console.error('WebSocket error:', err);
              setTimeout(() => connectWebSocket(symbol), 5000);
            };

            ws.onclose = () => {
              setTimeout(() => connectWebSocket(symbol), 5000);
            };
          }

          // Change interval
          function changeInterval(newInterval) {
            currentInterval = newInterval;
            document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            fetchData(currentSymbol, currentInterval);
            connectWebSocket(currentSymbol);
          }

          // Drawing tools
          function addDrawingPoint(x, y, time, price) {
            if (!drawingTool) return;
            drawings.push({ tool: drawingTool, x, y, time, price });
          }

          function setDrawingTool(tool) {
            drawingTool = tool;
            isDrawing = !!tool;
          }

          // Initialize
          initChart();
          fetchData(currentSymbol, currentInterval).then(() => {
            connectWebSocket(currentSymbol);
            document.querySelector('.loading-overlay')?.remove();
          });
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <View style={[styles.container, { height }]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: chartHtml }}
        style={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setError(nativeEvent.description);
          setLoading(false);
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        scrollEnabled={false}
        bounces={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
      {error && (
        <View style={styles.errorContainer}>
          <ActivityIndicator size="small" color={COLORS.danger} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 32,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    alignSelf: 'center',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    zIndex: 1,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    padding: 4,
    borderRadius: 4,
    backgroundColor: COLORS.danger + '20',
  },
});
