import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
}

const { width } = Dimensions.get('window');

const defaultTickers: TickerItem[] = [
  { symbol: 'BTC', price: '43,250', change: '+2.45%', isUp: true },
  { symbol: 'ETH', price: '2,680', change: '+1.82%', isUp: true },
  { symbol: 'BNB', price: '312', change: '-0.65%', isUp: false },
  { symbol: 'SOL', price: '98.7', change: '+5.23%', isUp: true },
  { symbol: 'XRP', price: '0.62', change: '-1.20%', isUp: false },
  { symbol: 'ADA', price: '0.58', change: '+0.95%', isUp: true },
  { symbol: 'DOGE', price: '0.089', change: '+3.45%', isUp: true },
  { symbol: 'DOT', price: '7.25', change: '-2.10%', isUp: false },
];

export default function PriceTicker() {
  const { theme } = useTheme();
  const [tickers, setTickers] = useState<TickerItem[]>(defaultTickers);
  const scrollRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Auto scroll animation
    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const newPos = prev + 1;
        if (newPos > 1000) return 0;
        return newPos;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentOffset={{ x: scrollPosition, y: 0 }}
      >
        <View style={styles.tickerContent}>
          {[...tickers, ...tickers].map((ticker, index) => (
            <View key={index} style={styles.tickerItem}>
              <Text style={[styles.symbol, { color: theme.colors.text }]}>
                {ticker.symbol}
              </Text>
              <Text style={[styles.price, { color: theme.colors.textSecondary }]}>
                ${ticker.price}
              </Text>
              <Text
                style={[
                  styles.change,
                  { color: ticker.isUp ? COLORS.chartUp : COLORS.chartDown },
                ]}
              >
                {ticker.change}
              </Text>
              <Ionicons
                name={ticker.isUp ? 'caret-up' : 'caret-down'}
                size={12}
                color={ticker.isUp ? COLORS.chartUp : COLORS.chartDown}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Need to import Ionicons
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'center',
  },
  tickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 6,
  },
  symbol: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 12,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
});
