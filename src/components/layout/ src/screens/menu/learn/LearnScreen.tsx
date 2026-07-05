import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuDrawerParamList } from '../../../types/navigation.types';
import { COLORS } from '../../../utils/constants';
import { useTheme } from '../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  hasQuiz: boolean;
}

const lessons: Lesson[] = [
  {
    id: '1',
    title: 'مقدمة في التداول',
    description: 'تعرف على أساسيات التداول والأسواق المالية',
    duration: '15 دقيقة',
    level: 'beginner',
    completed: false,
    hasQuiz: true,
  },
  {
    id: '2',
    title: 'الشموع اليابانية',
    description: 'فهم أنماط الشموع وقراءة الرسوم البيانية',
    duration: '25 دقيقة',
    level: 'beginner',
    completed: false,
    hasQuiz: true,
  },
  {
    id: '3',
    title: 'إدارة المخاطر',
    description: 'كيف تحمي رأس مالك وتقلل الخسائر',
    duration: '20 دقيقة',
    level: 'intermediate',
    completed: false,
    hasQuiz: true,
  },
  {
    id: '4',
    title: 'التحليل الفني المتقدم',
    description: 'مؤشرات فنية واستراتيجيات تداول',
    duration: '35 دقيقة',
    level: 'advanced',
    completed: false,
    hasQuiz: true,
  },
  {
    id: '5',
    title: 'استراتيجيات التداول',
    description: 'بناء استراتيجية تداول ناجحة',
    duration: '30 دقيقة',
    level: 'advanced',
    completed: false,
    hasQuiz: true,
  },
];

const levelColors = {
  beginner: '#00C853',
  intermediate: '#FFD600',
  advanced: '#FF1744',
};

const levelLabels = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم',
};

export default function LearnScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MenuDrawerParamList>>();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'lessons' | 'chat' | 'saved'>('lessons');

  const renderLesson = ({ item }: { item: Lesson }) => (
    <TouchableOpacity
      style={[styles.lessonCard, { backgroundColor: theme.colors.surface }]}
      activeOpacity={0.8}
    >
      <View style={styles.lessonHeader}>
        <View style={[styles.levelBadge, { backgroundColor: levelColors[item.level] + '20' }]}>
          <Text style={[styles.levelText, { color: levelColors[item.level] }]}>
            {levelLabels[item.level]}
          </Text>
        </View>
        {item.completed && (
          <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
        )}
      </View>

      <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>
        {item.title}
      </Text>
      <Text style={[styles.lessonDescription, { color: theme.colors.textSecondary }]}>
        {item.description}
      </Text>

      <View style={styles.lessonFooter}>
        <View style={styles.durationContainer}>
          <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
          <Text style={[styles.durationText, { color: theme.colors.textMuted }]}>
            {item.duration}
          </Text>
        </View>
        {item.hasQuiz && (
          <View style={[styles.quizBadge, { backgroundColor: COLORS.primary + '20' }]}>
            <Text style={[styles.quizText, { color: COLORS.primary }]}>اختبار</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>تعلم التداول</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { key: 'lessons' as const, label: 'الدروس', icon: 'book-outline' },
          { key: 'chat' as const, label: 'AI مساعد', icon: 'chatbubble-outline' },
          { key: 'saved' as const, label: 'المحفوظات', icon: 'bookmark-outline' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && { backgroundColor: COLORS.primary + '20' },
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={activeTab === tab.key ? COLORS.primary : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.key ? COLORS.primary : theme.colors.textMuted },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'lessons' && (
        <FlatList
          data={lessons}
          renderItem={renderLesson}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lessonsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'chat' && (
        <View style={styles.chatPlaceholder}>
          <Ionicons name="chatbubble-ellipses" size={64} color={COLORS.primary + '40'} />
          <Text style={[styles.chatText, { color: theme.colors.textSecondary }]}>
            اسأل AI عن أي موضوع في التداول
          </Text>
        </View>
      )}

      {activeTab === 'saved' && (
        <View style={styles.savedPlaceholder}>
          <Ionicons name="bookmark" size={64} color={theme.colors.textMuted + '40'} />
          <Text style={[styles.savedText, { color: theme.colors.textSecondary }]}>
            لا توجد محادثات محفوظة
          </Text>
        </View>
      )}
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  lessonsList: {
    padding: 16,
    paddingBottom: 100,
  },
  lessonCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  lessonDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
  },
  quizBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quizText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  chatPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatText: {
    marginTop: 16,
    fontSize: 14,
  },
  savedPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedText: {
    marginTop: 16,
    fontSize: 14,
  },
});
