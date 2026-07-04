import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuDrawerParamList } from '../../../types/navigation.types';
import { COLORS } from '../../../utils/constants';
import { useTheme } from '../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MenuDrawerParamList>>();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const settingsGroups = [
    {
      title: 'التخصيص',
      items: [
        {
          icon: 'color-palette-outline' as const,
          label: 'تخصيص التطبيق',
          action: () => {},
        },
        {
          icon: 'moon-outline' as const,
          label: isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن',
          action: toggleTheme,
          value: isDarkMode ? 'مفعل' : 'معطل',
        },
      ],
    },
    {
      title: 'البيانات',
      items: [
        {
          icon: 'cloud-download-outline' as const,
          label: 'النسخ الاحتياطي',
          action: () => Alert.alert('قريباً', 'سيتم إضافة هذه الميزة قريباً'),
        },
        {
          icon: 'trash-outline' as const,
          label: 'مسح البيانات',
          action: () => Alert.alert(
            'تأكيد',
            'هل أنت متأكد من مسح جميع البيانات؟',
            [
              { text: 'إلغاء', style: 'cancel' },
              { text: 'مسح', style: 'destructive', onPress: () => {} },
            ]
          ),
          danger: true,
        },
      ],
    },
    {
      title: 'عن التطبيق',
      items: [
        {
          icon: 'information-circle-outline' as const,
          label: 'الإصدار',
          action: () => {},
          value: '1.0.0',
        },
        {
          icon: 'document-text-outline' as const,
          label: 'سياسة الخصوصية',
          action: () => {},
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>الإعدادات العامة</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.group}>
            <Text style={[styles.groupTitle, { color: theme.colors.textMuted }]}>
              {group.title}
            </Text>
            <View style={[styles.groupCard, { backgroundColor: theme.colors.surface }]}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < group.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={item.danger ? COLORS.danger : COLORS.primary}
                  />
                  <Text style={[
                    styles.settingLabel,
                    { color: item.danger ? COLORS.danger : theme.colors.text }
                  ]}>
                    {item.label}
                  </Text>
                  {item.value && (
                    <Text style={[styles.settingValue, { color: theme.colors.textMuted }]}>
                      {item.value}
                    </Text>
                  )}
                  <Ionicons name="chevron-back" size={18} color={theme.colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
  group: { marginBottom: 24 },
  groupTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  groupCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
  },
  settingValue: {
    fontSize: 14,
    marginRight: 8,
  },
});
