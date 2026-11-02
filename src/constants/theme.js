/**
 * Kindred Centralized Theme
 * Phase 2 - Professional Design System
 */

import '@/global.css';

import { Platform } from 'react-native';
import colors from './colors';
import typography, { fontFamilies } from './typography';
import {
  spacing,
  layout,
  borderRadius,
  borderWidth,
  shadows,
  componentSizes,
} from './spacing';

export { colors };
export { typography, fontFamilies };
export {
  spacing,
  layout,
  borderRadius,
  borderWidth,
  shadows,
  componentSizes,
};

// Legacy exports for backward compatibility with starter components
export const Colors = {
  light: {
    text: colors.primaryText,
    background: colors.background,
    backgroundElement: colors.secondaryMint,
    backgroundSelected: colors.border,
    textSecondary: colors.secondaryText,
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const theme = {
  colors,
  typography,
  spacing,
  layout,
  borderRadius,
  borderWidth,
  shadows,
  componentSizes,
};

export default theme;
