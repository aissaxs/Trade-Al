import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuDrawerParamList } from '../../../types/navigation.types';
import { COLORS, PLANS, FREE_LIMITS } from '../../../utils/constants';
import { useTheme } from '../../../context/ThemeContext';
import { useSubscription } from '../../../hooks/useSubscription';
import { useTimer } from '../../../hooks/useTimer';
import TradingViewChart from '../../../components/charts/TradingViewChart';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type MarketNavigationProp = NativeStackNavigationProp<MenuDrawerParamList>;

interface MarketPair {
  symbol: string;
  price: string;
  change24h: string;
  isUp: boolean;
}

const popularPairs: MarketPair[] = [
  { symbol: 'BTCUSDT', price: '43,250.00', change24h: '+2.45%', isUp: true },
  { symbol: 'ETHUSDT', price: '2,680.50', change24h: '+1.82%', isUp: true },
  { symbol: 'BNBUSDT', price: '312.40', change24h: '-0.65%', isUp: false },
  { symbol: 'SOLUSDT', price: '98.75', change24h: '+5.23%', isUp: true },
  { symbol: 'XRPUSDT', price: '0.6234', change24h: '-1.20%', isUp: false },
  { symbol: 'ADAUSDT', price: '0.5840', change24h: '+0.95%', isUp: true },
];

export default function MarketScreen() {
  const navigation = useNavigation<MarketNavigationProp>();
  const { theme } = useTheme();
  const { subscription } = useSubscription();
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedInterval, setSelectedInterval] = useState('1h');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isPlus = subscription?.plan === PLANS.PLUS_MONTHLY || subscription?.plan === PLANS.PLUS_YEARLY;
  
  // Timer for free users (30 minutes daily)
  const { timeLeft, isActive, startTimer, stopTimer } = useTimer(
    isPlus ? Infinity : FREE_LIMITS.MARKET_ANALYSIS_MINUTES * 60
  );

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const generateAnalysis = async () => {
    setLoading(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analyses = [
      'الاتجاه صاعد بقوة 🟢\n\nالسعر فوق المتوسطات المتحركة\nحجم التداول متزايد\nمستوى الدعم: 42,800\nمستوى المقاومة: 44,200',
      'السوق عرضي 🟡\n\nتذبذب بين الدعم والمقاومة\nانتظار كسر أحد المستويات\nمستوى الدعم: 42,500\nمستوى المقاومة: 43,800',
      'تحذير: هبوط محتمل 🔴\n\nتشكيل نمط انعكاسي\nحجم البيع متزايد\nمستوى الدعم: 41,200\nمستوى المقاومة: 43,500',
    ];
    
    setAnalysis(analyses[Math.floor(Math.random() * analyses.length)]);
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>تحليل السوق</Text>
        <View style={styles.timerContainer}>
          {!isPlus && (
            <View style={[styles.timerBadge, { backgroundColor: timeLeft < 300 ? COLORS.danger + '20' : COLORS.primary + '20' }]}>
              <Ionicons name="time-outline" size={14} color={timeLeft < 300 ? COLORS.danger : COLORS.primary} />
              <Text style={[styles.timerText, { color: timeLeft < 300 ? COLORS.danger : COLORS.primary }]}>
                {formatTime(timeLeft)}
              </Text>
            </View>
          )}
          {isPlus && (
            <View style={[styles.plusBadge, { backgroundColor: '#FFD70020' }]}>
              <Ionicons name="infinite" size={14} color="#FFD700" />
            </View>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Chart */}
        <TradingViewChart
          symbol={selectedSymbol}
          interval={selectedInterval}
          height={350}
          showIndicators={true}
          showDrawingTools={true}
        />

        {/* Symbol Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.symbolsContainer}
        >
          {popularPairs.map((pair) => (
            <TouchableOpacity
              key={pair.symbol}
              style={[
                styles.symbolButton,
                {
                  backgroundColor: selectedSymbol === pair.symbol ? COLORS.primary + '20' : theme.colors.surface,
                  borderColor: selectedSymbol === pair.symbol ? COLORS.primary : 'transparent',
                },
              ]}
              onPress={() => setSelectedSymbol(pair.symbol)}
            >
              <Text
                style={[
                  styles.symbolText,
                  {
                    color: selectedSymbol === pair.symbol ? COLORS.primary : theme.colors.text,
                  },
                ]}
              >
                {pair.symbol.replace('USDT', '')}
              </Text>
              <Text
                style={[
                  styles.changeText,
                  { color: pair.isUp ? COLORS.chartUp : COLORS.chartDown },
                ]}
              >
                {pair.change24h}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AI Analysis Button */}
        <TouchableOpacity
          style={[styles.analysisButton, { backgroundColor: COLORS.primary }]}
          onPress={generateAnalysis}
          disabled={loading || (!isPlus && timeLeft <= 0)}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              <Text style={styles.analysisButtonText}>تحليل AI</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Analysis Result */}
        {analysis && (
          <View style={[styles.analysisCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.analysisHeader}>
              <Ionicons name="analytics" size={20} color={COLORS.primary} />
              <Text style={[styles.analysisTitle, { color: theme.colors.text }]}>
                تحليل الذكاء الاصطناعي
              </Text>
            </View>
            <Text style={[styles.analysisText, { color: theme.colors.textSecondary }]}>
              {analysis}
            </Text>
          </View>
        )}

        {/* Pairs List */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>العملات الشائعة</Text>
        <View style={styles.pairsList}>
          {popularPairs.map((pair) => (
            <View
              key={pair.symbol}
              style={[styles.pairRow, { backgroundColor: theme.colors.surface }]}
            >
              <View style={styles.pairInfo}>
                <Text style={[styles.pairSymbol, { color: theme.colors.text }]}>
                  {pair.symbol.replace('USDT', '/USDT')}
                </Text>
                <Text style={[styles.pairPrice, { color: theme.colors.textSecondary }]}>
                  ${pair.price}
                </Text>
              </View>
              <View
                style={[
                  styles.changeBadge,
                  {
                    backgroundColor: pair.isUp ? COLORS.chartUp + '20' : COLORS.chartDown + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.changeBadgeText,
                    { color: pair.isUp ? COLORS.chartUp : COLORS.chartDown },
                  ]}
                >
                  {pair.change24h}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  timerText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  plusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  symbolsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  symbolButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 80,
  },
  symbolText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  changeText: {
    fontSize: 11,
    marginTop: 2,
  },
  analysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  analysisButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analysisCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  pairsList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 8,
  },
  pairRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  pairInfo: {
    flex: 1,
  },
  pairSymbol: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pairPrice: {
    fontSize: 13,
  },
  changeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
