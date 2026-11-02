import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { AppText } from '@/components/ui';
import { useSocialApp } from '@/context/SocialAppContext';

const { width, height } = Dimensions.get('window');

export default function ReelsView() {
  const { reels, toggleLikeReel } = useSocialApp();
  const [activeTab, setActiveTab] = useState('for_you'); // 'for_you' | 'following'
  const [isFollowing, setIsFollowing] = useState(false);

  const reel = reels[0] || {
    creator: {
      name: 'GreenEarth NGO',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    },
    caption: 'A greener tomorrow\nstarts with you. 🌱\n#GoGreen #Nature #Kindred',
    music: 'Original Audio',
    likesCount: '12.8K',
    commentsCount: '423',
    sharesCount: '1.2K',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1080&auto=format&fit=crop&q=80',
  };

  return (
    <View style={styles.container}>
      {/* Full screen video / photo background */}
      <Image
        source={{ uri: reel.image }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />

      {/* Subtle bottom gradient overlay for readability */}
      <View style={styles.gradientOverlay} pointerEvents="none" />

      {/* Top Header: For You / Following & Camera Icon */}
      <View style={styles.topHeader}>
        <View style={styles.tabsRow}>
          <Pressable
            onPress={() => setActiveTab('for_you')}
            style={styles.tabBtn}
            hitSlop={8}
          >
            <AppText
              style={[
                styles.tabText,
                activeTab === 'for_you' && styles.tabTextActive,
              ]}
            >
              For You
            </AppText>
            {activeTab === 'for_you' && <View style={styles.tabIndicator} />}
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('following')}
            style={styles.tabBtn}
            hitSlop={8}
          >
            <AppText
              style={[
                styles.tabText,
                activeTab === 'following' && styles.tabTextActive,
              ]}
            >
              Following
            </AppText>
            {activeTab === 'following' && <View style={styles.tabIndicator} />}
          </Pressable>
        </View>

        <Pressable style={styles.cameraBtn} hitSlop={8}>
          <Feather name="camera" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Right Action Icons Column */}
      <View style={styles.rightActionsColumn}>
        {/* Like */}
        <Pressable
          onPress={() => toggleLikeReel(reel.id)}
          style={styles.actionItem}
          hitSlop={6}
        >
          <Ionicons
            name={reel.isLiked ? 'heart' : 'heart-outline'}
            size={28}
            color={reel.isLiked ? '#E53935' : '#FFFFFF'}
          />
          <AppText style={styles.actionCountText}>{reel.likesCount}</AppText>
        </Pressable>

        {/* Comment */}
        <Pressable style={styles.actionItem} hitSlop={6}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={26}
            color="#FFFFFF"
          />
          <AppText style={styles.actionCountText}>{reel.commentsCount}</AppText>
        </Pressable>

        {/* Share */}
        <Pressable style={styles.actionItem} hitSlop={6}>
          <Feather
            name="send"
            size={24}
            color="#FFFFFF"
            style={{ transform: [{ rotate: '15deg' }] }}
          />
          <AppText style={styles.actionCountText}>{reel.sharesCount}</AppText>
        </Pressable>

        {/* Sparkle / Effect */}
        <Pressable style={styles.actionItem} hitSlop={6}>
          <MaterialCommunityIcons
            name="creation-outline"
            size={24}
            color="#FFFFFF"
          />
        </Pressable>

        {/* More options */}
        <Pressable style={styles.actionItem} hitSlop={6}>
          <Feather name="more-horizontal" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Bottom Details (Creator info, Caption & Music) */}
      <View style={styles.bottomDetails}>
        <View style={styles.creatorRow}>
          <Image
            source={{ uri: reel.creator.avatar }}
            style={styles.creatorAvatar}
            contentFit="cover"
          />
          <AppText style={styles.creatorName}>
            {reel.creator.name}
          </AppText>
          {reel.creator.verified ? (
            <Ionicons
              name="checkmark-circle"
              size={15}
              color="#34A853"
              style={styles.verifiedBadge}
            />
          ) : null}

          <Pressable
            onPress={() => setIsFollowing((prev) => !prev)}
            style={[
              styles.followButton,
              isFollowing && styles.followingButton,
            ]}
            hitSlop={6}
          >
            <AppText
              style={[
                styles.followButtonText,
                isFollowing && styles.followingButtonText,
              ]}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </AppText>
          </Pressable>
        </View>

        <AppText style={styles.captionText}>
          {reel.caption}
        </AppText>

        <View style={styles.musicRow}>
          <Ionicons name="musical-notes-outline" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <AppText style={styles.musicText}>
            {reel.music}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    zIndex: 20,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBtn: {
    marginRight: 18,
    position: 'relative',
    paddingBottom: 4,
  },
  tabText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  cameraBtn: {
    padding: 6,
  },
  rightActionsColumn: {
    position: 'absolute',
    right: 14,
    bottom: 124,
    alignItems: 'center',
    zIndex: 20,
  },
  actionItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  bottomDetails: {
    position: 'absolute',
    bottom: 105,
    left: 18,
    right: 76,
    zIndex: 20,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  creatorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#C4F135',
  },
  creatorName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  followButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  followingButton: {
    backgroundColor: '#C4F135',
    borderColor: '#C4F135',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#0A3B2A',
  },
  captionText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    lineHeight: 19,
    marginBottom: 10,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

