import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import colors from '@/constants/colors';
import { componentSizes } from '@/constants/spacing';

/**
 * Helper to compute initials from a name
 * @param {string} [name]
 * @returns {string}
 */
function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * AppAvatar - Kindred Avatar Component
 *
 * @param {Object} props
 * @param {import('expo-image').ImageSource|string} [props.source]
 * @param {string} [props.name]
 * @param {'sm'|'md'|'lg'|'xl'|number} [props.size='md']
 * @param {string} [props.backgroundColor=colors.secondaryMint]
 * @param {string} [props.textColor=colors.deepGreen]
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.style]
 */
export function AppAvatar({
  source,
  name,
  size = 'md',
  backgroundColor = colors.secondaryMint,
  textColor = colors.deepGreen,
  style,
  ...rest
}) {
  const [imageError, setImageError] = useState(false);

  const dimension =
    typeof size === 'number'
      ? size
      : componentSizes.avatar[size] || componentSizes.avatar.md;

  const fontSize = Math.round(dimension * 0.38);
  const initials = getInitials(name);
  const hasImage = Boolean(source) && !imageError;

  return (
    <View
      style={[
        styles.base,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={name ? `${name} avatar` : 'Avatar'}
      {...rest}
    >
      {hasImage ? (
        <Image
          source={source}
          style={{
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
          }}
          contentFit="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              fontSize,
              color: textColor,
            },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  initials: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default AppAvatar;

