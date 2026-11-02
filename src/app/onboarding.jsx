import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { borderRadius, layout, spacing } from '@/constants/spacing';
import { AppScreen, AppText, AppButton } from '@/components/ui';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Connect with Kindness',
    description: 'Discover a community that believes in helping others.',
    badge: '🤝',
  },
  {
    id: '2',
    title: 'Make a Difference',
    description: 'Share your volunteering activities and support meaningful causes.',
    badge: '🌱',
  },
  {
    id: '3',
    title: 'Grow Together',
    description: 'Connect with NGOs and people who care about the community.',
    badge: '✨',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLast = currentIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.replace('/login');
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const slide = SLIDES[currentIndex];

  return (
    <AppScreen safe padding={false} backgroundColor={colors.background}>
      <View style={styles.container}>
        {/* Top bar with Skip button */}
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.miniLogo}>
              <AppText variant="caption" color={colors.white} weight="700">
                K
              </AppText>
            </View>
            <AppText variant="sectionHeading" color={colors.deepGreen} weight="700">
              Kindred
            </AppText>
          </View>

          {!isLast ? (
            <Pressable onPress={handleSkip} hitSlop={10} accessibilityRole="button">
              <AppText variant="body" color={colors.secondaryText} weight="600">
                Skip
              </AppText>
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Slide Graphic / Card */}
        <View style={styles.slideContent}>
          <View style={styles.illustrationCard}>
            <View style={styles.badgeCircle}>
              <AppText style={styles.badgeEmoji}>{slide.badge}</AppText>
            </View>
          </View>

          <View style={styles.textContainer}>
            <AppText variant="largeHeading" color={colors.primaryText} weight="700" align="center" style={styles.title}>
              {slide.title}
            </AppText>

            <AppText variant="body" color={colors.secondaryText} align="center" style={styles.description}>
              {slide.description}
            </AppText>
          </View>

          {/* Dots Indicator */}
          <View style={styles.indicatorContainer}>
            {SLIDES.map((s, idx) => (
              <View
                key={s.id}
                style={[
                  styles.dot,
                  currentIndex === idx ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomBar}>
          {isLast ? (
            <View style={styles.fullActionGroup}>
              <AppButton
                title="Get Started"
                variant="primary"
                size="lg"
                onPress={() => router.replace('/signup')}
                fullWidth
                style={styles.primaryAction}
              />
              <AppButton
                title="I already have an account"
                variant="ghost"
                size="md"
                onPress={() => router.replace('/login')}
                fullWidth
              />
            </View>
          ) : (
            <View style={styles.navRow}>
              <AppButton
                title="Next"
                variant="primary"
                size="lg"
                onPress={handleNext}
                fullWidth
              />
            </View>
          )}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLogo: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  illustrationCard: {
    width: width * 0.65,
    height: width * 0.65,
    maxHeight: 260,
    maxWidth: 260,
    backgroundColor: colors.secondaryMint,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: '#D6EFE3',
  },
  badgeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  badgeEmoji: {
    fontSize: 42,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.md,
  },
  description: {
    lineHeight: 24,
    paddingHorizontal: spacing.sm,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  dot: {
    height: 8,
    borderRadius: borderRadius.pill,
    marginHorizontal: spacing.xs,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primaryGreen,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: colors.border,
  },
  bottomBar: {
    paddingVertical: spacing.md,
  },
  navRow: {
    width: '100%',
  },
  fullActionGroup: {
    width: '100%',
  },
  primaryAction: {
    marginBottom: spacing.xs,
  },
});

