import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { AppText } from '@/components/ui';
import { useSocialApp } from '@/context/SocialAppContext';

const { width } = Dimensions.get('window');
const GAP = 3;
const THUMB_SIZE = (width - 32 - GAP * 2) / 3;

export default function ProfileView() {
  const { profile } = useSocialApp();
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'reels' | 'saved'

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Pressable hitSlop={10} style={styles.gearBtn}>
          <Feather name="settings" size={22} color="#18241D" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Centered Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <Image
              source={{ uri: profile.avatar }}
              style={styles.avatarImg}
              contentFit="cover"
            />
          </View>

          {/* Name & Username */}
          <AppText style={styles.userName}>
            {profile.name}
          </AppText>
          <AppText style={styles.userHandle}>
            {profile.handle}
          </AppText>

          {/* Bio lines */}
          <AppText style={styles.bioText}>
            {profile.bio}
          </AppText>

          {/* Stats Bar (Posts, Followers, Following) */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <AppText style={styles.statNumber}>{profile.postsCount}</AppText>
              <AppText style={styles.statLabel}>Posts</AppText>
            </View>

            <View style={styles.statCol}>
              <AppText style={styles.statNumber}>{profile.followersCount}</AppText>
              <AppText style={styles.statLabel}>Followers</AppText>
            </View>

            <View style={styles.statCol}>
              <AppText style={styles.statNumber}>{profile.followingCount}</AppText>
              <AppText style={styles.statLabel}>Following</AppText>
            </View>
          </View>

          {/* Edit Profile Button */}
          <Pressable style={styles.editProfileBtn}>
            <AppText style={styles.editProfileText}>Edit Profile</AppText>
          </Pressable>
        </View>

        {/* Tab Icons Row */}
        <View style={styles.tabsRow}>
          <Pressable
            onPress={() => setActiveTab('grid')}
            style={styles.tabBtn}
          >
            <MaterialCommunityIcons
              name="view-grid"
              size={22}
              color={activeTab === 'grid' ? '#08734B' : '#94A39B'}
            />
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('reels')}
            style={styles.tabBtn}
          >
            <MaterialCommunityIcons
              name="movie-play-outline"
              size={23}
              color={activeTab === 'reels' ? '#08734B' : '#94A39B'}
            />
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('saved')}
            style={styles.tabBtn}
          >
            <Ionicons
              name="bookmark-outline"
              size={21}
              color={activeTab === 'saved' ? '#08734B' : '#94A39B'}
            />
          </Pressable>
        </View>

        {/* 3x3 Photo Grid with rounded image corners */}
        <View style={styles.gridContainer}>
          {profile.photos.map((uri, idx) => (
            <View key={idx} style={styles.thumbWrapper}>
              <Image
                source={{ uri }}
                style={styles.thumbnail}
                contentFit="cover"
              />
            </View>
          ))}
        </View>

        {/* Safe padding for bottom floating nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 6,
  },
  gearBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingTop: 4,
  },
  avatarSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#C4F135',
    padding: 2.5,
    marginBottom: 12,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#18241D',
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 13,
    color: '#83928A',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#34453D',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  statCol: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18241D',
  },
  statLabel: {
    fontSize: 11,
    color: '#8A9992',
    marginTop: 2,
  },
  editProfileBtn: {
    width: '100%',
    backgroundColor: '#F1F4F2',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  editProfileText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#18241D',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F6F4',
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  tabBtn: {
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: GAP,
  },
  thumbWrapper: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E8EDE9',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  bottomSpacer: {
    height: 100,
  },
});

