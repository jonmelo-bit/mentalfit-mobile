import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function SignInScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [showPassword, setShowPassword] = useState(false);

  const onSendMagicLink = async () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Enter your email first.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim() });
    setBusy(false);
    if (error) {
      Alert.alert('Could not send magic link', error.message);
    } else {
      Alert.alert('Magic link sent', 'Check your email for a magic link.');
    }
  };

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Enter both email and password.');
      return;
    }
    setBusy(true);
    const { error } =
      mode === 'signIn'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);
    setBusy(false);
    if (error) {
      Alert.alert(mode === 'signIn' ? 'Sign in failed' : 'Sign up failed', error.message);
    } else if (mode === 'signUp') {
      Alert.alert('Check your email', 'We sent you a confirmation link.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.body}>
          <Text style={styles.brand}>Forte</Text>
          <Text style={styles.title}>
            {mode === 'signIn' ? 'Sign in' : 'Create account'}
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="rgba(255,252,250,0.45)"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
          />
          <View style={styles.passwordWrap}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="rgba(255,252,250,0.45)"
              secureTextEntry={!showPassword}
              autoComplete="password"
              style={styles.passwordInput}
            />
            <Pressable
              onPress={() => setShowPassword((s) => !s)}
              hitSlop={8}
              style={styles.eyeButton}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff size={20} color="rgba(255,252,250,0.6)" />
              ) : (
                <Eye size={20} color="rgba(255,252,250,0.6)" />
              )}
            </Pressable>
          </View>

          <Pressable
            onPress={onSubmit}
            disabled={busy}
            style={[styles.primary, busy && { opacity: 0.7 }]}
          >
            {busy ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.primaryText}>
                {mode === 'signIn' ? 'Sign in' : 'Sign up'}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={onSendMagicLink}
            disabled={busy}
            style={[styles.secondary, busy && { opacity: 0.7 }]}
          >
            <Text style={styles.secondaryText}>Send magic link</Text>
          </Pressable>

          <Pressable
            onPress={() => setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'))}
            style={styles.linkWrap}
          >
            <Text style={styles.link}>
              {mode === 'signIn'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  body: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 12 },
  brand: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 28,
    textTransform: 'uppercase',
  },
  title: { color: colors.fg, fontSize: 28, fontWeight: '600', marginBottom: 16 },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.fg,
    fontSize: 16,
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    color: colors.fg,
    fontSize: 16,
  },
  eyeButton: {
    paddingLeft: 8,
    paddingVertical: 8,
  },
  primary: {
    backgroundColor: colors.gold,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryText: {
    color: colors.bg,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  secondary: {
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryText: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  linkWrap: { alignItems: 'center', marginTop: 16 },
  link: { color: 'rgba(255,252,250,0.7)', fontSize: 14 },
});
