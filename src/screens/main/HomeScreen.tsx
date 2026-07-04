import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList, MenuDrawerParamList } from '../../types/navigation.types';
import { COLORS, PLANS } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type MenuNavigationProp = DrawerNavigationProp<MenuDrawerParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const menuNavigation = useNavigation<MenuNavigationProp>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [searchQuery, setSearchQuery] = useState('');
  const [glowAnim] = useState(new Animated.Value(0));

  // Glow animation for Plus button
  React.useEffect(() => {
    if (subscription?.plan !== PLANS.PLUS_MONTHLY && subscription?.plan !== PLANS.PLUS_YEARLY) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [subscription]);

  const handleOpenMenu = () => {
    menuNavigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearch = () => {
    // Navigate to search or filter
    menuNavigation.navigate('Favorites');
  };

  const handleAskAI = () => {
    navigation.navigate('Main', { screen: 'AIChat' } as any);
  };

  const handleUpgradePlus = () => {
    menuNavigation.navigate('Plus');
  };

  const isPlus = subscription?.plan === PLANS.PLUS_MONTHLY || subscription?.plan === PLANS.PLUS_YEARLY;

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 215, 0, 0.3)', 'rgba(255, 215, 0, 0.8)'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleOpenMenu} style={styles.menuButton}>
          <View style={styles.hamburger}>
            <View style={[styles.hamburgerLine, { backgroundColor: theme.colors.text }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: theme.colors.text }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: theme.colors.text }]} />
          </View>
        </TouchableOpacity>

        {/* Plus Banner */}
        {!isPlus && (
          <Animated.View
            style={[
              styles.plusBanner,
              {
                shadowColor: '#FFD700',
                shadowOpacity: glowInterpolation,
                shadowRadius: 15,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          >
            <TouchableOpacity onPress={handleUpgradePlus} activeOpacity={0.8}>
              <View style={styles.plusContent}>
                <Ionicons name="diamond" size={16} color="#FFD700" />
                <Text style={styles.plusText}>Trade AI Plus</Text>
                <Text style={styles.plusSubtext}>ترقية</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {isPlus && (
          <View style={[styles.plusBadge, { backgroundColor: '#FFD70020' }]}>
            <Ionicons name="diamond" size={16} color="#FFD700" />
            <Text style={[styles.plusBadgeText, { color: '#FFD700' }]}>Plus</Text>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Trade AI</Text>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
            مرحباً{user?.username ? ` ${user.username}` : ''} 👋
          </Text>
          <Text style={[styles.welcomeSubtext, { color: theme.colors.textSecondary }]}>
            كيف يمكنني مساعدتك في التداول اليوم؟
          </Text>
        </View>

        {/* AI Assistant Card */}
        <TouchableOpacity
          style={[styles.aiCard, { backgroundColor: theme.colors.surface }]}
          onPress={handleAskAI}
          activeOpacity={0.8}
        >
          <View style={styles.aiCardContent}>
            <View style={[styles.aiIconContainer, { backgroundColor: COLORS.primary + '20' }]}>
              <Ionicons name="chatbubble-ellipses" size={28} color={COLORS.primary} />
            </View>
            <View style={styles.aiTextContainer}>
              <Text style={[styles.aiTitle, { color: theme.colors.text }]}>
                AI مساعد
              </Text>
              <Text style={[styles.aiDescription, { color: theme.colors.textSecondary }]}>
                اطرح سؤالك عن التداول...
              </Text>
            </View>
            <Ionicons name="arrow-back" size={20} color={theme.colors.textMuted} />
          </View>
        </TouchableOpacity>

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
            <Ionicons name="search" size={20} color={theme.colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="ابحث عن عملة أو سهم..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          الوصول السريع
        </Text>

        <View style={styles.quickActionsGrid}>
          {[
            { icon: '📊', label: 'تحليل السوق', screen: 'Market' },
            { icon: '📡', label: 'الإشارات', screen: 'Signals' },
            { icon: '📰', label: 'الأخبار', screen: 'News' },
            { icon: '⭐', label: 'المفضلة', screen: 'Favorites' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickActionItem, { backgroundColor: theme.colors.surface }]}
              onPress={() => menuNavigation.navigate(item.screen as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.quickActionIcon}>{item.icon}</Text>
              <Text style={[styles.quickActionLabel, { color: theme.colors.textSecondary }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Market Overview */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          نظرة عامة على السوق
        </Text>

        <View style={[styles.marketCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.marketHeader}>
            <Text style={[styles.marketTitle, { color: theme.colors.text }]}>BTC/USDT</Text>
            <View style={[styles.marketBadge, { backgroundColor: COLORS.chartUp + '20' }]}>
              <Text style={[styles.marketBadgeText, { color: COLORS.chartUp }]}>+2.45%</Text>
            </View>
          </View>
          <Text style={[styles.marketPrice, { color: theme.colors.text }]}>$43,250.00</Text>
          <View style={styles.marketChart}>
            {/* Simple sparkline placeholder */}
            <View style={styles.sparkline}>
              {[40, 35, 45, 38, 50, 42, 55, 48, 60, 52, 58, 65].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.sparklineBar,
                    {
                      height: h,
                      backgroundColor: i > 5 ? COLORS.chartUp : COLORS.chartDown,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
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
  menuButton: {
    padding: 8,
  },
  hamburger: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: '100%',
    height: 2.5,
    borderRadius: 2,
  },
  plusBanner: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  plusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    backgroundColor: '#FFD70015',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD70040',
  },
  plusText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  plusSubtext: {
    color: '#FFD700',
    fontSize: 10,
    opacity: 0.8,
  },
  plusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  plusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  welcomeContainer: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
  },
  aiCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  aiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  aiDescription: {
    fontSize: 13,
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  quickActionItem: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  marketCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  marketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  marketBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  marketBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  marketPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  marketChart: {
    height: 60,
  },
  sparkline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  sparklineBar: {
    width: 8,
    borderRadius: 4,
    opacity: 0.7,
  },
});
