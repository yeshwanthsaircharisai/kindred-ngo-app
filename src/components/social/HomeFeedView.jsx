import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { AppText } from '@/components/ui';
import { useSocialApp, INITIAL_STORIES } from '@/context/SocialAppContext';

export default function HomeFeedView({ onNavigateCreate, onNavigateNotifications }) {
  const router = useRouter();
  const {
    posts,
    toggleLikePost,
    toggleSavePost,
  } = useSocialApp();

  const [followingMap, setFollowingMap] = useState({});

  const toggleFollow = (authorName) => {
    setFollowingMap((prev) => ({
      ...prev,
      [authorName]: !prev[authorName],
    }));
  };

  const handleNotificationsPress = () => {
    if (onNavigateNotifications) {
      onNavigateNotifications();
    } else {
      router.push('/notifications');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.miniLogo}>
            <AppText style={styles.logoK}>K</AppText>
          </View>
          <AppText style={styles.brandTitle}>Kindred</AppText>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={onNavigateCreate}
            style={styles.iconButton}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Create Post"
          >
            <Feather name="plus" size={24} color="#18241D" />
          </Pressable>

          <Pressable
            onPress={handleNotificationsPress}
            style={styles.iconButton}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Feather name="bell" size={22} color="#18241D" />
          </Pressable>
        </View>
      </View>

      {/* Main Feed ScrollView */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stories Bar */}
        <View style={styles.storiesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScroll}
          >
            {INITIAL_STORIES.map((story) => (
              <View key={story.id} style={styles.storyItem}>
                <View
                  style={[
                    styles.storyRing,
                    story.hasUnseen && styles.storyRingActive,
                  ]}
                >
                  <Image
                    source={{ uri: story.avatar }}
                    style={styles.storyAvatar}
                    contentFit="cover"
                    transition={200}
                  />
                </View>
                <AppText
                  style={styles.storyName}
                  numberOfLines={1}
                >
                  {story.name}
                </AppText>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Posts Feed */}
        {posts.map((post) => {
          const isFollowing = Boolean(followingMap[post.author.name]);

          return (
            <View key={post.id} style={styles.postCard}>
              {/* Author Header */}
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: post.author.avatar }}
                  style={styles.authorAvatar}
                  contentFit="cover"
                />
                <View style={styles.authorInfo}>
                  <View style={styles.nameRow}>
                    <AppText style={styles.authorName}>
                      {post.author.name}
                    </AppText>
                    {post.author.verified ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={15}
                        color="#08734B"
                        style={styles.verifiedIcon}
                      />
                    ) : null}
                  </View>
                  <AppText style={styles.authorMeta}>
                    {post.timeAgo} · {post.location}
                  </AppText>
                </View>

                {/* Follow Button */}
                <Pressable
                  onPress={() => toggleFollow(post.author.name)}
                  style={[
                    styles.followBtn,
                    isFollowing && styles.followingBtn,
                  ]}
                  hitSlop={6}
                >
                  <AppText
                    style={[
                      styles.followBtnText,
                      isFollowing && styles.followingBtnText,
                    ]}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </AppText>
                </Pressable>
              </View>

              {/* Caption text above image matching reference */}
              <View style={styles.captionContainer}>
                <AppText style={styles.captionText}>
                  {post.caption}
                </AppText>
              </View>

              {/* Edge-to-edge High Resolution Photo with rounded corners */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: post.image }}
                  style={styles.postImage}
                  contentFit="cover"
                  transition={250}
                />
              </View>

              {/* Post Action Bar */}
              <View style={styles.actionsBar}>
                <View style={styles.leftActions}>
                  {/* Like Button */}
                  <Pressable
                    onPress={() => toggleLikePost(post.id)}
                    style={styles.actionBtn}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={post.isLiked ? 'heart' : 'heart-outline'}
                      size={20}
                      color={post.isLiked ? '#E53935' : '#18241D'}
                    />
                    <AppText style={styles.actionCount}>
                      {post.likesCount}
                    </AppText>
                  </Pressable>

                  {/* Comment Button */}
                  <Pressable
                    onPress={() => router.push('/notifications')}
                    style={styles.actionBtn}
                    hitSlop={8}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color="#18241D"
                    />
                    <AppText style={styles.actionCount}>
                      {post.commentsCount}
                    </AppText>
                  </Pressable>

                  {/* Share Button */}
                  <Pressable style={styles.actionBtn} hitSlop={8}>
                    <Feather
                      name="send"
                      size={18}
                      color="#18241D"
                      style={{ transform: [{ rotate: '15deg' }] }}
                    />
                    <AppText style={styles.actionCount}>
                      {post.sharesCount}
                    </AppText>
                  </Pressable>
                </View>

                {/* Bookmark Button */}
                <Pressable
                  onPress={() => toggleSavePost(post.id)}
                  hitSlop={8}
                  style={styles.saveBtn}
                >
                  <Ionicons
                    name={post.isSaved ? 'bookmark' : 'bookmark-outline'}
                    size={21}
                    color={post.isSaved ? '#08734B' : '#18241D'}
                  />
                </Pressable>
              </View>
            </View>
          );
        })}

        {/* Bottom spacing for floating navigation bar */}
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
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniLogo: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#08734B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  logoK: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  brandTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#08734B',
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 10,
  },
  scrollContent: {
    paddingTop: 8,
  },
  storiesContainer: {
    marginBottom: 16,
  },
  storiesScroll: {
    paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 64,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E8ECE9',
    marginBottom: 6,
  },
  storyRingActive: {
    borderColor: '#C4F135',
    borderWidth: 2.5,
  },
  storyAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  storyName: {
    fontSize: 11,
    color: '#55635C',
    textAlign: 'center',
    fontWeight: '500',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F5F3',
    paddingBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18241D',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  authorMeta: {
    fontSize: 11,
    color: '#8A9992',
    marginTop: 1,
  },
  followBtn: {
    backgroundColor: '#EAF7EE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
  },
  followingBtn: {
    backgroundColor: '#F1F4F2',
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#08734B',
  },
  followingBtnText: {
    color: '#708078',
  },
  captionContainer: {
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  captionText: {
    fontSize: 13.5,
    lineHeight: 19,
    color: '#1E2C24',
  },
  imageContainer: {
    width: '100%',
    paddingHorizontal: 16,
    height: 250,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  actionCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34453D',
    marginLeft: 6,
  },
  saveBtn: {
    padding: 2,
  },
  bottomSpacer: {
    height: 100,
  },
});
