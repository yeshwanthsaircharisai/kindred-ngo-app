
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { borderRadius, layout, spacing } from '@/constants/spacing';
import { AppScreen, AppText, AppButton, AppInput } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { recoveryReady, updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = 'New password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (submitting || !validate()) return;

    setSubmitting(true);

    try {
      await updatePassword(password);

      Alert.alert(
        'Password Updated',
        'Your password has been changed successfully. Please log in using your new password.',
        [
          {
            text: 'Go to Login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Password Update Failed',
        error?.message || 'Unable to update your password. Please request a new reset link.'
      );
    } finally {
      setSubmitting(false);
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
              <AppText style={styles.keyEmoji}>🔐</AppText>
            </View>

            <AppText
              variant="screenTitle"
              color={colors.primaryText}
              weight="700"
              style={styles.heading}
            >
              Reset Password
            </AppText>

            <AppText
              variant="secondary"
              color={colors.secondaryText}
              align="center"
              style={styles.subheading}
            >
              Enter and confirm your new password for your Kindred account.
            </AppText>
          </View>

          <View style={styles.form}>
            {!recoveryReady ? (
              <View style={styles.messageContainer}>
                <AppText
                  variant="body"
                  color={colors.secondaryText}
                  align="center"
                >
                  Your password-reset link is invalid, expired, or has not
                  been verified. Please request a new reset link.
                </AppText>

                <AppButton
                  title="Request New Reset Link"
                  variant="primary"
                  size="lg"
                  fullWidth
                  style={styles.submitButton}
                  onPress={() => router.replace('/forgot-password')}
                />
              </View>
            ) : (
              <>
                <AppInput
                  label="New password"
                  placeholder="Enter your new password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: null }));
                    }
                  }}
                  error={errors.password}
                  secureTextEntry
                  showPasswordToggle
                />

                <AppInput
                  label="Confirm new password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: null,
                      }));
                    }
                  }}
                  error={errors.confirmPassword}
                  secureTextEntry
                  showPasswordToggle
                />

                <AppButton
                  title={submitting ? 'Updating...' : 'Update Password'}
                  variant="primary"
                  size="lg"
                  onPress={handleUpdatePassword}
                  fullWidth
                  style={styles.submitButton}
                />
              </>
            )}
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
  messageContainer: {
    alignItems: 'center',
  },
  submitButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});
