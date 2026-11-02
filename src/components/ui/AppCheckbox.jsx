import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import colors from '@/constants/colors';
import { borderRadius, borderWidth, spacing } from '@/constants/spacing';
import { AppText } from './AppText';

/**
 * AppCheckbox - Kindred Checkbox Component
 *
 * @param {Object} props
 * @param {boolean} props.checked
 * @param {Function} props.onToggle
 * @param {React.ReactNode} [props.label]
 * @param {string} [props.error]
 * @param {boolean} [props.disabled=false]
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.style]
 */
export function AppCheckbox({
  checked = false,
  onToggle,
  label,
  error,
  disabled = false,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={() => !disabled && onToggle && onToggle(!checked)}
        style={styles.row}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
        hitSlop={4}
      >
        <View
          style={[
            styles.box,
            checked && styles.boxChecked,
            Boolean(error) && styles.boxError,
            disabled && styles.boxDisabled,
          ]}
        >
          {checked ? (
            <AppText
              variant="caption"
              color={colors.white}
              style={styles.checkmark}
            >
              ✓
            </AppText>
          ) : null}
        </View>

        {label ? (
          <View style={styles.labelContainer}>
            {typeof label === 'string' ? (
              <AppText variant="secondary" color={colors.primaryText}>
                {label}
              </AppText>
            ) : (
              label
            )}
          </View>
        ) : null}
      </Pressable>

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
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.xs,
    borderWidth: borderWidth.medium,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  boxError: {
    borderColor: '#D32F2F',
  },
  boxDisabled: {
    opacity: 0.5,
  },
  checkmark: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
  labelContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  errorText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default AppCheckbox;

