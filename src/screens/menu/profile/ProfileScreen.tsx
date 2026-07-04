import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuDrawerParamList } from '../../../types/navigation.types';
import { COLORS, PLANS } from '../../../utils/constants';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useSubscription } from '../../../hooks/useSubscription';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MenuDrawerParamList>>();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { subscription } = useSubscription();

  const isPlus = subscription?.plan === PLANS.PLUS_MONTHLY || subscription?.plan === PLANS.PLUS_YEARLY;

  const menuItems = [
    { icon: 'person-outline' as const, label: 'تعديل الملف الشخصي', action: () => {} },
    { icon: 'language-outline' as const, label: 'تغيير اللغة', action: () => {} },
    { icon: 'moon-outline' as const, label: 'الوضع الداكن', action: () => {} },
    { icon: 'notifications-outline' as const, label: 'إعدادات التنبيهات', action: () => {} },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>الحساب الشخصي</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.avatar, { backgroundColor: COLORS.primary + '20' }]}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={[styles.username, { color: theme.colors.text }]}>
            {user?.username || 'مستخدم'}
          </Text>
          <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
            {user?.email || ''}
          </Text>
          {isPlus && (
            <View style={[styles.plusBadge, { backgroundColor: '#FFD70020' }]}>
              <Ionicons name="diamond" size={14} color="#FFD700" />
              <Text style={[styles.plusText, { color: '#FFD700' }]}>Trade AI Plus</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {[
            { label: 'الصفقات', value: '24' },
            { label: 'الربح %', value: '+12.5%' },
            { label: 'الدروس', value: '8' },
          ].map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
              onPress={item.action}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon} size={22} color={COLORS.primary} />
              <Text style={[styles.menuLabel, { color: theme.colors.text }]}>{item.label}</Text>
              <Ionicons name="chevron-back" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: COLORS.danger + '15' }]}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
          <Text style={[styles.logoutText, { color: COLORS.danger }]}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </ScrollView>
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
  profileCard: {
    alignItems: 'center',
    padding: 24,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 12,
  },
  plusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  plusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menuContainer: {
    padding: 16,
    marginTop: 8,
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
