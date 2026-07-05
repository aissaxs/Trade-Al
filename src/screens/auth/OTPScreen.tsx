import React, { useState, useRef, useEffect } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { COLORS } from '../../utils/constants';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

type OTPNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'OTP'>;
type OTPRouteProp = RouteProp<AuthStackParamList, 'OTP'>;

export default function OTPScreen() {
  const navigation = useNavigation<OTPNavigationProp>();
  const route = useRoute<OTPRouteProp>();
  const { theme } = useTheme();
  const { login } = useAuth();

  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all digits entered
    if (index === 5 && text.length === 1) {
      const fullOtp = [...newOtp.slice(0, 5), text].join('');
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (fullOtp?: string) => {
    const code = fullOtp || otp.join('');
    
    if (code.length !== 6) {
      Alert.alert('خطأ', 'يرجى إدخال الرمز كاملاً');
      return;
    }

    setLoading(true);
    try {
      // TODO: Verify OTP with Supabase
      // const { data, error } = await supabase.auth.verifyOtp({
      //   email,
      //   token: code,
      //   type: 'signup',
      // });

      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'تم التحقق!',
        'تم تأكيد بريدك الإلكتروني بنجاح',
        [
          {
            text: 'تسجيل الدخول',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('خطأ', err.message || 'رمز التحقق غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    
    try {
      // TODO: Resend OTP via Supabase
      // await supabase.auth.resend({
      //   type: 'signup',
      //   email,
      // });
      
      Alert.alert('تم', 'تم إعادة إرسال رمز التحقق');
    } catch (err: any) {
      Alert.alert('خطأ', err.message || 'حدث خطأ أثناء إعادة الإرسال');
    }
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
            تأكيد البريد الإلكتروني
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: COLORS.primary + '20' }]}>
            <Ionicons name="mail-unread-outline" size={48} color={COLORS.primary} />
          </View>
        </View>

        {/* Description */}
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          أدخل رمز التحقق المكون من 6 أرقام الذي أرسلناه إلى
        </Text>
        <Text style={[styles.emailText, { color: COLORS.primary }]}>
          {email}
        </Text>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: digit ? COLORS.primary : theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            { backgroundColor: COLORS.primary },
            loading && { opacity: 0.7 },
          ]}
          onPress={() => handleVerify()}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>تأكيد</Text>
          )}
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text style={[styles.resendText, { color: theme.colors.textSecondary }]}>
            لم تستلم الرمز؟
          </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={[styles.resendLink, { color: COLORS.primary }]}>
                إعادة الإرسال
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.timerText, { color: theme.colors.textMuted }]}>
              إعادة الإرسال بعد {resendTimer} ثانية
            </Text>
          )}
        </View>
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
    lineHeight: 22,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  emailText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  verifyButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginHorizontal: 20,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  resendText: {
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 14,
  },
});
