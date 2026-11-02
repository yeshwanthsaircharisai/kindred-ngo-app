import React, { useState } from 'react';
import { StyleSheet, View, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { borderRadius, layout, spacing } from '@/constants/spacing';
import { AppScreen, AppText, AppButton, AppInput, AppCheckbox } from '@/components/ui';

export default function SignupScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const nameTrimmed = fullName.trim();
    const emailTrimmed = email.trim();

    if (!nameTrimmed) {
      newErrors.fullName = 'Full name is required';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
  console.log('Create Account button pressed');
  if (validate()) {
    Alert.alert(
      'Registration',
      'Registration UI is working. Account creation will be available after Supabase integration.',
      [{ text: 'OK' }]
    );
  } else {
    console.log('Validation failed', errors);
  }
}

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
            <View style={styles.logoBadge}>
              <AppText variant="largeHeading" color={colors.white} weight="700">
                K
              </AppText>
            </View>
            <AppText variant="screenTitle" color={colors.primaryText} weight="700" style={styles.heading}>
              Create Account
            </AppText>
            <AppText variant="secondary" color={colors.secondaryText}>
              Join Kindred and connect with a community that cares
            </AppText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <AppInput
              label="Full Name"
              placeholder="e.g. Sarah Jenkins"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
              }}
              error={errors.fullName}
              autoCapitalize="words"
            />

            <AppInput
              label="Email Address"
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
              placeholder="At least 6 characters"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              error={errors.password}
              secureTextEntry
              showPasswordToggle
            />

            <AppInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              error={errors.confirmPassword}
              secureTextEntry
              showPasswordToggle
            />

            {/* Terms checkbox */}
            <AppCheckbox
              checked={agreeTerms}
              onToggle={(checked) => {
                setAgreeTerms(checked);
                if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: null }));
              }}
              label={
                <AppText variant="secondary" color={colors.primaryText}>
                  I agree to the{' '}
                  <AppText variant="secondary" color={colors.primaryGreen} weight="600">
                    Terms & Conditions
                  </AppText>
                </AppText>
              }
              error={errors.agreeTerms}
              style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}
            />

            {/* Create Account button */}
            <AppButton
              title="Create Account"
              variant="primary"
              size="lg"
              onPress={handleSignup}
              fullWidth
              style={styles.submitButton}
            />

            {/* Switch to Login */}
            <View style={styles.footerRow}>
              <AppText variant="secondary" color={colors.secondaryText}>
                Already have an account?{' '}
              </AppText>
              <Pressable
                onPress={() => router.push('/login')}
                hitSlop={6}
                accessibilityRole="button"
              >
                <AppText variant="secondary" color={colors.primaryGreen} weight="700">
                  Log In
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
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
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
  submitButton: {
    marginBottom: spacing.xl,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
});

