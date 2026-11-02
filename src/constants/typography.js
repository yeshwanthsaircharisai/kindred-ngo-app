/**
 * Kindred Typography Tokens
 * Phase 2 - Professional Design System
 */

import { Platform } from 'react-native';
import colors from './colors';

export const fontFamilies = {
  primary: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    default: 'normal',
  }),
  heading: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    default: 'normal',
  }),
};

export const typography = {
  largeHeading: {
    fontFamily: fontFamilies.heading,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: colors.primaryText,
    letterSpacing: -0.5,
  },
  screenTitle: {
    fontFamily: fontFamilies.heading,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.primaryText,
    letterSpacing: -0.3,
  },
  sectionHeading: {
    fontFamily: fontFamilies.heading,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.primaryText,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: fontFamilies.primary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: colors.primaryText,
  },
  secondary: {
    fontFamily: fontFamilies.primary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: colors.secondaryText,
  },
  caption: {
    fontFamily: fontFamilies.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.secondaryText,
    letterSpacing: 0.2,
  },
  button: {
    fontFamily: fontFamilies.primary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
};

export default typography;

