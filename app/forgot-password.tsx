import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError('الرجاء إدخال البريد الإلكتروني.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('البريد الإلكتروني غير صحيح.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const res = await fetch(`${BASE_URL}/auth/send-forgot-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!res.ok) {
        setError('البريد الإلكتروني غير صحيح أو غير مسجل.');
        return;
      }

      router.push({
        pathname: '/verify-otp',
        params: { email: trimmedEmail, mode: 'forgot-password' },
      });
    } catch (err) {
      console.log('FORGOT PASSWORD ERROR:', err);
      setError('حدث خطأ في الاتصال بالسيرفر.');
    } finally {
      setIsSubmitting(false);
    }
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
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email and we will send you an OTP code.</Text>

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="john@example.com"
            placeholderTextColor={COLORS.muted}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable style={styles.button} onPress={handleSendOtp} disabled={isSubmitting}>
            <Text style={styles.buttonText}>{isSubmitting ? 'Sending...' : 'Send OTP'}</Text>
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
  label: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginBottom: 10 },
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
    marginTop: 28,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: COLORS.text, fontSize: 16, fontWeight: '800' },
});
