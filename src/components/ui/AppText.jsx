import React from 'react';
import { StyleSheet, Text } from 'react-native';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

/**
 * AppText - Kindred Typography Component
 *
 * @param {Object} props
 * @param {'largeHeading'|'screenTitle'|'sectionHeading'|'body'|'secondary'|'caption'|'button'} [props.variant='body']
 * @param {string} [props.color]
 * @param {string} [props.weight]
 * @param {'left'|'center'|'right'} [props.align]
 * @param {import('react-native').StyleProp<import('react-native').TextStyle>} [props.style]
 * @param {React.ReactNode} props.children
 */
export function AppText({
  variant = 'body',
  color,
  weight,
  align,
  style,
  children,
  ...rest
}) {
  const baseStyle = typography[variant] || typography.body;

  const computedStyle = [
    styles.base,
    baseStyle,
    color && { color },
    weight && { fontWeight: weight },
    align && { textAlign: align },
    style,
  ];

  return (
    <Text style={computedStyle} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.primaryText,
  },
});

export default AppText;

