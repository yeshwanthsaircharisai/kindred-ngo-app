/**
 * Kindred Spacing & Layout Tokens
 * Phase 2 - Professional Design System
 */

import colors from './colors';

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const layout = {
  screenPaddingHorizontal: 20,
  screenPaddingVertical: 16,
  cardPadding: 16,
  cardPaddingLarge: 20,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  card: 16, // In the 14-18px specified range
  lg: 20,
  xl: 24,
  pill: 9999,
  full: 9999,
};

export const borderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  medium: 1.5,
  thick: 2,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  subtle: {
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: colors.deepGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  button: {
    shadowColor: colors.primaryGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const componentSizes = {
  button: {
    sm: { height: 36, paddingHorizontal: 14 },
    md: { height: 46, paddingHorizontal: 20 },
    lg: { height: 52, paddingHorizontal: 24 },
  },
  avatar: {
    sm: 36,
    md: 48,
    lg: 64,
    xl: 80,
  },
  icon: {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 26,
    xl: 32,
  },
};

export default {
  spacing,
  layout,
  borderRadius,
  borderWidth,
  shadows,
  componentSizes,
};

