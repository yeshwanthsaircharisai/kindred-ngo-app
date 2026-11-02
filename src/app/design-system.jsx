import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import {
  borderRadius,
  borderWidth,
  layout,
  spacing,
} from '@/constants/spacing';
import {
  AppAvatar,
  AppButton,
  AppCard,
  AppDivider,
  AppIcon,
  AppScreen,
  AppText,
} from '@/components/ui';

export default function DesignSystemPreviewScreen() {
  const router = useRouter();

  const colorPalette = [
    { name: 'Primary green', hex: colors.primaryGreen, textColor: colors.white },
    { name: 'Deep green', hex: colors.deepGreen, textColor: colors.white },
    { name: 'Secondary mint', hex: colors.secondaryMint, textColor: colors.deepGreen },
    { name: 'Background', hex: colors.background, textColor: colors.primaryText, border: true },
    { name: 'White', hex: colors.white, textColor: colors.primaryText, border: true },
    { name: 'Primary text', hex: colors.primaryText, textColor: colors.white },
    { name: 'Secondary text', hex: colors.secondaryText, textColor: colors.white },
    { name: 'Border', hex: colors.border, textColor: colors.primaryText, border: true },
  ];

  return (
    <AppScreen scrollable statusBarStyle="dark" backgroundColor={colors.background}>
      <View style={styles.header}>
        <AppButton
          title="Back to Welcome"
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <AppText variant="largeHeading">Design System</AppText>
        <AppText variant="secondary" style={styles.headerSubtitle}>
          Kindred Phase 2 Component & Token Preview
        </AppText>
      </View>

      <AppDivider spacing={spacing.lg} />

      {/* 1. COLOR PALETTE */}
      <View style={styles.section}>
        <AppText variant="sectionHeading" style={styles.sectionTitle}>
          1. Color Palette
        </AppText>
        <AppText variant="secondary" style={styles.sectionDescription}>
          Exact centralized brand and surface colors for Kindred.
        </AppText>

        <View style={styles.colorGrid}>
          {colorPalette.map((item) => (
            <View key={item.name} style={styles.colorCard}>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: item.hex },
                  item.border && styles.swatchBorder,
                ]}
              >
                <AppText
                  variant="caption"
                  style={[styles.colorSwatchText, { color: item.textColor }]}
                >
                  {item.hex}
                </AppText>
              </View>
              <AppText variant="body" weight="600" style={styles.colorName}>
                {item.name}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <AppDivider spacing={spacing.xl} />

      {/* 2. TYPOGRAPHY */}
      <View style={styles.section}>
        <AppText variant="sectionHeading" style={styles.sectionTitle}>
          2. Typography Scale
        </AppText>
        <AppText variant="secondary" style={styles.sectionDescription}>
          Clean, modern font styles using available system fonts.
        </AppText>

        <AppCard variant="outlined" style={styles.typoCard}>
          <View style={styles.typoRow}>
            <AppText variant="caption">LARGE HEADING (32px / 700)</AppText>
            <AppText variant="largeHeading">Building a Community</AppText>
          </View>
          <AppDivider spacing={spacing.sm} />

          <View style={styles.typoRow}>
            <AppText variant="caption">SCREEN TITLE (24px / 700)</AppText>
            <AppText variant="screenTitle">Community Initiatives</AppText>
          </View>
          <AppDivider spacing={spacing.sm} />

          <View style={styles.typoRow}>
            <AppText variant="caption">SECTION HEADING (18px / 600)</AppText>
            <AppText variant="sectionHeading">Volunteers & Nonprofits</AppText>
          </View>
          <AppDivider spacing={spacing.sm} />

          <View style={styles.typoRow}>
            <AppText variant="caption">BODY TEXT (15px / 400)</AppText>
            <AppText variant="body">
              Kindred connects passionate volunteers with local causes, making
              meaningful social impact simple and transparent.
            </AppText>
          </View>
          <AppDivider spacing={spacing.sm} />

          <View style={styles.typoRow}>
            <AppText variant="caption">SECONDARY TEXT (14px / 400)</AppText>
            <AppText variant="secondary">
              Updated 2 hours ago by Kindred Foundation
            </AppText>
          </View>
          <AppDivider spacing={spacing.sm} />

          <View style={styles.typoRow}>
            <AppText variant="caption">SMALL CAPTION (12px / 500)</AppText>
            <AppText variant="caption">
              VERIFIED NONPROFIT • 501(C)(3) REGISTERED
            </AppText>
          </View>
        </AppCard>
      </View>

      <AppDivider spacing={spacing.xl} />

      {/* 3. BUTTONS */}
      <View style={styles.section}>
        <AppText variant="sectionHeading" style={styles.sectionTitle}>
          3. Buttons
        </AppText>
        <AppText variant="secondary" style={styles.sectionDescription}>
          Interactive buttons supporting primary, secondary, and disabled states.
        </AppText>

        <View style={styles.buttonStack}>
          <AppButton
            title="Primary Button"
            variant="primary"
            onPress={() => {}}
            fullWidth
          />
          <AppButton
            title="Secondary Mint Button"
            variant="secondary"
            onPress={() => {}}
            fullWidth
          />
          <AppButton
            title="Disabled Button"
            variant="primary"
            disabled
            onPress={() => {}}
            fullWidth
          />
          <AppButton
            title="Outline Button"
            variant="outline"
            onPress={() => {}}
            fullWidth
          />
        </View>
      </View>

      <AppDivider spacing={spacing.xl} />

      {/* 4. CARDS */}
      <View style={styles.section}>
        <AppText variant="sectionHeading" style={styles.sectionTitle}>
          4. Cards (14–18px Corner Radius)
        </AppText>
        <AppText variant="secondary" style={styles.sectionDescription}>
          Rounded surface cards with subtle borders and shadows.
        </AppText>

        <View style={styles.cardStack}>
          <AppCard variant="elevated">
            <AppText variant="sectionHeading">Elevated Card</AppText>
            <AppText variant="secondary" style={styles.cardBody}>
              Features subtle shadow elevation and clean border framing for standard content feed items.
            </AppText>
          </AppCard>

          <AppCard variant="outlined">
            <AppText variant="sectionHeading">Outlined Card</AppText>
            <AppText variant="secondary" style={styles.cardBody}>
              Bordered container without shadows, ideal for secondary groupings and form sections.
            </AppText>
          </AppCard>

          <AppCard variant="flat">
            <AppText variant="sectionHeading" color={colors.deepGreen}>
              Secondary Mint Flat Card
            </AppText>
            <AppText variant="body" color={colors.deepGreen} style={styles.cardBody}>
              Tinted background element for highlight banners, tips, and key highlights.
            </AppText>
          </AppCard>
        </View>
      </View>

      <AppDivider spacing={spacing.xl} />

      {/* 5. AVATARS */}
      <View style={styles.section}>
        <AppText variant="sectionHeading" style={styles.sectionTitle}>
          5. Avatars
        </AppText>
        <AppText variant="secondary" style={styles.sectionDescription}>
          Circular avatars with automatic initials fallback and multi-size tokens.
        </AppText>

        <View style={styles.avatarRow}>
          <View style={styles.avatarItem}>
            <AppAvatar name="Kindred NGO" size="xl" />
            <AppText variant="caption">XL (80)</AppText>
          </View>
          <View style={styles.avatarItem}>
            <AppAvatar name="Sarah Connor" size="lg" />
            <AppText variant="caption">LG (64)</AppText>
          </View>
          <View style={styles.avatarItem}>
            <AppAvatar name="Alex Doe" size="md" />
            <AppText variant="caption">MD (48)</AppText>
          </View>
          <View style={styles.avatarItem}>
            <AppAvatar name="Vol" size="sm" />
            <AppText variant="caption">SM (36)</AppText>
          </View>
        </View>
      </View>

      <AppDivider spacing={spacing.xl} />

      {/* 6. DIVIDERS */}
      <View style={styles.section}>
        <AppText variant="sectionHeading" style={styles.sectionTitle}>
          6. Dividers
        </AppText>
        <AppText variant="secondary" style={styles.sectionDescription}>
          Consistent separators using border color tokens.
        </AppText>

        <AppCard variant="outlined">
          <AppText variant="body">Section above divider</AppText>
          <AppDivider spacing={spacing.md} />
          <AppText variant="body">Section below standard divider</AppText>
          <AppDivider spacing={spacing.md} thickness={2} color={colors.primaryGreen} />
          <AppText variant="body">Custom green accent divider</AppText>
        </AppCard>
      </View>

      <AppDivider spacing={spacing.xl} />

      {/* 7. SPACING TOKENS */}
      <View style={styles.section}>
        <AppText variant="sectionHeading" style={styles.sectionTitle}>
          7. Spacing Scale Examples
        </AppText>
        <AppText variant="secondary" style={styles.sectionDescription}>
          Centralized spacing token scale (xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32).
        </AppText>

        <AppCard variant="outlined" style={styles.spacingCard}>
          {[
            { token: 'xs', val: spacing.xs },
            { token: 'sm', val: spacing.sm },
            { token: 'md', val: spacing.md },
            { token: 'lg', val: spacing.lg },
            { token: 'xl', val: spacing.xl },
            { token: 'xxl', val: spacing.xxl },
            { token: 'xxxl', val: spacing.xxxl },
          ].map((item) => (
            <View key={item.token} style={styles.spacingRow}>
              <AppText variant="caption" style={styles.spacingLabel}>
                {item.token} ({item.val}px)
              </AppText>
              <View
                style={[
                  styles.spacingBar,
                  { width: item.val * 5, height: 16 },
                ]}
              />
            </View>
          ))}
        </AppCard>
      </View>

      <AppDivider spacing={spacing.xl} />

      {/* 8. ICONS */}
      <View style={styles.section}>
        <AppText variant="sectionHeading" style={styles.sectionTitle}>
          8. AppIcon Components
        </AppText>
        <AppText variant="secondary" style={styles.sectionDescription}>
          Integrated with native symbols and design tokens.
        </AppText>

        <View style={styles.iconRow}>
          <AppIcon name="heart" size="lg" color={colors.primaryGreen} />
          <AppIcon name="star" size="lg" color={colors.deepGreen} />
          <AppIcon name="person" size="lg" color={colors.primaryGreen} />
          <AppIcon name="bell" size="lg" color={colors.secondaryText} />
        </View>
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Return to Welcome Screen"
          variant="primary"
          onPress={() => router.back()}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    marginTop: spacing.xxs,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.primaryText,
  },
  sectionDescription: {
    marginBottom: spacing.xs,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorCard: {
    width: '48%',
    gap: spacing.xs,
  },
  colorSwatch: {
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchBorder: {
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
  },
  colorSwatchText: {
    fontWeight: '700',
  },
  colorName: {
    fontSize: 13,
  },
  typoCard: {
    gap: spacing.xs,
  },
  typoRow: {
    gap: spacing.xxs,
  },
  buttonStack: {
    gap: spacing.md,
  },
  cardStack: {
    gap: spacing.md,
  },
  cardBody: {
    marginTop: spacing.xs,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
  },
  avatarItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  spacingCard: {
    gap: spacing.sm,
  },
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  spacingLabel: {
    width: 90,
  },
  spacingBar: {
    backgroundColor: colors.primaryGreen,
    borderRadius: borderRadius.xs,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
  },
  footer: {
    marginTop: spacing.xxl,
    marginBottom: spacing.huge,
  },
});

