import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import colors from '@/constants/colors';
import { borderRadius, borderWidth, layout, shadows } from '@/constants/spacing';

/**
 * AppCard - Kindred Card Component
 *
 * @param {Object} props
 * @param {'elevated'|'outlined'|'flat'} [props.variant='elevated']
 * @param {number} [props.padding]
 * @param {Function} [props.onPress]
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.style]
 * @param {React.ReactNode} props.children
 */
export function AppCard({
  variant = 'elevated',
  padding = layout.cardPadding,
  onPress,
  style,
  children,
  ...rest
}) {
  const isPressable = typeof onPress === 'function';

  const cardStyle = [
    styles.base,
    { padding },
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'flat' && styles.flat,
    style,
  ];

  if (isPressable) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.card, // 16px corner radius (14-18px specified)
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
  },
  elevated: {
    ...shadows.card,
  },
  outlined: {
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    ...shadows.none,
  },
  flat: {
    backgroundColor: colors.secondaryMint,
    borderWidth: borderWidth.none,
    ...shadows.none,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
});

export default AppCard;

