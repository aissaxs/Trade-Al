import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  title?: string;
  showMenu?: boolean;
  showBack?: boolean;
  onMenuPress?: () => void;
  onBackPress?: () => void;
  rightIcon?: React.ReactNode;
}

export default function Header({
  title,
  showMenu = true,
  showBack = false,
  onMenuPress,
  onBackPress,
  rightIcon,
}: HeaderProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress} style={styles.button}>
            <Text style={[styles.icon, { color: theme.colors.text }]}>←</Text>
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity onPress={onMenuPress} style={styles.button}>
            <Text style={[styles.icon, { color: theme.colors.text }]}>☰</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title || t('appName')}
      </Text>

      <View style={styles.right}>
        {rightIcon}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  right: {
    width: 60,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  button: {
    padding: 8,
  },
  icon: {
    fontSize: 24,
  },
});
