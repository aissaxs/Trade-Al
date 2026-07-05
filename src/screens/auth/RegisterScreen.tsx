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
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

type RegisterNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  country: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  age?: string;
  gender?: string;
  country?: string;
}

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNavigationProp>();
  const { theme } = useTheme();
  const { register } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    country: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.username) newErrors.username = 'اسم المستخدم مطلوب';
    if (!formData.firstName) newErrors.firstName = 'الاسم مطلوب';
    if (!formData.lastName) newErrors.lastName = 'اللقب مطلوب';
    if (!formData.age) {
      newErrors.age = 'العمر مطلوب';
    } else if (parseInt(formData.age) < 18) {
      newErrors.age = 'يجب أن يكون العمر 18 أو أكثر';
    }
    if (!formData.gender) newErrors.gender = 'الجنس مطلوب';
    if (!formData.country) newErrors.country = 'البلد مطلوب';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleRegister = async () => {
    if (!validateStep2()) return;
    
    setLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: parseInt(formData.age),
        gender: formData.gender,
        country: formData.country,
      });
      
      Alert.alert(
        'تم إنشاء الحساب',
        'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
        [
          {
            text: 'موافق',
            onPress: () => navigation.navigate('OTP', { email: formData.email }),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'خطأ',
        error.message || 'حدث خطأ أثناء إنشاء الحساب'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        معلومات الحساب
      </Text>
      
      {/* Email */}
      <View style={styles.inputWrapper}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          البريد الإلكتروني
        </Text>
        <View style={[
          styles.inputContainer,
          { 
            backgroundColor: theme.colors.surface,
            borderColor: errors.email ? COLORS.danger : theme.colors.border,
          },
        ]}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.textMuted} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="example@email.com"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          كلمة المرور
        </Text>
        <View style={[
          styles.inputContainer,
          { 
            backgroundColor: theme.colors.surface,
            borderColor: errors.password ? COLORS.danger : theme.colors.border,
          },
        ]}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textMuted} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      {/* Confirm Password */}
      <View style={styles.inputWrapper}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          تأكيد كلمة المرور
        </Text>
        <View style={[
          styles.inputContainer,
          { 
            backgroundColor: theme.colors.surface,
            borderColor: errors.confirmPassword ? COLORS.danger : theme.colors.border,
          },
        ]}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textMuted} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry={!showConfirmPassword}
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: COLORS.primary }]}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.nextButtonText}>التالي</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
        المعلومات الشخصية
      </Text>

      {/* Username */}
      <View style={styles.inputWrapper}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>اسم المستخدم</Text>
        <View style={[
          styles.inputContainer,
          { 
            backgroundColor: theme.colors.surface,
            borderColor: errors.username ? COLORS.danger : theme.colors.border,
          },
        ]}>
          <Ionicons name="person-outline" size={20} color={theme.colors.textMuted} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="اسم المستخدم"
            placeholderTextColor={theme.colors.textMuted}
            value={formData.username}
            onChangeText={(text) => updateField('username', text)}
          />
        </View>
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
      </View>

      {/* First Name & Last Name */}
      <View style={styles.rowContainer}>
        <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>اللقب</Text>
          <View style={[
            styles.inputContainer,
            { 
              backgroundColor: theme.colors.surface,
              borderColor: errors.lastName ? COLORS.danger : theme.colors.border,
            },
          ]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="اللقب"
              placeholderTextColor={theme.colors.textMuted}
              value={formData.lastName}
              onChangeText={(text) => updateField('lastName', text)}
            />
          </View>
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
        </View>

        <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>الاسم</Text>
          <View style={[
            styles.inputContainer,
            { 
              backgroundColor: theme.colors.surface,
              borderColor: errors.firstName ? COLORS.danger : theme.colors.border,
            },
          ]}>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="الاسم"
              placeholderTextColor={theme.colors.textMuted}
              value={formData.firstName}
              onChangeText={(text) => updateField('firstName', text)}
            />
          </View>
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
        </View>
      </View>

      {/* Age */}
      <View style={styles.inputWrapper}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>العمر</Text>
        <View style={[
          styles.inputContainer,
          { 
            backgroundColor: theme.colors.surface,
            borderColor: errors.age ? COLORS.danger : theme.colors.border,
          },
        ]}>
          <Ionicons name="calendar-outline" size={20} color={theme.colors.textMuted} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="18"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="number-pad"
            value={formData.age}
            onChangeText={(text) => updateField('age', text)}
          />
        </View>
        {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
      </View>

      {/* Gender */}
      <View style={styles.inputWrapper}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>الجنس</Text>
        <View style={styles.genderContainer}>
          {['ذكر', 'أنثى'].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderButton,
                {
                  backgroundColor: formData.gender === gender ? COLORS.primary : theme.colors.surface,
                  borderColor: formData.gender === gender ? COLORS.primary : theme.colors.border,
                },
              ]}
              onPress={() => updateField('gender', gender)}
            >
              <Text style={[
                styles.genderText,
                { color: formData.gender === gender ? '#FFFFFF' : theme.colors.text },
              ]}>
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
      </View>

      {/* Country */}
      <View style={styles.inputWrapper}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>البلد</Text>
        <View style={[
          styles.inputContainer,
          { 
            backgroundColor: theme.colors.surface,
            borderColor: errors.country ? COLORS.danger : theme.colors.border,
          },
        ]}>
          <Ionicons name="globe-outline" size={20} color={theme.colors.textMuted} />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="الجزائر"
            placeholderTextColor={theme.colors.textMuted}
            value={formData.country}
            onChangeText={(text) => updateField('country', text)}
          />
        </View>
        {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.backButton, { borderColor: theme.colors.border }]}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text style={[styles.backButtonText, { color: theme.colors.text }]}>رجوع</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.registerButton,
            { backgroundColor: COLORS.primary },
            loading && { opacity: 0.7 },
          ]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.registerButtonText}>إنشاء الحساب</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

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
            إنشاء حساب جديد
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={[
            styles.progressBar,
            { 
              backgroundColor: currentStep === 1 ? COLORS.primary : COLORS.primary + '40',
              flex: currentStep === 1 ? 2 : 1,
            },
          ]} />
          <View style={[
            styles.progressBar,
            { 
              backgroundColor: currentStep === 2 ? COLORS.primary : theme.colors.border,
              flex: currentStep === 2 ? 2 : 1,
            },
          ]} />
        </View>

        {/* Form */}
        {currentStep === 1 ? renderStep1() : renderStep2()}

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
            لديك حساب بالفعل؟
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: COLORS.primary }]}>
              تسجيل الدخول
            </Text>
          </TouchableOpacity>
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
    marginBottom: 24,
    marginTop: 20,
  },
  backIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    marginBottom: 32,
    gap: 8,
  },
  progressBar: {
    borderRadius: 2,
    transition: 'all 0.3s',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 16,
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
  rowContainer: {
    flexDirection: 'row',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  nextButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  backButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    flex: 2,
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
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
