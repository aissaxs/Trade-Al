import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuDrawerParamList } from '../../../types/navigation.types';
import { COLORS } from '../../../utils/constants';
import { useTheme } from '../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface Signal {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  confidence: number;
  entryPrice: string;
  targetPrice: string;
  stopLoss: string;
  reason: string;
  timestamp: string;
  isActive: boolean;
}

const signals: Signal[] = [
  {
    id: '1',
    pair: 'BTC/USDT',
    type: 'buy',
    confidence: 87,
    entryPrice: '43,200',
    targetPrice: '45,800',
    stopLoss: '41,500',
    reason: 'اختراق مقاومة + حجم تداول متزايد + تقاطع إيجابي للمتوسطات',
    timestamp: 'منذ 15 دقيقة',
    isActive: true,
  },
  {
    id: '2',
    pair: 'ETH/USDT',
    type: 'sell',
    confidence: 72,
    entryPrice: '2,700',
    targetPrice: '2,450',
    stopLoss: '2,850',
    reason: 'تشكيل نمط رأس وكتفين + مؤشر RSI في منطقة ذروة الشراء',
    timestamp: 'منذ 45 دقيقة',
    isActive: true,
  },
  {
    id: '3',
    pair: 'SOL/USDT',
    type: 'buy',
    confidence: 91,
    entryPrice: '98.50',
    targetPrice: '115.00',
    stopLoss: '92.00',
    reason: 'دعم قوي عند 95 + اختراق خط الاتجاه الهابط',
    timestamp: 'منذ ساعة',
    isActive: true,
  },
  {
    id: '4',
    pair: 'BNB/USDT',
    type: 'sell',
    confidence: 65,
    entryPrice: '315.00',
    targetPrice: '295.00',
    stopLoss: '325.00',
    reason: 'ضعف الزخم + كسر دعم 320',
    timestamp: 'منذ ساعتين',
    isActive: false,
  },
];

export default function SignalsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MenuDrawerParamList>>();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');

  const filteredSignals = signals.filter((s) => {
    if (filter === 'all') return true;
    return s.type === filter;
  });

  const renderSignal = ({ item }: { item: Signal }) => (
    <View
      style={[
        styles.signalCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: item.type === 'buy' ? COLORS.chartUp + '40' : COLORS.chartDown + '40',
        },
      ]}
    >
      {/* Header */}
      <View style={styles.signalHeader}>
        <View style={styles.pairContainer}>
          <Text style={[styles.pairText, { color: theme.colors.text }]}>{item.pair}</Text>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: item.type === 'buy' ? COLORS.chartUp + '20' : COLORS.chartDown + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.typeText,
                { color: item.type === 'buy' ? COLORS.chartUp : COLORS.chartDown },
              ]}
            >
              {item.type === 'buy' ? 'شراء' : 'بيع'}
            </Text>
          </View>
        </View>
        <View style={styles.confidenceContainer}>
          <Text style={[styles.confidenceLabel, { color: theme.colors.textMuted }]}>الثقة</Text>
          <View style={styles.confidenceBar}>
            <View
              style={[
                styles.confidenceFill,
                {
                  width: `${item.confidence}%`,
                  backgroundColor: item.confidence > 80 ? COLORS.success : item.confidence > 60 ? COLORS.warning : COLORS.danger,
                },
              ]}
            />
          </View>
          <Text style={[styles.confidenceValue, { color: theme.colors.text }]}>{item.confidence}%</Text>
        </View>
      </View>

      {/* Prices */}
      <View style={styles.pricesGrid}>
        <View style={styles.priceItem}>
          <Text style={[styles.priceLabel, { color: theme.colors.textMuted }]}>الدخول</Text>
          <Text style={[styles.priceValue, { color: theme.colors.text }]}>${item.entryPrice}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={[styles.priceLabel, { color: theme.colors.textMuted }]}>الهدف</Text>
          <Text style={[styles.priceValue, { color: COLORS.chartUp }]}>${item.targetPrice}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={[styles.priceLabel, { color: theme.colors.textMuted }]}>وقف الخسارة</Text>
          <Text style={[styles.priceValue, { color: COLORS.chartDown }]}>${item.stopLoss}</Text>
        </View>
      </View>

      {/* Reason */}
      <View style={[styles.reasonContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="information-circle" size={16} color={COLORS.primary} />
        <Text style={[styles.reasonText, { color: theme.colors.textSecondary }]}>
          {item.reason}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.signalFooter}>
        <Text style={[styles.timestamp, { color: theme.colors.textMuted }]}>{item.timestamp}</Text>
        {item.isActive && (
          <View style={[styles.activeBadge, { backgroundColor: COLORS.success + '20' }]}>
            <View style={[styles.activeDot, { backgroundColor: COLORS.success }]} />
            <Text style={[styles.activeText, { color: COLORS.success }]}>نشط</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>الإشارات والتوصيات</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all' as const, label: 'الكل' },
          { key: 'buy' as const, label: 'شراء' },
          { key: 'sell' as const, label: 'بيع' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.filterTab,
              filter === tab.key && {
                backgroundColor: COLORS.primary + '20',
                borderColor: COLORS.primary,
              },
            ]}
            onPress={() => setFilter(tab.key)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === tab.key ? COLORS.primary : theme.colors.textMuted },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Signals List */}
      <FlatList
        data={filteredSignals}
        renderItem={renderSignal}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.signalsList}
        showsVerticalScrollIndicator={false}
      />
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signalsList: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  signalCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pairText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  confidenceContainer: {
    alignItems: 'center',
    gap: 4,
  },
  confidenceLabel: {
    fontSize: 10,
  },
  confidenceBar: {
    width: 50,
    height: 4,
    backgroundColor: 'rgba(128,128,128,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  pricesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  priceItem: {
    alignItems: 'center',
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  reasonText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  signalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 11,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
