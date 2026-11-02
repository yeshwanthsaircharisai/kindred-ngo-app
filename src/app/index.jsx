import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { borderRadius, layout, spacing } from '@/constants/spacing';
import { AppScreen, AppText } from '@/components/ui';

export default function SplashScreenComponent() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <AppScreen safe padding={false} backgroundColor={colors.background}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoBadge}>
            <AppText variant="largeHeading" color={colors.white} weight="700">
              K
            </AppText>
          </View>

          <AppText variant="largeHeading" color={colors.deepGreen} weight="700" style={styles.brandTitle}>
            Kindred
          </AppText>

          <View style={styles.taglineBadge}>
            <AppText variant="secondary" color={colors.primaryGreen} weight="600">
              Building a community that cares.
            </AppText>
          </View>
        </View>

        <View style={styles.footer}>
          <AppText variant="caption" color={colors.secondaryText}>
            Kindred NGO Network
          </AppText>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing.xxxl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    elevation: 4,
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  brandTitle: {
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  taglineBadge: {
    backgroundColor: colors.secondaryMint,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    marginTop: spacing.xs,
  },
  footer: {
    paddingBottom: spacing.md,
  },
});
