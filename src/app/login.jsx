import React, { useState } from 'react';
import { StyleSheet, View, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { borderRadius, layout, spacing } from '@/constants/spacing';
import { AppScreen, AppText, AppButton, AppInput, AppCheckbox } from '@/components/ui';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      router.replace('/main');
    }
  };

  return (
    <AppScreen safe padding={false} backgroundColor={colors.background}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header branding */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <AppText variant="largeHeading" color={colors.white} weight="700">
                K
              </AppText>
            </View>
            <AppText variant="screenTitle" color={colors.primaryText} weight="700" style={styles.heading}>
              Welcome back
            </AppText>
            <AppText variant="secondary" color={colors.secondaryText}>
              Log in to your Kindred community account
            </AppText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <AppInput
              label="Email address"
              placeholder="name@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              error={errors.password}
              secureTextEntry
              showPasswordToggle
            />

            {/* Remember me & Forgot Password */}
            <View style={styles.rowBetween}>
              <AppCheckbox
                checked={rememberMe}
                onToggle={setRememberMe}
                label="Remember me"
                style={{ marginBottom: 0 }}
              />

              <Pressable
                onPress={() => router.push('/forgot-password')}
                hitSlop={6}
                accessibilityRole="button"
              >
                <AppText variant="secondary" color={colors.primaryGreen} weight="600">
                  Forgot Password?
                </AppText>
              </Pressable>
            </View>

            {/* Login Button */}
            <AppButton
              title="Log In"
              variant="primary"
              size="lg"
              onPress={handleLogin}
              fullWidth
              style={styles.submitButton}
            />

            {/* Switch to Signup */}
            <View style={styles.footerRow}>
              <AppText variant="secondary" color={colors.secondaryText}>
                Don't have an account?{' '}
              </AppText>
              <Pressable
                onPress={() => router.push('/signup')}
                hitSlop={6}
                accessibilityRole="button"
              >
                <AppText variant="secondary" color={colors.primaryGreen} weight="700">
                  Sign Up
                </AppText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    elevation: 3,
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  heading: {
    marginBottom: spacing.xs,
  },
  form: {
    width: '100%',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.xs,
  },
  submitButton: {
    marginBottom: spacing.xl,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

