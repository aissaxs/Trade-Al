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

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  summary: string;
}

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'البنك الفيدرالي يبقي على أسعار الفائدة دون تغيير',
    source: 'Bloomberg',
    time: 'منذ 30 دقيقة',
    impact: 'high',
    category: 'الفائدة',
    summary: 'قرر البنك الفيدرالي الأمريكي الإبقاء على أسعار الفائدة في نطاق 5.25% - 5.50%',
  },
  {
    id: '2',
    title: 'بيتكوين تسجل مستوى قياسي جديد',
    source: 'CoinDesk',
    time: 'منذ ساعة',
    impact: 'high',
    category: 'عملات رقمية',
    summary: 'تجاوزت بيتكوين حاجز 45,000 دولار للمرة الأولى منذ عام 2022',
  },
  {
    id: '3',
    title: 'أرباح شركة آبل تفوق التوقعات',
    source: 'Reuters',
    time: 'منذ ساعتين',
    impact: 'medium',
    category: 'أسهم',
    summary: 'سجلت آبل إيرادات قدرها 89.5 مليار دولار في الربع الأخير',
  },
  {
    id: '4',
    title: 'النفط يصعد مع تصاعد التوترات الجيوسياسية',
    source: 'CNBC',
    time: 'منذ 3 ساعات',
    impact: 'medium',
    category: 'سلع',
    summary: 'ارتفعت أسعار النفط الخام بنسبة 2% وسط مخاوف من تعطل الإمدادات',
  },
  {
    id: '5',
    title: 'اليورو يتراجع أمام الدولار',
    source: 'ForexLive',
    time: 'منذ 4 ساعات',
    impact: 'low',
    category: 'فوركس',
    summary: 'انخفض اليورو إلى 1.08 دولار وسط بيانات اقتصادية ضعيفة من منطقة اليورو',
  },
];

const impactColors = {
  high: { bg: '#FF174420', text: '#FF1744', label: 'عالي' },
  medium: { bg: '#FFD60020', text: '#FFD600', label: 'متوسط' },
  low: { bg: '#00C85320', text: '#00C853', label: 'منخفض' },
};

export default function NewsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MenuDrawerParamList>>();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'news' | 'calendar' | 'alerts'>('news');

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity
      style={[styles.newsCard, { backgroundColor: theme.colors.surface }]}
      activeOpacity={0.8}
    >
      <View style={styles.newsHeader}>
        <View style={styles.newsMeta}>
          <Text style={[styles.newsSource, { color: theme.colors.textMuted }]}>{item.source}</Text>
          <Text style={[styles.newsTime, { color: theme.colors.textMuted }]}>{item.time}</Text>
        </View>
        <View
          style={[
            styles.impactBadge,
            { backgroundColor: impactColors[item.impact].bg },
          ]}
        >
          <Text style={[styles.impactText, { color: impactColors[item.impact].text }]}>
            {impactColors[item.impact].label}
          </Text>
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <Text style={[styles.categoryText, { color: COLORS.primary }]}>{item.category}</Text>
      </View>

      <Text style={[styles.newsTitle, { color: theme.colors.text }]}>{item.title}</Text>
      <Text style={[styles.newsSummary, { color: theme.colors.textSecondary }]}>
        {item.summary}
      </Text>
    </TouchableOpacity>
  );

  const renderCalendar = () => (
    <View style={styles.calendarContainer}>
      {[
        { time: '08:30', event: 'مؤشر أسعار المستهلكين CPI', country: '🇺🇸', impact: 'high' },
        { time: '10:00', event: 'مبيعات التجزئة', country: '🇺🇸', impact: 'high' },
        { time: '14:00', event: 'قرار الفائدة البريطاني', country: '🇬🇧', impact: 'high' },
        { time: '16:30', event: 'مخزونات النفط الخام', country: '🇺🇸', impact: 'medium' },
      ].map((item, index) => (
        <View
          key={index}
          style={[styles.calendarItem, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.calendarTime}>
            <Text style={[styles.timeText, { color: theme.colors.text }]}>{item.time}</Text>
          </View>
          <View style={styles.calendarContent}>
            <Text style={[styles.eventText, { color: theme.colors.text }]}>{item.event}</Text>
            <Text style={[styles.countryText, { color: theme.colors.textMuted }]}>{item.country}</Text>
          </View>
          <View
            style={[
              styles.calendarImpact,
              { backgroundColor: impactColors[item.impact as keyof typeof impactColors].bg },
            ]}
          >
            <Text
              style={[
                styles.calendarImpactText,
                { color: impactColors[item.impact as keyof typeof impactColors].text },
              ]}
            >
              {impactColors[item.impact as keyof typeof impactColors].label}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>الأخبار الاقتصادية</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { key: 'news' as const, label: 'الأخبار', icon: 'newspaper-outline' },
          { key: 'calendar' as const, label: 'التقويم', icon: 'calendar-outline' },
          { key: 'alerts' as const, label: 'التنبيهات', icon: 'notifications-outline' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && { backgroundColor: COLORS.primary + '20' },
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={activeTab === tab.key ? COLORS.primary : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.key ? COLORS.primary : theme.colors.textMuted },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'news' && (
        <FlatList
          data={newsItems}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.newsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'calendar' && (
        <ScrollView contentContainerStyle={styles.calendarList} showsVerticalScrollIndicator={false}>
          {renderCalendar()}
        </ScrollView>
      )}

      {activeTab === 'alerts' && (
        <View style={styles.alertsPlaceholder}>
          <Ionicons name="notifications-off" size={64} color={theme.colors.textMuted + '40'} />
          <Text style={[styles.alertsText, { color: theme.colors.textSecondary }]}>
            لا توجد تنبيهات حالياً
          </Text>
        </View>
      )}
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  newsList: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  newsCard: {
    padding: 16,
    borderRadius: 12,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  newsMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  newsSource: {
    fontSize: 12,
    fontWeight: '600',
  },
  newsTime: {
    fontSize: 12,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  impactText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 22,
    marginBottom: 8,
  },
  newsSummary: {
    fontSize: 13,
    lineHeight: 20,
  },
  calendarList: {
    padding: 16,
    paddingBottom: 100,
  },
  calendarContainer: {
    gap: 10,
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
  },
  calendarTime: {
    width: 60,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calendarContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  eventText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  countryText: {
    fontSize: 12,
  },
  calendarImpact: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  calendarImpactText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  alertsPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertsText: {
    marginTop: 16,
    fontSize: 14,
  },
});
