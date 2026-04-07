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

import { APP_COLORS } from '@/constants/app-colors';
import { BottomNavbar } from '@/components/bottom-navbar';
import { signInStyles as styles } from '@/styles/sign-in.styles';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignIn = () => {
    const trimmedEmail = email.trim();
    const newErrors: Record<string, string> = {};

    if (!trimmedEmail) {
      newErrors.email = 'الرجاء إدخال البريد الإلكتروني.';
    } else if (!isValidEmail(trimmedEmail)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح.';
    }
    if (!password) {
      newErrors.password = 'الرجاء إدخال كلمة المرور.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // TODO: استدعاء واجهة تسجيل الدخول ثم الانتقال للشاشة التالية
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
        <Pressable style={styles.viewChatButton}>
          <Text style={styles.viewChatText}>View chat</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to your dashboard</Text>

          <View style={styles.form}>
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

            <View style={styles.optionsRow}>
              <Pressable
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberRow}
                hitSlop={8}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={14} color={C.text} />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </Pressable>
              <Pressable hitSlop={8}>
                <Text style={styles.forgotLink}>Forgot Password?</Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Link href="/create-account" asChild>
              <Pressable>
                <Text style={styles.createAccountLink}>Create Account</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNavbar activeTab="home" />
    </View>
  );
}
