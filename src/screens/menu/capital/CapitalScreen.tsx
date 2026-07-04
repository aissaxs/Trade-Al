import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MenuDrawerParamList } from '../../../types/navigation.types';
import { COLORS } from '../../../utils/constants';
import { useTheme } from '../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface Calculator {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  color: string;
}

const calculators: Calculator[] = [
  {
    id: 'lot',
    title: 'حساب حجم اللوت',
    icon: 'calculator',
    description: 'احسب حجم اللوت المناسب لرأس مالك',
    color: '#00C853',
  },
  {
    id: 'risk',
    title: 'حساب نسبة المخاطرة',
    icon: 'shield-checkmark',
    description: 'حدد نسبة المخاطرة المقبولة',
    color: '#FFD600',
  },
  {
    id: 'stoploss',
    title: 'وقف الخسارة',
    icon: 'stop-circle',
    description: 'احسب مستوى وقف الخسارة',
    color: '#FF1744',
  },
  {
    id: 'profit',
    title: 'متابعة الأرباح',
    icon: 'trending-up',
    description: 'تتبع أرباحك وخسائرك',
    color: '#00B0FF',
  },
];

export default function CapitalScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MenuDrawerParamList>>();
  const { theme } = useTheme();
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  // Lot Calculator State
  const [accountBalance, setAccountBalance] = useState('');
  const [riskPercent, setRiskPercent] = useState('');
  const [stopLossPips, setStopLossPips] = useState('');
  const [lotSize, setLotSize] = useState<string | null>(null);

  const calculateLot = () => {
    const balance = parseFloat(accountBalance);
    const risk = parseFloat(riskPercent);
    const pips = parseFloat(stopLossPips);

    if (balance && risk && pips) {
      const riskAmount = balance * (risk / 100);
      const pipValue = 10; // Standard pip value for most pairs
      const lots = riskAmount / (pips * pipValue);
      setLotSize(lots.toFixed(2));
    }
  };

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'lot':
        return (
          <View style={[styles.calcContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.calcTitle, { color: theme.colors.text }]}>حساب حجم اللوت</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>رأس المال ($)</Text>
              <TextInput
                style={[styles.calcInput, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                placeholder="10000"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="decimal-pad"
                value={accountBalance}
                onChangeText={setAccountBalance}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>نسبة المخاطرة (%)</Text>
              <TextInput
                style={[styles.calcInput, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                placeholder="2"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="decimal-pad"
                value={riskPercent}
                onChangeText={setRiskPercent}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>وقف الخسارة (pips)</Text>
              <TextInput
                style={[styles.calcInput, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                placeholder="50"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="decimal-pad"
                value={stopLossPips}
                onChangeText={setStopLossPips}
              />
            </View>

            <TouchableOpacity
              style={[styles.calcButton, { backgroundColor: COLORS.primary }]}
              onPress={calculateLot}
            >
              <Text style={styles.calcButtonText}>احسب</Text>
            </TouchableOpacity>

            {lotSize && (
              <View style={[styles.resultBox, { backgroundColor: COLORS.primary + '15' }]}>
                <Text style={[styles.resultLabel, { color: theme.colors.textSecondary }]}>حجم اللوت الموصى به</Text>
                <Text style={[styles.resultValue, { color: COLORS.primary }]}>{lotSize}</Text>
              </View>
            )}
          </View>
        );

      default:
        return (
          <View style={styles.calculatorsGrid}>
            {calculators.map((calc) => (
              <TouchableOpacity
                key={calc.id}
                style={[styles.calculatorCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => setActiveCalculator(calc.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.calcIconContainer, { backgroundColor: calc.color + '20' }]}>
                  <Ionicons name={calc.icon} size={28} color={calc.color} />
                </View>
                <Text style={[styles.calcCardTitle, { color: theme.colors.text }]}>{calc.title}</Text>
                <Text style={[styles.calcCardDesc, { color: theme.colors.textSecondary }]}>
                  {calc.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => activeCalculator ? setActiveCalculator(null) : navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {activeCalculator ? 'حاسبة التداول' : 'إدارة رأس المال'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!activeCalculator && (
          <Text style={[styles.sectionDescription, { color: theme.colors.textSecondary }]}>
            أدوات لحساب حجم الصفقات وإدارة المخاطر بذكاء
          </Text>
        )}
        {renderCalculator()}
      </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  calculatorsGrid: {
    gap: 12,
  },
  calculatorCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  calcIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  calcCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  calcCardDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  calcContainer: {
    padding: 20,
    borderRadius: 12,
  },
  calcTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  calcInput: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlign: 'right',
  },
  calcButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  calcButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultBox: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
