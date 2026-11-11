import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import ImageViewing from 'react-native-image-viewing';
import { AppText } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSocialApp } from '@/context/SocialAppContext';
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const GAP = 3;
const THUMB_SIZE = (width - 32 - GAP * 2) / 3;

export default function ProfileView({ onEditProfile }) {
  const {
    profile,
    posts,
    savedPosts,
    isLoadingPosts,
    deletePost,
    toggleSavePost,
  } = useSocialApp();

  const { logout, user } = useAuth();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState('grid');
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [deletingPost, setDeletingPost] = useState(false);
  const [removingSavedPost, setRemovingSavedPost] = useState(false);

  // Posts created by the logged-in user.
  const userPosts = (posts || []).filter(
    (post) => post.userId === user?.id
  );

  const userPhotos = userPosts.filter(
    (post) => post.image
  );

  // Posts saved by the logged-in user.
  const savedPhotos = (savedPosts || []).filter(
    (post) => post.image
  );

  // Actual follower and following counts from SocialAppContext.
  const followersCount = Number(profile?.followersCount || 0);
  const followingCount = Number(profile?.followingCount || 0);

  // Use the correct image list in the full-screen viewer.
  const viewerPosts =
    activeTab === 'saved' ? savedPhotos : userPhotos;

  const openPostViewer = (index) => {
    setSelectedPostIndex(index);
    setViewerVisible(true);
  };

  const closePostViewer = () => {
    setViewerVisible(false);
  };

  const handleDeletePost = () => {
    const selectedPost = userPhotos[selectedPostIndex];

    if (!selectedPost || deletingPost) return;

    Alert.alert(
      'Delete Post',
      'Are you sure you want to permanently delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (deletingPost) return;

            setDeletingPost(true);

            try {
              await deletePost(selectedPost.id);

              setViewerVisible(false);

              Alert.alert(
                'Post Deleted',
                'Your post has been deleted.'
              );
            } catch (error) {
              Alert.alert(
                'Delete Failed',
                error?.message ||
                  'Unable to delete this post. Please try again.'
              );
            } finally {
              setDeletingPost(false);
            }
          },
        },
      ]
    );
  };

  // Remove a post from Saved without deleting the original post.
  const handleRemoveSavedPost = () => {
    const selectedPost = savedPhotos[selectedPostIndex];

    if (!selectedPost || removingSavedPost) return;

    Alert.alert(
      'Remove from Saved',
      'Do you want to remove this post from your saved posts?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            if (removingSavedPost) return;

            setRemovingSavedPost(true);

            try {
              await toggleSavePost(selectedPost.id);

              setViewerVisible(false);

              Alert.alert(
                'Removed',
                'Post removed from your saved posts.'
              );
            } catch (error) {
              Alert.alert(
                'Unable to Remove',
                error?.message ||
                  'Could not remove this saved post. Please try again.'
              );
            } finally {
              setRemovingSavedPost(false);
            }
          },
        },
      ]
    );
  };

  const showPostOptions = () => {
    if (activeTab === 'saved') {
      handleRemoveSavedPost();
      return;
    }

    Alert.alert(
      'Post Options',
      'Manage your post',
      [
        {
          text: 'Delete Post',
          style: 'destructive',
          onPress: handleDeletePost,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            if (loggingOut) return;

            setLoggingOut(true);

            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              Alert.alert(
                'Logout Failed',
                error?.message ||
                  'Unable to log out. Please try again.'
              );
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />

        <Pressable hitSlop={10} style={styles.gearBtn}>
          <Feather
            name="settings"
            size={22}
            color="#18241D"
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Information */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <Image
              source={
                profile?.avatar
                  ? { uri: profile.avatar }
                  : undefined
              }
              style={styles.avatarImg}
              contentFit="cover"
            />
          </View>

          <AppText style={styles.userName}>
            {profile?.name || 'User'}
          </AppText>

          <AppText style={styles.userHandle}>
            {profile?.handle || ''}
          </AppText>

          <AppText style={styles.bioText}>
            {profile?.bio || ''}
          </AppText>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <AppText style={styles.statNumber}>
                {userPosts.length}
              </AppText>
              <AppText style={styles.statLabel}>
                Posts
              </AppText>
            </View>

            <View style={styles.statCol}>
              <AppText style={styles.statNumber}>
                {followersCount}
              </AppText>
              <AppText style={styles.statLabel}>
                Followers
              </AppText>
            </View>

            <View style={styles.statCol}>
              <AppText style={styles.statNumber}>
                {followingCount}
              </AppText>
              <AppText style={styles.statLabel}>
                Following
              </AppText>
            </View>
          </View>

          <Pressable
            style={styles.editProfileBtn}
            onPress={onEditProfile}
          >
            <AppText style={styles.editProfileText}>
              Edit Profile
            </AppText>
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <Pressable
            onPress={() => setActiveTab('grid')}
            style={styles.tabBtn}
          >
            <MaterialCommunityIcons
              name="view-grid"
              size={22}
              color={
                activeTab === 'grid'
                  ? '#08734B'
                  : '#94A39B'
              }
            />
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('reels')}
            style={styles.tabBtn}
          >
            <MaterialCommunityIcons
              name="movie-play-outline"
              size={23}
              color={
                activeTab === 'reels'
                  ? '#08734B'
                  : '#94A39B'
              }
            />
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('saved')}
            style={styles.tabBtn}
          >
            <Ionicons
              name="bookmark-outline"
              size={21}
              color={
                activeTab === 'saved'
                  ? '#08734B'
                  : '#94A39B'
              }
            />
          </Pressable>
        </View>

        {/* Profile Posts Grid */}
        {activeTab === 'grid' && (
          <>
            {isLoadingPosts ? (
              <View style={styles.emptyContainer}>
                <AppText style={styles.emptyText}>
                  Loading your posts...
                </AppText>
              </View>
            ) : userPhotos.length > 0 ? (
              <View style={styles.gridContainer}>
                {userPhotos.map((post, index) => (
                  <Pressable
                    key={post.id}
                    style={styles.thumbWrapper}
                    onPress={() => openPostViewer(index)}
                    accessibilityRole="button"
                    accessibilityLabel="Open post image"
                  >
                    <Image
                      source={{ uri: post.image }}
                      style={styles.thumbnail}
                      contentFit="cover"
                    />
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons
                  name="image-outline"
                  size={38}
                  color="#94A39B"
                />

                <AppText style={styles.emptyText}>
                  No posts yet
                </AppText>

                <AppText style={styles.emptySubText}>
                  Your shared photos will appear here.
                </AppText>
              </View>
            )}
          </>
        )}

        {/* Reels Tab */}
        {activeTab === 'reels' && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="movie-play-outline"
              size={38}
              color="#94A39B"
            />

            <AppText style={styles.emptyText}>
              No reels yet
            </AppText>
          </View>
        )}

        {/* Saved Posts Tab */}
        {activeTab === 'saved' && (
          <>
            {isLoadingPosts ? (
              <View style={styles.emptyContainer}>
                <AppText style={styles.emptyText}>
                  Loading saved posts...
                </AppText>
              </View>
            ) : savedPhotos.length > 0 ? (
              <View style={styles.gridContainer}>
                {savedPhotos.map((post, index) => (
                  <Pressable
                    key={post.id}
                    style={styles.thumbWrapper}
                    onPress={() => openPostViewer(index)}
                    accessibilityRole="button"
                    accessibilityLabel="Open saved post"
                  >
                    <Image
                      source={{ uri: post.image }}
                      style={styles.thumbnail}
                      contentFit="cover"
                    />

                    <View style={styles.savedIcon}>
                      <Ionicons
                        name="bookmark"
                        size={15}
                        color="#FFFFFF"
                      />
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="bookmark-outline"
                  size={38}
                  color="#94A39B"
                />

                <AppText style={styles.emptyText}>
                  No saved posts yet
                </AppText>

                <AppText style={styles.emptySubText}>
                  Posts you bookmark will appear here.
                </AppText>
              </View>
            )}
          </>
        )}

        {/* Logout */}
        <Pressable
          style={[
            styles.logoutButton,
            loggingOut && { opacity: 0.6 },
          ]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Feather
            name="log-out"
            size={18}
            color="#DC3545"
          />

          <AppText style={styles.logoutText}>
            {loggingOut ? 'Logging Out...' : 'Log Out'}
          </AppText>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Full-Screen Image Viewer */}
      <ImageViewing
        images={viewerPosts.map((post) => ({
          uri: post.image,
        }))}
        imageIndex={selectedPostIndex}
        visible={viewerVisible}
        onRequestClose={closePostViewer}
        onImageIndexChange={setSelectedPostIndex}
        doubleTapToZoomEnabled
        swipeToCloseEnabled
        HeaderComponent={() => (
          <View style={styles.viewerHeader}>
            <Pressable
              onPress={closePostViewer}
              style={styles.viewerIconButton}
              hitSlop={10}
            >
              <Ionicons
                name="close"
                size={28}
                color="#FFFFFF"
              />
            </Pressable>

            <Pressable
              onPress={showPostOptions}
              style={styles.viewerIconButton}
              hitSlop={10}
              disabled={
                deletingPost || removingSavedPost
              }
            >
              {activeTab === 'saved' ? (
                <Ionicons
                  name="bookmark"
                  size={23}
                  color="#FFFFFF"
                />
              ) : (
                <Feather
                  name="more-vertical"
                  size={25}
                  color="#FFFFFF"
                />
              )}
            </Pressable>
          </View>
        )}
      />
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
  savedIcon: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34453D',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 12,
    color: '#8A9992',
    marginTop: 5,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#FDECEC',
    gap: 10,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC3545',
  },
  bottomSpacer: {
    height: 100,
  },
  viewerHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 48,
    paddingBottom: 16,
  },
  viewerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});