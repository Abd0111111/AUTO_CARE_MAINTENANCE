import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BASE_URL } from '@/constants/api';

const COLORS = {
  background: '#09182d',
  surface: '#13243a',
  border: 'rgba(255,255,255,0.08)',
  text: '#f8fafc',
  muted: '#b8c3d6',
  primary: '#3268f7',
  error: '#ef4444',
};

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string; otp?: string }>();
  const email = String(params.email ?? '');
  const otp = String(params.otp ?? '');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleResetPassword = async () => {
  const newErrors: Record<string, string> = {};

  if (!email || !otp) {
    newErrors.password = 'بيانات التحقق ناقصة. ارجع واطلب OTP مرة أخرى.';
  }

  if (!password) {
    newErrors.password = 'الرجاء إدخال كلمة المرور الجديدة.';
  } else if (password.length < 6) {
    newErrors.password = 'كلمة المرور يجب ألا تقل عن 6 حروف.';
  }

  if (!confirmPassword) {
    newErrors.confirmPassword = 'الرجاء تأكيد كلمة المرور.';
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين.';
  }

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    setIsSubmitting(true);

    const res = await fetch(`${BASE_URL}/auth/reset-forgot-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp,
        password,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.log('RESET PASSWORD ERROR:', data);

      const message =
        data?.message ||
        'رمز التحقق غير صحيح أو انتهت صلاحيته.';

      setErrors({ password: message });
      return;
    }

    console.log('RESET SUCCESS:', data);

    Alert.alert('Done', 'تم تغيير كلمة المرور بنجاح.');

    router.replace('/sign-in');

  } catch (err) {
    console.log('RESET PASSWORD ERROR:', err);
    setErrors({ password: 'حدث خطأ في الاتصال بالسيرفر.' });
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Write a new password for {email}</Text>

          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="••••••••"
            placeholderTextColor={COLORS.muted}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError('password');
            }}
            secureTextEntry
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="••••••••"
            placeholderTextColor={COLORS.muted}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearError('confirmPassword');
            }}
            secureTextEntry
          />
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          <Pressable style={styles.button} onPress={handleResetPassword} disabled={isSubmitting}>
            <Text style={styles.buttonText}>{isSubmitting ? 'Saving...' : 'Save New Password'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 22 },
  header: { height: 58, justifyContent: 'center' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  keyboardView: { flex: 1 },
  content: { paddingTop: 32, paddingBottom: 40 },
  title: { color: COLORS.text, fontSize: 30, fontWeight: '800' },
  subtitle: { color: COLORS.muted, marginTop: 10, marginBottom: 32, fontSize: 15, lineHeight: 22 },
  label: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginTop: 16, marginBottom: 10 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: COLORS.text,
    fontSize: 15,
  },
  inputError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, marginTop: 10, fontSize: 14 },
  button: {
    backgroundColor: COLORS.primary,
    marginTop: 30,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: COLORS.text, fontSize: 16, fontWeight: '800' },
});
