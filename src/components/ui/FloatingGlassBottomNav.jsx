
import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Platform,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '@/constants/colors';
import { borderRadius, spacing } from '@/constants/spacing';

export function FloatingGlassBottomNav({
  activeTab = 'home',
  onSelectTab,
  dark = false,
}) {
  const tabs = [
    {
      key: 'home',
      label: 'Home',
      renderIcon: (active, isDark) => (
        <Ionicons
          name="home-outline"
          size={23}
          color={
            active
              ? '#0A3B2A'
              : isDark
                ? 'rgba(255,255,255,0.7)'
                : '#1B4D3E'
          }
        />
      ),
    },
    {
      key: 'explore',
      label: 'Explore',
      renderIcon: (active, isDark) => (
        <Ionicons
          name="search-outline"
          size={23}
          color={
            active
              ? '#0A3B2A'
              : isDark
                ? 'rgba(255,255,255,0.7)'
                : '#1B4D3E'
          }
        />
      ),
    },
    {
      key: 'messages',
      label: 'Messages',
      renderIcon: (active, isDark) => (
        active ? (
          <View style={styles.messagesActiveFill}>
            <MaterialCommunityIcons
              name="message-text"
              size={18}
              color="#FFFFFF"
            />
          </View>
        ) : (
          <MaterialCommunityIcons
            name="message-reply-outline"
            size={22}
            color={isDark ? 'rgba(255,255,255,0.7)' : '#1B4D3E'}
          />
        )
      ),
    },
    {
      key: 'reels',
      label: 'Reels',
      renderIcon: (active, isDark) => (
        <MaterialCommunityIcons
          name="movie-play-outline"
          size={23}
          color={
            active
              ? '#0A3B2A'
              : isDark
                ? 'rgba(255,255,255,0.7)'
                : '#1B4D3E'
          }
        />
      ),
    },
    {
      key: 'activity',
      label: 'Activity',
      renderIcon: (active, isDark) => (
        <Feather
          name="bell"
          size={22}
          color={
            active
              ? '#0A3B2A'
              : isDark
                ? 'rgba(255,255,255,0.7)'
                : '#1B4D3E'
          }
        />
      ),
    },
    {
      key: 'profile',
      label: 'Profile',
      renderIcon: (active, isDark) => (
        <Feather
          name="user"
          size={22}
          color={
            active
              ? '#0A3B2A'
              : isDark
                ? 'rgba(255,255,255,0.7)'
                : '#1B4D3E'
          }
        />
      ),
    },
  ];

  return (
    <View style={styles.floatingWrapper} pointerEvents="box-none">
      <View
        style={[
          styles.outerContainer,
          dark && styles.outerContainerDark,
        ]}
      >
        <BlurView
          intensity={Platform.OS === 'ios' ? 70 : 100}
          tint={dark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.navRow}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            // When messages is active, in the reference screen 6 it shows a solid green circle or lime pill depending on screen. In screen 6 it is dark green circle with white text/bubble. For general tabs with lime pill:
            const isMessagesSpecial = tab.key === 'messages' && isActive;

            return (
              <Pressable
                key={tab.key}
                onPress={() => onSelectTab?.(tab.key)}
                style={({ pressed }) => [
                  styles.tabItem,
                  isActive && !isMessagesSpecial && styles.activeTabPill,
                  isMessagesSpecial && styles.messagesSpecialTab,
                  pressed && styles.tabPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: isActive }}
              >
                {tab.renderIcon(isActive, dark)}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: 22,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },

  outerContainer: {
    width: '90%',
    maxWidth: 370,
    height: 64,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },

  outerContainerDark: {
    backgroundColor: 'rgba(22, 34, 26, 0.78)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
    shadowColor: '#000000',
    shadowOpacity: 0.35,
  },

  navRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },

  tabItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeTabPill: {
    backgroundColor: '#C4F135',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },

  messagesSpecialTab: {
    backgroundColor: 'transparent',
  },

  messagesActiveFill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F6941',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  tabPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
});

export default FloatingGlassBottomNav;
