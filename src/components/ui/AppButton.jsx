import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '@/constants/colors';
import { borderRadius, componentSizes, shadows, spacing } from '@/constants/spacing';
import typography from '@/constants/typography';

/**
 * AppButton - Kindred Button Component
 *
 * @param {Object} props
 * @param {string} [props.title]
 * @param {Function} [props.onPress]
 * @param {'primary'|'secondary'|'outline'|'ghost'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.fullWidth=false]
 * @param {React.ReactNode} [props.icon]
 * @param {React.ReactNode} [props.iconRight]
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.style]
 * @param {import('react-native').StyleProp<import('react-native').TextStyle>} [props.textStyle]
 * @param {React.ReactNode} [props.children]
 */
export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconRight,
  style,
  textStyle,
  children,
  ...rest
}) {
  const sizeConfig = componentSizes.button[size] || componentSizes.button.md;

  const isInteractive = !disabled && !loading;

  const getVariantContainerStyle = (pressed) => {
    if (disabled) {
      return styles.containerDisabled;
    }

    switch (variant) {
      case 'secondary':
        return [styles.containerSecondary, pressed && styles.pressedSecondary];
      case 'outline':
        return [styles.containerOutline, pressed && styles.pressedOutline];
      case 'ghost':
        return [styles.containerGhost, pressed && styles.pressedGhost];
      case 'primary':
      default:
        return [styles.containerPrimary, pressed && styles.pressedPrimary];
    }
  };

  const getVariantTextStyle = () => {
    if (disabled) {
      return styles.textDisabled;
    }

    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
        return styles.textOutline;
      case 'ghost':
        return styles.textGhost;
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  const spinnerColor =
    variant === 'primary' && !disabled ? colors.white : colors.primaryGreen;

  return (
    <Pressable
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.base,
        {
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.paddingHorizontal,
        },
        fullWidth && styles.fullWidth,
        getVariantContainerStyle(pressed),
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.leadingIcon}>{icon}</View>}
          {children || (
            <Text style={[styles.textBase, getVariantTextStyle(), textStyle]}>
              {title}
            </Text>
          )}
          {iconRight && <View style={styles.trailingIcon}>{iconRight}</View>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.card, // 16px corner radius matching design tokens
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadingIcon: {
    marginRight: spacing.sm,
  },
  trailingIcon: {
    marginLeft: spacing.sm,
  },
  textBase: {
    ...typography.button,
  },

  // Primary
  containerPrimary: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
    ...shadows.button,
  },
  pressedPrimary: {
    backgroundColor: colors.deepGreen,
    borderColor: colors.deepGreen,
    transform: [{ scale: 0.99 }],
  },
  textPrimary: {
    color: colors.white,
  },

  // Secondary
  containerSecondary: {
    backgroundColor: colors.secondaryMint,
    borderColor: 'transparent',
  },
  pressedSecondary: {
    backgroundColor: '#D6EFE3',
    transform: [{ scale: 0.99 }],
  },
  textSecondary: {
    color: colors.deepGreen,
  },

  // Outline
  containerOutline: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  pressedOutline: {
    backgroundColor: colors.secondaryMint,
    borderColor: colors.primaryGreen,
  },
  textOutline: {
    color: colors.primaryGreen,
  },

  // Ghost
  containerGhost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  pressedGhost: {
    backgroundColor: colors.secondaryMint,
  },
  textGhost: {
    color: colors.primaryGreen,
  },

  // Disabled
  containerDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
    ...shadows.none,
  },
  textDisabled: {
    color: colors.secondaryText,
  },
});

export default AppButton;

