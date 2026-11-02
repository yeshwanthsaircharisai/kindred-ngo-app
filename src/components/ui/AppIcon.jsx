import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import colors from '@/constants/colors';
import { componentSizes } from '@/constants/spacing';

/**
 * AppIcon - Kindred Icon Component
 * Wraps expo-symbols with design system defaults
 *
 * @param {Object} props
 * @param {string|{ios: string, android: string, web?: string}} props.name
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|number} [props.size='md']
 * @param {string} [props.color=colors.primaryGreen]
 * @param {'default'|'medium'|'bold'} [props.weight='medium']
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.style]
 */
export function AppIcon({
  name,
  size = 'md',
  color = colors.primaryGreen,
  weight = 'medium',
  style,
  ...rest
}) {
  const iconSize =
    typeof size === 'number'
      ? size
      : componentSizes.icon[size] || componentSizes.icon.md;

  const symbolFormat =
    typeof name === 'string'
      ? { ios: name, android: name, web: name }
      : name;

  if (!symbolFormat) {
    return <View style={[{ width: iconSize, height: iconSize }, style]} />;
  }

  return (
    <View style={[styles.container, style]} {...rest}>
      <SymbolView
        name={symbolFormat}
        size={iconSize}
        tintColor={color}
        weight={weight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppIcon;

