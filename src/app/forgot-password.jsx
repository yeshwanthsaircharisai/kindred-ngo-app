import React, { useState } from 'react';
import { StyleSheet, View, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { borderRadius, layout, spacing } from '@/constants/spacing';
import { AppScreen, AppText, AppButton, AppInput } from '@/components/ui';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const validate = () => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setError('Email address is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSendReset = () => {
    if (validate()) {
      // Backend not connected yet - validation check only
      // Do not send real email or show fake email sent message per specification
    }
  };

  const handleBackToLogin = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <AppText style={styles.keyEmoji}>🔑</AppText>
            </View>
            <AppText variant="screenTitle" color={colors.primaryText} weight="700" style={styles.heading}>
              Forgot Password
            </AppText>
            <AppText variant="secondary" color={colors.secondaryText} align="center" style={styles.subheading}>
              Enter your registered email address and we'll send you instructions to reset your password.
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
                if (error) setError(null);
              }}
              error={error}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppButton
              title="Send Reset Link"
              variant="primary"
              size="lg"
              onPress={handleSendReset}
              fullWidth
              style={styles.submitButton}
            />

            <Pressable
              onPress={handleBackToLogin}
              style={styles.backButton}
              hitSlop={8}
              accessibilityRole="button"
            >
              <AppText variant="body" color={colors.primaryGreen} weight="600" align="center">
                Back to Login
              </AppText>
            </Pressable>
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
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.secondaryMint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#D6EFE3',
  },
  keyEmoji: {
    fontSize: 30,
  },
  heading: {
    marginBottom: spacing.sm,
  },
  subheading: {
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
});

