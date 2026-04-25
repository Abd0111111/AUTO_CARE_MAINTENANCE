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

  // =========================
  // ✅ CONFIRM EMAIL
  // =========================
  const verifyConfirmEmailOtp = async (otpCode: string) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/confirm-Email`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpCode,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.log('CONFIRM EMAIL ERROR:', data);
        const message =
          Array.isArray(data.message)
            ? data.message.join('\n')
            : data.message;

        setError(message || 'رمز التحقق غير صحيح.');
        Alert.alert('Error', message || 'رمز التحقق غير صحيح.');
        return;
      }

  
      const accessToken =
        data?.data?.credentials?.access_token ||
        data?.credentials?.access_token ||
        data?.access_token;

      const refreshToken =
        data?.data?.credentials?.refresh_token ||
        data?.credentials?.refresh_token ||
        data?.refresh_token;


await AsyncStorage.setItem('needs_vehicle_setup', 'true');

if (!accessToken) {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('refresh_token');

  Alert.alert('Success', 'تم تأكيد الحساب. سجل دخولك الآن.');
  router.replace('/sign-in');
  return;
}

await AsyncStorage.setItem('access_token', accessToken);

if (refreshToken) {
  await AsyncStorage.setItem('refresh_token', refreshToken);
}

router.replace('/vehicle-setup');

    } catch (err) {
      console.log('CONFIRM EMAIL ERROR:', err);
      setError('حدث خطأ في الاتصال بالسيرفر.');
    }
  };

  // =========================
  // ✅ FORGOT PASSWORD OTP
  // =========================
  const verifyForgotPasswordOtp = async (otpCode: string) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/verify-forgot-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpCode,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.log('FORGOT PASSWORD ERROR:', data);
        const message =
          Array.isArray(data.message)
            ? data.message.join('\n')
            : data.message;

        setError(message || 'رمز التحقق غير صحيح.');
        Alert.alert('Error', message || 'رمز التحقق غير صحيح.');
        return;
      }

      // ✅ يروح reset password
      router.replace({
        pathname: '/reset-password',
        params: {
          email,
          otp: otpCode,
        },
      });

    } catch (err) {
      console.log('FORGOT PASSWORD ERROR:', err);
      setError('حدث خطأ في الاتصال بالسيرفر.');
    }
  };

  // =========================
  // ✅ HANDLE VERIFY
  // =========================
  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (!email) {
      setError('البريد الإلكتروني غير موجود.');
      return;
    }

    if (otpCode.length !== 6) {
      setError('اكتب رمز مكون من 6 أرقام.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isForgotPassword) {
        await verifyForgotPasswordOtp(otpCode);
      } else {
        await verifyConfirmEmailOtp(otpCode);
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>
        {isForgotPassword ? 'Reset Password OTP' : 'Verify OTP'}
      </Text>

      <Text style={styles.subtitle}>
        Enter the code sent to {email}
      </Text>

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

      <Pressable style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Verifying...' : 'Verify'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 22 },
  title: { color: COLORS.text, fontSize: 28, fontWeight: '800', marginTop: 30 },
  subtitle: { color: COLORS.muted, marginTop: 10, marginBottom: 30 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between' },
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
  },
  boxError: { borderColor: COLORS.error },
  errorText: { color: COLORS.error, marginTop: 14 },
  button: {
    backgroundColor: COLORS.primary,
    marginTop: 30,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: COLORS.text, fontSize: 16, fontWeight: '800' },
});