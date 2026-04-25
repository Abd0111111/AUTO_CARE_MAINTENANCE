import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_COLORS } from '@/constants/app-colors';
import { BottomNavbar } from '@/components/bottom-navbar';
import { useUserProfile } from '@/context/user-profile-context';
import { createAccountStyles as styles } from '@/styles/create-account.styles';
import { BASE_URL } from '@/constants/api';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function CreateAccountScreen() {
  const insets = useSafeAreaInsets();
  const { updateProfile } = useUserProfile();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinueToVehicleSetup = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const newErrors: Record<string, string> = {};

    if (!trimmedName) newErrors.fullName = 'الرجاء إدخال الاسم الكامل.';
    if (!trimmedEmail) {
      newErrors.email = 'الرجاء إدخال البريد الإلكتروني.';
    } else if (!isValidEmail(trimmedEmail)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح.';
    }
    if (!trimmedPhone) newErrors.phone = 'الرجاء إدخال رقم الهاتف.';
    if (!password) newErrors.password = 'الرجاء إدخال كلمة المرور.';
    if (!confirmPassword) newErrors.confirmPassword = 'الرجاء تأكيد كلمة المرور.';
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsSubmitting(true);

      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          password,
          confirmPassword,
          drivingExperience: 0,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = Array.isArray(data.message) ? data.message.join('\n') : data.message;
        setErrors({ email: message || 'فشل إنشاء الحساب.' });
        return;
      }

const userProfile = {
  fullName: trimmedName,
  email: trimmedEmail,
  phone: trimmedPhone,
  drivingExperience: null,
};

updateProfile(userProfile);

await AsyncStorage.setItem('user_profile', JSON.stringify(userProfile));
await AsyncStorage.setItem('needs_vehicle_setup', 'true');

router.push({
  pathname: '/verify-otp',
  params: { email: trimmedEmail },
});


    } catch (err) {
      console.log('SIGNUP ERROR:', err);
      setErrors({ email: 'حدث خطأ في الاتصال بالسيرفر.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const C = APP_COLORS;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>B</Text>
            </View>
            <Text style={styles.logoAi}>AI</Text>
          </View>
          <Text style={styles.appTitle} numberOfLines={1}>
            Smart Car AI Assistant App
          </Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Let&apos;s get to know you better</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              placeholder="John Smith"
              placeholderTextColor={C.textMuted}
              value={fullName}
              onChangeText={(t) => { setFullName(t); clearError('fullName'); }}
              onFocus={() => clearError('fullName')}
              autoCapitalize="words"
            />
            {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="john@example.com"
              placeholderTextColor={C.textMuted}
              value={email}
              onChangeText={(t) => { setEmail(t); clearError('email'); }}
              onFocus={() => clearError('email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="01012345678"
              placeholderTextColor={C.textMuted}
              value={phone}
              onChangeText={(t) => { setPhone(t); clearError('phone'); }}
              onFocus={() => clearError('phone')}
              keyboardType="phone-pad"
            />
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="••••••••"
              placeholderTextColor={C.textMuted}
              value={password}
              onChangeText={(t) => { setPassword(t); clearError('password'); }}
              onFocus={() => clearError('password')}
              secureTextEntry
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="••••••••"
              placeholderTextColor={C.textMuted}
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); clearError('confirmPassword'); }}
              onFocus={() => clearError('confirmPassword')}
              secureTextEntry
            />
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          </View>

          <Pressable
            style={styles.continueButton}
            onPress={handleContinueToVehicleSetup}
            disabled={isSubmitting}>
            <Text style={styles.continueText}>{isSubmitting ? 'Creating Account...' : 'Continue to Verify OTP'}</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/sign-in" asChild>
              <Pressable>
                <Text style={styles.signInLink}>Sign In</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNavbar activeTab="home" />
    </View>
  );
}
