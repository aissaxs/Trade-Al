import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuDrawerParamList } from '../../../types/navigation.types';
import { COLORS } from '../../../utils/constants';
import { useTheme } from '../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface FavoriteItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change24h: string;
  isUp: boolean;
  type: 'crypto' | 'stock' | 'forex';
}

const favorites: FavoriteItem[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: '43,250.00', change24h: '+2.45%', isUp: true, type: 'crypto' },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: '2,680.50', change24h: '+1.82%', isUp: true, type: 'crypto' },
  { id: '3', symbol: 'AAPL', name: 'Apple Inc.', price: '195.89', change24h: '+0.95%', isUp: true, type: 'stock' },
  { id: '4', symbol: 'EUR/USD', name: 'Euro/Dollar', price: '1.0845', change24h: '-0.32%', isUp: false, type: 'forex' },
  { id: '5', symbol: 'SOL', name: 'Solana', price: '98.75', change24h: '+5.23%', isUp: true, type: 'crypto' },
];

const typeIcons = {
  crypto: 'logo-bitcoin',
  stock: 'trending-up',
  forex: 'swap-horizontal',
};

export default function FavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MenuDrawerParamList>>();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'crypto' | 'stock' | 'forex'>('all');

  const filteredFavorites = favorites.filter((item) => {
    const matchesSearch = item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity
      style={[styles.favoriteCard, { backgroundColor: theme.colors.surface }]}
      activeOpacity={0.8}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.typeIconContainer, { backgroundColor: COLORS.primary + '15' }]}>
          <Ionicons name={typeIcons[item.type] as any} size={18} color={COLORS.primary} />
        </View>
        <View>
          <Text style={[styles.symbolText, { color: theme.colors.text }]}>{item.symbol}</Text>
          <Text style={[styles.nameText, { color: theme.colors.textSecondary }]}>{item.name}</Text>
        </View>
      </View>

      <View style={styles.itemRight}>
        <Text style={[styles.priceText, { color: theme.colors.text }]}>${item.price}</Text>
        <View
          style={[
            styles.changeBadge,
            {
              backgroundColor: item.isUp ? COLORS.chartUp + '20' : COLORS.chartDown + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.changeText,
              { color: item.isUp ? COLORS.chartUp : COLORS.chartDown },
            ]}
          >
            {item.change24h}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.removeButton}>
        <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>المفضلة والمراقبة</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons name="search" size={18} color={theme.colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="ابحث عن عملة أو سهم..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all' as const, label: 'الكل' },
          { key: 'crypto' as const, label: 'عملات رقمية' },
          { key: 'stock' as const, label: 'أسهم' },
          { key: 'forex' as const, label: 'فوركس' },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              activeFilter === filter.key && {
                backgroundColor: COLORS.primary + '20',
                borderColor: COLORS.primary,
              },
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === filter.key ? COLORS.primary : theme.colors.textMuted },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Favorites List */}
      <FlatList
        data={filteredFavorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.favoritesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={64} color={theme.colors.textMuted + '40'} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              لا توجد عناصر في المفضلة
            </Text>
          </View>
        }
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
  addButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    textAlign: 'right',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  favoritesList: {
    padding: 16,
    paddingBottom: 100,
    gap: 10,
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  symbolText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 12,
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
  },
});
