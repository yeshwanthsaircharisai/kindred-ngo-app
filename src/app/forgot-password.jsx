
import { AppButton, AppInput, AppScreen, AppText } from '@/components/ui';
import colors from '@/constants/colors';
import { layout, spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSendReset = async () => {
    if (submitting || !validate()) return;

    setSubmitting(true);

    try {
      await resetPassword(email.trim());

      Alert.alert(
        'Reset Request Submitted',
        'If your account is registered, you should receive password-reset instructions by email. The password-reset link and recovery screen still need to be configured.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (err) {
      Alert.alert(
        'Request Failed',
        err?.message || 'Unable to send the password-reset email. Please try again.'
      );
    } finally {
      setSubmitting(false);
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
              title={submitting ? 'Sending...' : 'Send Reset Link'}
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
