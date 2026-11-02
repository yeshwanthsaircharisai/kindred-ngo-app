import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '@/constants/colors';
import { borderWidth, spacing as spacingTokens } from '@/constants/spacing';

/**
 * AppDivider - Kindred Divider Component
 *
 * @param {Object} props
 * @param {'horizontal'|'vertical'} [props.orientation='horizontal']
 * @param {string} [props.color=colors.border]
 * @param {number} [props.thickness=borderWidth.thin]
 * @param {number} [props.spacing=spacingTokens.md]
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.style]
 */
export function AppDivider({
  orientation = 'horizontal',
  color = colors.border,
  thickness = borderWidth.thin,
  spacing = spacingTokens.md,
  style,
  ...rest
}) {
  const isHorizontal = orientation === 'horizontal';

  const dividerStyle = isHorizontal
    ? {
        height: thickness,
        width: '100%',
        backgroundColor: color,
        marginVertical: spacing,
      }
    : {
        width: thickness,
        height: '100%',
        backgroundColor: color,
        marginHorizontal: spacing,
      };

  return <View style={[styles.base, dividerStyle, style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'stretch',
  },
});

export default AppDivider;

