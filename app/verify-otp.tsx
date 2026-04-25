import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
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

function getCredentials(data: any) {
  return data?.data?.credentials ?? data?.credentials ?? data?.data ?? data;
}

export default function VerifyOtpScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string; mode?: string }>();
  const email = String(params.email ?? '');
  const mode = String(params.mode ?? 'confirm-email');
  const isForgotPassword = mode === 'forgot-password';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) text = text[0];
    setError('');
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputs.current[index + 1]?.focus();
    if (!text && index > 0) inputs.current[index - 1]?.focus();
  };

  const verifyConfirmEmailOtp = async (otpCode: string) => {
    const res = await fetch(`${BASE_URL}/auth/confirm-Email`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: otpCode }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError('رمز التحقق غير صحيح.');
      Alert.alert('Error', 'رمز التحقق غير صحيح.');
      return;
    }

    const credentials = getCredentials(data);
    const accessToken = credentials?.access_token;
    const refreshToken = credentials?.refresh_token;

    if (!accessToken) {
      setError('تم تأكيد الحساب لكن لم يتم استلام التوكن من السيرفر.');
      return;
    }

    await AsyncStorage.setItem('access_token', accessToken);
    if (refreshToken) await AsyncStorage.setItem('refresh_token', refreshToken);

    router.replace('/vehicle-setup');
  };

  const verifyForgotPasswordOtp = async (otpCode: string) => {
    const res = await fetch(`${BASE_URL}/auth/verify-forgot-password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: otpCode }),
    });

    if (!res.ok) {
      setError('رمز التحقق غير صحيح.');
      Alert.alert('Error', 'رمز التحقق غير صحيح.');
      return;
    }

    router.replace({
      pathname: '/reset-password',
      params: { email, otp: otpCode },
    });
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (!email) {
      setError('البريد الإلكتروني غير موجود. ارجع واكتب الإيميل مرة أخرى.');
      return;
    }

    if (otpCode.length !== 6) {
      setError('اكتب رمز التحقق المكون من 6 أرقام.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isForgotPassword) {
        await verifyForgotPasswordOtp(otpCode);
      } else {
        await verifyConfirmEmailOtp(otpCode);
      }
    } catch (err) {
      console.log('OTP ERROR:', err);
      setError('حدث خطأ في الاتصال بالسيرفر.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>      
      <Text style={styles.title}>{isForgotPassword ? 'Reset Password OTP' : 'Verify OTP'}</Text>

      <Text style={styles.subtitle}>Enter the 6-digit code sent to {email}</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.box, error && styles.boxError]}
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleVerify} disabled={isSubmitting}>
        <Text style={styles.buttonText}>{isSubmitting ? 'Verifying...' : 'Verify'}</Text>
      </Pressable>

      {isForgotPassword ? (
        <Pressable style={styles.backButton} onPress={() => router.replace('/forgot-password')}>
          <Text style={styles.backButtonText}>Change Email</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 22 },
  title: { color: COLORS.text, fontSize: 28, fontWeight: '800', marginTop: 30 },
  subtitle: { color: COLORS.muted, marginTop: 10, marginBottom: 30, fontSize: 15 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  box: {
    width: 48,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
  boxError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, marginTop: 14, fontSize: 14 },
  button: {
    backgroundColor: COLORS.primary,
    marginTop: 30,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: COLORS.text, fontSize: 16, fontWeight: '800' },
  backButton: { alignItems: 'center', marginTop: 18 },
  backButtonText: { color: COLORS.muted, fontSize: 15, fontWeight: '700' },
});
