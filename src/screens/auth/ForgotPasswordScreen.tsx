import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { COLORS } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email) {
      setError('البريد الإلكتروني مطلوب');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('البريد الإلكتروني غير صالح');
      return false;
    }
    setError('');
    return true;
  };

  const handleSendCode = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: Integrate with Supabase password reset
      // await supabase.auth.resetPasswordForEmail(email);
      
      setTimeout(() => {
        setSent(true);
        setLoading(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            استعادة كلمة المرور
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.primary + '20' }]}>
            <Ionicons name="key-outline" size={48} color={COLORS.primary} />
          </View>
        </View>

        {!sent ? (
          <>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق لإعادة تعيين كلمة المرور
            </Text>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                البريد الإلكتروني
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: error ? COLORS.danger : theme.colors.border,
                  },
                ]}
              >
                <Ionicons name="mail-outline" size={20} color={theme.colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="example@email.com"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            {/* Send Button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: COLORS.primary },
                loading && { opacity: 0.7 },
              ]}
              onPress={handleSendCode}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>إرسال رمز التحقق</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={[styles.successTitle, { color: theme.colors.text }]}>
              تم إرسال الرمز!
            </Text>
            <Text style={[styles.successDescription, { color: theme.colors.textSecondary }]}>
              لقد أرسلنا رمز التحقق إلى{'\n'}
              <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{email}</Text>
            </Text>

            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={64} color={COLORS.primary} />
            </View>

            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: COLORS.primary }]}
              onPress={handleBackToLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonText}>العودة لتسجيل الدخول</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    marginTop: 20,
  },
  backIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    textAlign: 'right',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  sendButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  successDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
