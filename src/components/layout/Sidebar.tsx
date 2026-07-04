import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { COLORS, PLANS } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: string;
  color?: string;
}

const menuItems: MenuItem[] = [
  { icon: 'school-outline', label: 'تعلم التداول', screen: 'Learn', color: '#00B0FF' },
  { icon: 'calculator-outline', label: 'إدارة رأس المال', screen: 'Capital', color: '#00C853' },
  { icon: 'bar-chart-outline', label: 'تحليل السوق', screen: 'Market', color: '#FF6D00' },
  { icon: 'notifications-outline', label: 'الإشارات والتوصيات', screen: 'Signals', color: '#E040FB' },
  { icon: 'newspaper-outline', label: 'الأخبار الاقتصادية', screen: 'News', color: '#FFD600' },
  { icon: 'star-outline', label: 'المفضلة والمراقبة', screen: 'Favorites', color: '#FF1744' },
  { icon: 'alert-circle-outline', label: 'الإشعارات الذكية', screen: 'Notifications', color: '#00BFA5' },
  { icon: 'person-outline', label: 'الحساب الشخصي', screen: 'Profile', color: '#2979FF' },
  { icon: 'settings-outline', label: 'الإعدادات العامة', screen: 'Settings', color: '#78909C' },
];

export default function Sidebar(props: DrawerContentComponentProps) {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { subscription } = useSubscription();
  const { navigation } = props;

  const isPlus = subscription?.plan === PLANS.PLUS_MONTHLY || subscription?.plan === PLANS.PLUS_YEARLY;

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen as any);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* User Profile Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: COLORS.primary + '20' }]}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: theme.colors.text }]}>
              {user?.username || 'مستخدم'}
            </Text>
            <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
              {user?.email || ''}
            </Text>
            {isPlus && (
              <View style={[styles.plusBadge, { backgroundColor: '#FFD70020' }]}>
                <Ionicons name="diamond" size={12} color="#FFD700" />
                <Text style={[styles.plusText, { color: '#FFD700' }]}>Plus</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={() => handleNavigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: (item.color || COLORS.primary) + '15' }]}>
              <Ionicons
                name={item.icon}
                size={22}
                color={item.color || COLORS.primary}
              />
            </View>
            <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
              {item.label}
            </Text>
            <Ionicons
              name="chevron-back"
              size={18}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Plus Upgrade Banner */}
      {!isPlus && (
        <TouchableOpacity
          style={[styles.plusBanner, { backgroundColor: '#FFD70015', borderColor: '#FFD70040' }]}
          onPress={() => handleNavigate('Plus')}
          activeOpacity={0.8}
        >
          <Ionicons name="diamond" size={24} color="#FFD700" />
          <View style={styles.plusBannerContent}>
            <Text style={[styles.plusBannerTitle, { color: '#FFD700' }]}>
              ترقية إلى Plus
            </Text>
            <Text style={[styles.plusBannerDesc, { color: theme.colors.textSecondary }]}>
              صور غير محدودة + تحليل متقدم
            </Text>
          </View>
          <Ionicons name="arrow-back" size={18} color="#FFD700" />
        </TouchableOpacity>
      )}

      {/* Logout */}
      <TouchableOpacity
        style={[styles.logoutButton, { borderTopColor: theme.colors.border }]}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
        <Text style={[styles.logoutText, { color: COLORS.danger }]}>
          تسجيل الخروج
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.85,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    marginBottom: 6,
  },
  plusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  plusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    padding: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  plusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  plusBannerContent: {
    flex: 1,
  },
  plusBannerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  plusBannerDesc: {
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
