import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

const menuItems = [
  { id: 'learn', icon: '📚', labelKey: 'learn' },
  { id: 'capital', icon: '💰', labelKey: 'capital' },
  { id: 'market', icon: '📊', labelKey: 'market' },
  { id: 'signals', icon: '🎯', labelKey: 'signals' },
  { id: 'news', icon: '📰', labelKey: 'news' },
  { id: 'favorites', icon: '⭐', labelKey: 'favorites' },
  { id: 'notifications', icon: '🔔', labelKey: 'notifications' },
  { id: 'profile', icon: '👤', labelKey: 'profile' },
  { id: 'settings', icon: '⚙️', labelKey: 'settings' },
];

export default function Sidebar({ isOpen, onClose, onNavigate }: SidebarProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sidebar, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.username, { color: theme.colors.text }]}>
            {user?.username || t('guest')}
          </Text>
          <Text style={[styles.email, { color: theme.colors.textMuted }]}>
            {user?.email || ''}
          </Text>
        </View>

        <ScrollView style={styles.menu}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
              onPress={() => {
                onNavigate(item.id);
                onClose();
              }}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuLabel, { color: theme.colors.text }]}>
                {t(item.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.logout, { borderTopColor: theme.colors.border }]}
          onPress={logout}
        >
          <Text style={{ color: theme.colors.danger }}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebar: {
    width: 280,
    height: '100%',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 16,
  },
  logout: {
    padding: 16,
    borderTopWidth: 1,
  },
});
