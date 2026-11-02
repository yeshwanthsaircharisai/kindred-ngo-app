import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import colors from '@/constants/colors';
import { layout } from '@/constants/spacing';

/**
 * AppScreen - Kindred Screen Wrapper Component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.scrollable=false]
 * @param {boolean} [props.safe=true]
 * @param {'dark'|'light'|'auto'} [props.statusBarStyle='dark']
 * @param {string} [props.backgroundColor=colors.background]
 * @param {boolean|number} [props.padding=true]
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.contentContainerStyle]
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.style]
 */
export function AppScreen({
  children,
  scrollable = false,
  safe = true,
  statusBarStyle = 'dark',
  backgroundColor = colors.background,
  padding = true,
  contentContainerStyle,
  style,
  ...rest
}) {
  const horizontalPadding =
    typeof padding === 'number'
      ? padding
      : padding
      ? layout.screenPaddingHorizontal
      : 0;

  const verticalPadding =
    typeof padding === 'number'
      ? padding
      : padding
      ? layout.screenPaddingVertical
      : 0;

  const ContainerComponent = safe ? SafeAreaView : View;

  return (
    <ContainerComponent
      style={[
        styles.root,
        { backgroundColor },
        style,
      ]}
      {...rest}
    >
      <StatusBar style={statusBarStyle} />
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
              paddingVertical: verticalPadding,
            },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.content,
            {
              paddingHorizontal: horizontalPadding,
              paddingVertical: verticalPadding,
            },
            contentContainerStyle,
          ]}
        >
          {children}
        </View>
      )}
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
});

export default AppScreen;

