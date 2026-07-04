import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: '🏠', labelKey: 'home' },
  { id: 'market', icon: '📊', labelKey: 'market' },
  { id: 'ai', icon: '🤖', labelKey: 'aiAssistant' },
  { id: 'favorites', icon: '⭐', labelKey: 'favorites' },
  { id: 'profile', icon: '👤', labelKey: 'profile' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabChange(tab.id)}
        >
          <Text style={[styles.icon, { opacity: activeTab === tab.id ? 1 : 0.5 }]}>
            {tab.icon}
          </Text>
          <Text
            style={[
              styles.label,
              {
                color: activeTab === tab.id ? theme.colors.primary : theme.colors.textMuted,
              },
            ]}
          >
            {t(tab.labelKey)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
  },
});
