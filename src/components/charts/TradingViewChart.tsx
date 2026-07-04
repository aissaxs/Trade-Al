import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../context/ThemeContext';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  height?: number;
}

export default function TradingViewChart({
  symbol,
  interval = '1h',
  height = 400,
}: TradingViewChartProps) {
  const { theme } = useTheme();
  const webViewRef = useRef<WebView>(null);

  const chartHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://unpkg.com/lightweight-charts@4.1.0/dist/lightweight-charts.standalone.production.js"></script>
        <style>
          body { margin: 0; padding: 0; background: ${theme.colors.background}; }
          #chart { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="chart"></div>
        <script>
          const chart = LightweightCharts.createChart(document.getElementById('chart'), {
            layout: {
              background: { color: '${theme.colors.background}' },
              textColor: '${theme.colors.textSecondary}',
            },
            grid: {
              vertLines: { color: '${theme.colors.border}' },
              horzLines: { color: '${theme.colors.border}' },
            },
            crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
            rightPriceScale: { borderColor: '${theme.colors.border}' },
            timeScale: { borderColor: '${theme.colors.border}' },
          });

          const candleSeries = chart.addCandlestickSeries({
            upColor: '${theme.colors.chartUp}',
            downColor: '${theme.colors.chartDown}',
            borderUpColor: '${theme.colors.chartUp}',
            borderDownColor: '${theme.colors.chartDown}',
            wickUpColor: '${theme.colors.chartUp}',
            wickDownColor: '${theme.colors.chartDown}',
          });

          // Fetch data from Binance
          fetch('https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100')
            .then(res => res.json())
            .then(data => {
              const candles = data.map(c => ({
                time: c[0] / 1000,
                open: parseFloat(c[1]),
                high: parseFloat(c[2]),
                low: parseFloat(c[3]),
                close: parseFloat(c[4]),
              }));
              candleSeries.setData(candles);
              chart.timeScale().fitContent();
