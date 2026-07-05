import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  backgroundColor?: string;
}

export default function Card({
  children,
  onPress,
  padding = 16,
  margin = 8,
  borderRadius,
  backgroundColor,
}: CardProps) {
  const { theme } = useTheme();

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: backgroundColor || theme.colors.surface,
          padding,
          margin,
          borderRadius: borderRadius || theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
