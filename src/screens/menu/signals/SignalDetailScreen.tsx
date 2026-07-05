import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuDrawerParamList } from '../../../types/navigation.types';
import { useTheme } from '../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function SignalDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MenuDrawerParamList>>();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>تفاصيل الإشارة</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: theme.colors.textSecondary }]}>
          تفاصيل الإشارة سيكون هنا...
        </Text>
      </View>
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
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholder: { fontSize: 16 },
});
