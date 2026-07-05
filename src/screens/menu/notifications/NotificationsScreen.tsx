import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuDrawerParamList } from '../../../types/navigation.types';
import { COLORS } from '../../../utils/constants';
import { useTheme } from '../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'signal' | 'news' | 'price' | 'system';
  read: boolean;
}

const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'إشارة شراء جديدة',
    message: 'BTC/USDT - فرصة شراء عند 43,200',
    time: 'منذ 5 دقائق',
    type: 'signal',
    read: false,
  },
  {
    id: '2',
    title: 'تنبيه سعري',
    message: 'ETH تجاوز 2,700$',
    time: 'منذ 15 دقيقة',
    type: 'price',
    read: false,
  },
  {
    id: '3',
    title: 'خبر اقتصادي مهم',
    message: 'البنك الفيدرالي يعلن عن قرار الفائدة',
    time: 'منذ ساعة',
    type: 'news',
    read: true,
  },
  {
    id: '4',
    title: 'تحديث التطبيق',
    message: 'تم إضافة ميزات جديدة في التحليل',
    time: 'منذ يوم',
    type: 'system',
    read: true,
  },
];

const typeConfig = {
  signal: { icon: 'trending-up' as const, color: COLORS.chartUp },
  news: { icon: 'newspaper' as const, color: COLORS.primary },
  price: { icon: 'pricetag' as const, color: COLORS.warning },
  system: { icon: 'settings' as const, color: COLORS.info },
};

export default function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MenuDrawerParamList>>();
  const { theme } = useTheme();
  const [items, setItems] = useState(notifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredItems = items.filter((item) => {
    if (filter === 'unread') return !item.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setItems(items.map((item) => 
      item.id === id ? { ...item, read: true } : item
    ));
  };

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        {
          backgroundColor: theme.colors.surface,
          borderRightColor: typeConfig[item.type].color,
          borderRightWidth: item.read ? 0 : 3,
        },
      ]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.notificationContent}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: typeConfig[item.type].color + '15' }
        ]}>
          <Ionicons
            name={typeConfig[item.type].icon}
            size={20}
            color={typeConfig[item.type].color}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            { color: theme.colors.text, fontWeight: item.read ? '400' : 'bold' }
          ]}>
            {item.title}
          </Text>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            {item.message}
          </Text>
          <Text style={[styles.time, { color: theme.colors.textMuted }]}>
            {item.time}
          </Text>
        </View>
      </View>
      {!item.read && <View style={[styles.unreadDot, { backgroundColor: COLORS.primary }]} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>الإشعارات الذكية</Text>
        <TouchableOpacity onPress={() => setItems(items.map(i => ({ ...i, read: true })))}>
          <Text style={[styles.markAllText, { color: COLORS.primary }]}>قراءة الكل</Text>
        </TouchableOpacity>
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all' as const, label: 'الكل' },
          { key: 'unread' as const, label: 'غير مقروء' },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterTab,
              filter === f.key && { backgroundColor: COLORS.primary + '20' }
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[
              styles.filterText,
              { color: filter === f.key ? COLORS.primary : theme.colors.textMuted }
            ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  markAllText: { fontSize: 13, fontWeight: '600' },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: { fontSize: 13, fontWeight: '600' },
  list: { padding: 16, paddingBottom: 100, gap: 10 },
  notificationCard: {
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContent: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: { flex: 1 },
  title: { fontSize: 14, marginBottom: 4 },
  message: { fontSize: 12, marginBottom: 4, lineHeight: 18 },
  time: { fontSize: 11 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});
