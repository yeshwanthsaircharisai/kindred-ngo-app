import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import colors from '@/constants/colors';
import { borderRadius, borderWidth, spacing } from '@/constants/spacing';
import typography from '@/constants/typography';
import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

/**
 * AppInput - Kindred Form Input Component
 *
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} [props.value]
 * @param {Function} [props.onChangeText]
 * @param {string} [props.placeholder]
 * @param {string} [props.error]
 * @param {boolean} [props.secureTextEntry=false]
 * @param {boolean} [props.showPasswordToggle=false]
 * @param {import('react-native').KeyboardTypeOptions} [props.keyboardType='default']
 * @param {'none'|'sentences'|'words'|'characters'} [props.autoCapitalize='none']
 * @param {React.ReactNode} [props.leftIcon]
 * @param {boolean} [props.disabled=false]
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.containerStyle]
 * @param {import('react-native').StyleProp<import('react-native').TextStyle>} [props.inputStyle]
 */
export function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  showPasswordToggle = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  leftIcon,
  disabled = false,
  containerStyle,
  inputStyle,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isSecured = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <AppText variant="caption" weight="600" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          Boolean(error) && styles.inputWrapperError,
          disabled && styles.inputWrapperDisabled,
        ]}
      >
        {leftIcon ? <View style={styles.leftIconWrapper}>{leftIcon}</View> : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.secondaryText}
          secureTextEntry={isSecured}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, inputStyle]}
          {...rest}
        />

        {showPasswordToggle ? (
          <Pressable
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            style={styles.toggleButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            <AppText variant="caption" weight="600" color={colors.primaryGreen}>
              {isPasswordVisible ? 'Hide' : 'Show'}
            </AppText>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <AppText variant="caption" color="#D32F2F" style={styles.errorText}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.primaryText,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.card, // 16px rounded inputs
    borderWidth: borderWidth.thin,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    height: 50,
  },
  inputWrapperFocused: {
    borderColor: colors.primaryGreen,
    borderWidth: borderWidth.medium,
  },
  inputWrapperError: {
    borderColor: '#D32F2F',
    borderWidth: borderWidth.medium,
  },
  inputWrapperDisabled: {
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  leftIconWrapper: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    ...typography.body,
    color: colors.primaryText,
    paddingVertical: 0,
  },
  toggleButton: {
    paddingLeft: spacing.sm,
    paddingVertical: spacing.xs,
  },
  errorText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default AppInput;

