import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuDrawerParamList } from '../../types/navigation.types';
import { COLORS, PLAN_PRICES } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';
import { useSubscription } from '../../hooks/useSubscription';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function PlusScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MenuDrawerParamList>>();
  const { theme } = useTheme();
  const { subscription } = useSubscription();

  const benefits = [
    { icon: 'images', text: 'صور غير محدودة للتحليل' },
    { icon: 'chatbubbles', text: 'دردشة غير محدودة مع AI' },
    { icon: 'notifications', text: 'تنبيهات فورية للسوق' },
    { icon: 'time', text: 'تحليل سوق 24/24' },
    { icon: 'save', text: 'حفظ محادثات غير محدود' },
    { icon: 'analytics', text: 'تحليل دقيق وتوصيات' },
  ];

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    // TODO: Integrate with payment gateway
    console.log('Subscribe to:', plan);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Trade AI Plus</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.heroContainer}>
          <View style={[styles.heroIcon, { backgroundColor: '#FFD70020' }]}>
            <Ionicons name="diamond" size={48} color="#FFD700" />
          </View>
          <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
            ارفع مستوى تداولك
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.colors.textSecondary }]}>
            احصل على ميزات احترافية لتداول أكثر ذكاءً
          </Text>
        </View>

        {/* Benefits */}
        <View style={[styles.benefitsCard, { backgroundColor: theme.colors.surface }]}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: COLORS.primary + '15' }]}>
                <Ionicons name={benefit.icon as any} size={20} color={COLORS.primary} />
              </View>
              <Text style={[styles.benefitText, { color: theme.colors.text }]}>
                {benefit.text}
              </Text>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            </View>
          ))}
        </View>

        {/* Plans */}
        <Text style={[styles.plansTitle, { color: theme.colors.text }]}>اختر خطتك</Text>

        {/* Monthly */}
        <TouchableOpacity
          style={[styles.planCard, { backgroundColor: theme.colors.surface }]}
          onPress={() => handleSubscribe('monthly')}
          activeOpacity={0.8}
        >
          <View style={styles.planHeader}>
            <Text style={[styles.planName, { color: theme.colors.text }]}>شهري</Text>
            <View style={[styles.planBadge, { backgroundColor: COLORS.primary + '20' }]}>
              <Text style={[styles.planBadgeText, { color: COLORS.primary }]}>شائع</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: COLORS.primary }]}>${PLAN_PRICES.PLUS_MONTHLY}</Text>
            <Text style={[styles.period, { color: theme.colors.textSecondary }]}>/شهر</Text>
          </View>
          <Text style={[styles.planDesc, { color: theme.colors.textSecondary }]}>
            إلغاء في أي وقت
          </Text>
        </TouchableOpacity>

        {/* Yearly */}
        <TouchableOpacity
          style={[
            styles.planCard,
            {
              backgroundColor: '#FFD70010',
              borderColor: '#FFD70040',
              borderWidth: 2,
            },
          ]}
          onPress={() => handleSubscribe('yearly')}
          activeOpacity={0.8}
        >
          <View style={styles.planHeader}>
            <Text style={[styles.planName, { color: theme.colors.text }]}>سنوي</Text>
            <View style={[styles.planBadge, { backgroundColor: '#FFD70020' }]}>
              <Text style={[styles.planBadgeText, { color: '#FFD700' }]}>وفر 8%</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: '#FFD700' }]}>${PLAN_PRICES.PLUS_YEARLY}</Text>
            <Text style={[styles.period, { color: theme.colors.textSecondary }]}>/سنة</Text>
          </View>
          <Text style={[styles.planDesc, { color: theme.colors.textSecondary }]}>
            أفضل قيمة - وفر مقارنة بالشهري
          </Text>
        </TouchableOpacity>

        {/* Guarantee */}
        <Text style={[styles.guarantee, { color: theme.colors.textMuted }]}>
          ضمان استرداد الأموال خلال 7 أيام
        </Text>
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
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  heroContainer: { alignItems: 'center', marginVertical: 24 },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, textAlign: 'center' },
  benefitsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: { flex: 1, fontSize: 14 },
  plansTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  planCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: { fontSize: 18, fontWeight: 'bold' },
  planBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  planBadgeText: { fontSize: 12, fontWeight: 'bold' },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  price: { fontSize: 32, fontWeight: 'bold' },
  period: { fontSize: 16, marginLeft: 4 },
  planDesc: { fontSize: 13 },
  guarantee: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
  },
});
