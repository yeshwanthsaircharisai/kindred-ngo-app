
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

import { Image } from 'expo-image';
import ImageViewing from 'react-native-image-viewing';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSocialApp, INITIAL_STORIES } from '@/context/SocialAppContext';
import { testImageSimilarityBackend } from '@/lib/imageSimilarityApi';

// Stable screen height: does not change when the keyboard opens.
const SCREEN_HEIGHT = Dimensions.get('screen').height;

// Cross-platform message helper.
const showMessage = (title, message) => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    Alert.alert(title, message);
  }
};

export default function HomeFeedView({
  onNavigateCreate,
  onNavigateNotifications,
}) {
  const router = useRouter();
  const { user } = useAuth();

  const {
    posts,
    toggleLikePost,
    toggleSavePost,
    commentsByPost,
    pendingComments,
    fetchComments,
    addComment,
    toggleLikeComment,
    deleteComment,
    followingIds = [],
    pendingFollows = [],
    toggleFollow,
  } = useSocialApp();

  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);

  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentsModalMounted, setCommentsModalMounted] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [replyToComment, setReplyToComment] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  // FastAPI connection test state.
  const [testingBackend, setTestingBackend] = useState(false);

  // Animation values remain stable throughout the component lifecycle.
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(
    new Animated.Value(SCREEN_HEIGHT)
  ).current;

  const isClosingRef = useRef(false);

  // Opening animation.
  useEffect(() => {
    if (!commentsVisible) return;

    backdropOpacity.setValue(0);
    sheetTranslateY.setValue(SCREEN_HEIGHT);

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(sheetTranslateY, {
        toValue: 0,
        damping: 24,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [commentsVisible, backdropOpacity, sheetTranslateY]);

  const imagePosts = (posts || []).filter((post) => post.image);

  const currentComments = selectedPost
    ? commentsByPost[selectedPost.id] || []
    : [];

  const isCommentPending = selectedPost
    ? pendingComments.includes(selectedPost.id)
    : false;

  const handleNotificationsPress = () => {
    if (onNavigateNotifications) {
      onNavigateNotifications();
    } else {
      router.push('/notifications');
    }
  };

  // Test FastAPI backend connection.
  const handleBackendTest = async () => {
    if (testingBackend) return;

    setTestingBackend(true);

    try {
      const result = await testImageSimilarityBackend();

      showMessage(
        'Backend Connected!',
        'Kindred successfully connected to the FastAPI image similarity backend.\n\n' +
          JSON.stringify(result, null, 2)
      );
    } catch (error) {
      console.error(
        '[Kindred Backend] Connection test failed:',
        error
      );

      showMessage(
        'Backend Connection Failed',
        error?.message || 'Unable to connect to FastAPI.'
      );
    } finally {
      setTestingBackend(false);
    }
  };

  const openImageViewer = (postId) => {
    const index = imagePosts.findIndex(
      (post) => post.id === postId
    );

    if (index !== -1) {
      setSelectedPostIndex(index);
      setViewerVisible(true);
    }
  };

  // Open comments.
  const openComments = async (post) => {
    if (isClosingRef.current) return;

    setSelectedPost(post);
    setCommentText('');
    setReplyToComment(null);
    setLoadingComments(true);

    backdropOpacity.setValue(0);
    sheetTranslateY.setValue(SCREEN_HEIGHT);

    setCommentsModalMounted(true);
    setCommentsVisible(true);

    try {
      await fetchComments(post.id);
    } catch (error) {
      showMessage(
        'Unable to load comments',
        error.message || 'Please try again.'
      );
    } finally {
      setLoadingComments(false);
    }
  };

  // Close comments.
  const closeComments = () => {
    if (!commentsModalMounted || isClosingRef.current) return;

    isClosingRef.current = true;

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(sheetTranslateY, {
        toValue: SCREEN_HEIGHT,
        duration: 280,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setCommentsVisible(false);
        setCommentsModalMounted(false);
        setSelectedPost(null);
        setCommentText('');
        setReplyToComment(null);
      }

      isClosingRef.current = false;
    });
  };

  // Add a comment or reply.
  const handleAddComment = async () => {
    if (!selectedPost) return;

    const content = commentText.trim();

    if (!content || submittingComment || isCommentPending) {
      return;
    }

    setSubmittingComment(true);

    try {
      await addComment(
        selectedPost.id,
        content,
        replyToComment?.id || null
      );

      setCommentText('');
      setReplyToComment(null);
    } catch (error) {
      showMessage(
        'Could not add comment',
        error.message || 'Please try again.'
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  // Delete a comment.
  const handleDeleteComment = (comment) => {
    const performDelete = async () => {
      try {
        setDeletingCommentId(comment.id);

        await deleteComment(
          comment.id,
          selectedPost.id
        );
      } catch (error) {
        showMessage(
          'Unable to delete comment',
          error.message || 'Please try again.'
        );
      } finally {
        setDeletingCommentId(null);
      }
    };

    if (Platform.OS === 'web') {
      if (
        typeof window !== 'undefined' &&
        window.confirm('Are you sure you want to delete this comment?')
      ) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete comment',
        'Are you sure you want to delete this comment?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  };

  // Like or unlike a comment.
  const handleLikeComment = async (comment) => {
    try {
      await toggleLikeComment(comment.id, selectedPost.id);
    } catch (error) {
      showMessage(
        'Could not update comment like',
        error.message || 'Please try again.'
      );
    }
  };

  // Reply to a comment.
  const handleReplyPress = (comment) => {
    setReplyToComment(comment);
    setCommentText('');
  };

  // Render comment and replies.
  const renderComment = (item, isReply = false) => {
    const isDeleting = deletingCommentId === item.id;

    return (
      <View
        key={item.id}
        style={[
          styles.commentItem,
          isReply && styles.replyCommentItem,
        ]}
      >
        {item.author?.avatar ? (
          <Image
            source={{ uri: item.author.avatar }}
            style={
              isReply
                ? styles.replyAvatar
                : styles.commentAvatar
            }
            contentFit="cover"
          />
        ) : (
          <View
            style={[
              styles.commentAvatarFallback,
              isReply && styles.replyAvatar,
            ]}
          >
            <Feather
              name="user"
              size={isReply ? 14 : 17}
              color="#08734B"
            />
          </View>
        )}

        <View style={styles.commentMain}>
          <View style={styles.commentBubble}>
            <AppText style={styles.commentText}>
              <AppText style={styles.commentAuthor}>
                {item.author?.name || 'Kindred Member'}{' '}
              </AppText>
              {item.content}
            </AppText>
          </View>

          <View style={styles.commentMetaRow}>
            <AppText style={styles.commentTime}>
              {item.timeAgo || 'Just now'}
            </AppText>

            {!isReply ? (
              <Pressable
                onPress={() => handleReplyPress(item)}
                hitSlop={8}
              >
                <AppText style={styles.replyLabel}>
                  Reply
                </AppText>
              </Pressable>
            ) : null}

            {item.isOwnComment ? (
              <Pressable
                onPress={() => handleDeleteComment(item)}
                disabled={isDeleting}
                hitSlop={8}
              >
                {isDeleting ? (
                  <ActivityIndicator
                    size="small"
                    color="#D93636"
                  />
                ) : (
                  <AppText style={styles.deleteCommentText}>
                    Delete
                  </AppText>
                )}
              </Pressable>
            ) : null}
          </View>

          {item.replies?.length > 0 ? (
            <View style={styles.repliesContainer}>
              {item.replies.map((reply) =>
                renderComment(reply, true)
              )}
            </View>
          ) : null}
        </View>

        <View style={styles.commentHeart}>
          <Pressable
            onPress={() => handleLikeComment(item)}
            hitSlop={9}
          >
            <Ionicons
              name={
                item.isLiked ? 'heart' : 'heart-outline'
              }
              size={17}
              color={
                item.isLiked ? '#E53935' : '#8B9690'
              }
            />
          </Pressable>

          {(item.likesCount || 0) > 0 ? (
            <AppText style={styles.commentLikeCount}>
              {item.likesCount}
            </AppText>
          ) : null}
        </View>
      </View>
    );
  };

  const renderCommentItem = ({ item }) => renderComment(item);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.miniLogo}>
            <AppText style={styles.logoK}>K</AppText>
          </View>

          <AppText style={styles.brandTitle}>
            Kindred
          </AppText>
        </View>

        <View style={styles.headerActions}>
          {/* FastAPI Backend Test Button */}
          <Pressable
            onPress={handleBackendTest}
            disabled={testingBackend}
            style={styles.iconButton}
            hitSlop={10}
          >
            {testingBackend ? (
              <ActivityIndicator
                size="small"
                color="#08734B"
              />
            ) : (
              <Feather
                name="server"
                size={21}
                color="#08734B"
              />
            )}
          </Pressable>

          <Pressable
            onPress={onNavigateCreate}
            style={styles.iconButton}
            hitSlop={10}
          >
            <Feather
              name="plus"
              size={24}
              color="#18241D"
            />
          </Pressable>

          <Pressable
            onPress={handleNotificationsPress}
            style={styles.iconButton}
            hitSlop={10}
          >
            <Feather
              name="bell"
              size={22}
              color="#18241D"
            />
          </Pressable>
        </View>
      </View>

      {/* Home Feed */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stories */}
        <View style={styles.storiesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScroll}
          >
            {INITIAL_STORIES.map((story) => (
              <View
                key={story.id}
                style={styles.storyItem}
              >
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

        {/* Posts */}
        {(posts || []).map((post) => {
          const isOwnPost = post.userId === user?.id;

          const isFollowing = followingIds.includes(
            post.userId
          );

          const isFollowPending = pendingFollows.includes(
            post.userId
          );

          return (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                {post.author?.avatar ? (
                  <Image
                    source={{ uri: post.author.avatar }}
                    style={styles.authorAvatar}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.authorAvatarFallback}>
                    <Feather
                      name="user"
                      size={18}
                      color="#08734B"
                    />
                  </View>
                )}

                <View style={styles.authorInfo}>
                  <View style={styles.nameRow}>
                    <AppText style={styles.authorName}>
                      {post.author?.name || 'Kindred Member'}
                    </AppText>

                    {post.author?.verified ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={15}
                        color="#08734B"
                        style={styles.verifiedIcon}
                      />
                    ) : null}
                  </View>

                  <AppText style={styles.authorMeta}>
                    {post.timeAgo}
                    {post.location
                      ? ` · ${post.location}`
                      : ''}
                  </AppText>
                </View>

                {!isOwnPost && post.userId ? (
                  <Pressable
                    onPress={async () => {
                      try {
                        await toggleFollow(post.userId);
                      } catch (error) {
                        showMessage(
                          'Follow Failed',
                          error?.message || 'Please try again.'
                        );
                      }
                    }}
                    disabled={isFollowPending}
                    style={[
                      styles.followBtn,
                      isFollowing && styles.followingBtn,
                      isFollowPending && { opacity: 0.6 },
                    ]}
                    hitSlop={6}
                  >
                    {isFollowPending ? (
                      <ActivityIndicator
                        size="small"
                        color="#08734B"
                      />
                    ) : (
                      <AppText
                        style={[
                          styles.followBtnText,
                          isFollowing &&
                            styles.followingBtnText,
                        ]}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </AppText>
                    )}
                  </Pressable>
                ) : null}
              </View>

              <View style={styles.captionContainer}>
                <AppText style={styles.captionText}>
                  {post.caption}
                </AppText>
              </View>

              {post.image ? (
                <View style={styles.imageContainer}>
                  <Pressable
                    onPress={() => openImageViewer(post.id)}
                  >
                    <Image
                      source={{ uri: post.image }}
                      style={styles.postImage}
                      contentFit="cover"
                      transition={250}
                    />
                  </Pressable>
                </View>
              ) : null}

              <View style={styles.actionsBar}>
                <View style={styles.leftActions}>
                  <Pressable
                    onPress={() => toggleLikePost(post.id)}
                    style={styles.actionBtn}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={
                        post.isLiked
                          ? 'heart'
                          : 'heart-outline'
                      }
                      size={20}
                      color={
                        post.isLiked ? '#E53935' : '#18241D'
                      }
                    />

                    <AppText style={styles.actionCount}>
                      {post.likesCount}
                    </AppText>
                  </Pressable>

                  <Pressable
                    onPress={() => openComments(post)}
                    style={styles.actionBtn}
                    hitSlop={8}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color="#18241D"
                    />

                    <AppText style={styles.actionCount}>
                      {post.commentsCount || 0}
                    </AppText>
                  </Pressable>

                  <Pressable
                    style={styles.actionBtn}
                    hitSlop={8}
                  >
                    <Feather
                      name="send"
                      size={18}
                      color="#18241D"
                      style={{
                        transform: [{ rotate: '15deg' }],
                      }}
                    />

                    <AppText style={styles.actionCount}>
                      {post.sharesCount}
                    </AppText>
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => toggleSavePost(post.id)}
                  hitSlop={8}
                  style={styles.saveBtn}
                >
                  <Ionicons
                    name={
                      post.isSaved
                        ? 'bookmark'
                        : 'bookmark-outline'
                    }
                    size={21}
                    color={
                      post.isSaved ? '#08734B' : '#18241D'
                    }
                  />
                </Pressable>
              </View>
            </View>
          );
        })}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Comments Modal */}
      <Modal
        visible={commentsModalMounted}
        animationType="none"
        transparent={true}
        onRequestClose={closeComments}
        statusBarTranslucent={true}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          {/* Backdrop */}
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.modalBackdrop,
              { opacity: backdropOpacity },
            ]}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeComments}
            />
          </Animated.View>

          {/* Comments sheet */}
          <Animated.View
            style={[
              styles.commentsSheet,
              {
                transform: [
                  { translateY: sheetTranslateY },
                ],
              },
            ]}
          >
            <View style={styles.handleArea}>
              <View style={styles.modalHandle} />
            </View>

            <View style={styles.modalHeader}>
              <AppText style={styles.modalTitle}>
                Comments
              </AppText>

              <Pressable
                onPress={closeComments}
                hitSlop={10}
                style={styles.closeButton}
              >
                <Feather
                  name="x"
                  size={21}
                  color="#18241D"
                />
              </Pressable>
            </View>

            <View style={styles.headerDivider} />

            {loadingComments ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color="#08734B"
                />

                <AppText style={styles.loadingText}>
                  Loading comments...
                </AppText>
              </View>
            ) : (
              <FlatList
                data={currentComments}
                keyExtractor={(item) => item.id}
                renderItem={renderCommentItem}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                  currentComments.length === 0
                    ? styles.emptyList
                    : styles.commentsList
                }
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                      <Ionicons
                        name="chatbubble-outline"
                        size={28}
                        color="#08734B"
                      />
                    </View>

                    <AppText style={styles.emptyTitle}>
                      No comments yet
                    </AppText>

                    <AppText style={styles.emptySubtitle}>
                      Start the conversation.
                    </AppText>
                  </View>
                }
              />
            )}

            {/* Reply target indicator */}
            {replyToComment ? (
              <View style={styles.replyingToBar}>
                <AppText style={styles.replyingToText}>
                  Replying to{' '}
                  {replyToComment.author?.handle ||
                    replyToComment.author?.name ||
                    'comment'}
                </AppText>

                <Pressable
                  onPress={() => setReplyToComment(null)}
                  hitSlop={8}
                >
                  <Feather
                    name="x"
                    size={16}
                    color="#68766F"
                  />
                </Pressable>
              </View>
            ) : null}

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <View style={styles.inputAvatar}>
                <Feather
                  name="user"
                  size={17}
                  color="#08734B"
                />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder={
                    replyToComment
                      ? 'Write a reply...'
                      : 'Add a comment...'
                  }
                  placeholderTextColor="#9AA59F"
                  style={styles.commentInput}
                  multiline={false}
                  returnKeyType="send"
                  blurOnSubmit={false}
                  maxLength={1000}
                  editable={
                    !submittingComment && !isCommentPending
                  }
                  onSubmitEditing={handleAddComment}
                />

                <Pressable
                  onPress={handleAddComment}
                  disabled={
                    !commentText.trim() ||
                    submittingComment ||
                    isCommentPending
                  }
                  style={styles.postCommentButton}
                >
                  {submittingComment || isCommentPending ? (
                    <ActivityIndicator
                      size="small"
                      color="#08734B"
                    />
                  ) : (
                    <AppText
                      style={[
                        styles.postCommentText,
                        !commentText.trim() &&
                          styles.postCommentDisabled,
                      ]}
                    >
                      {replyToComment ? 'Reply' : 'Post'}
                    </AppText>
                  )}
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Image Viewer */}
      <ImageViewing
        images={imagePosts.map((post) => ({
          uri: post.image,
        }))}
        imageIndex={selectedPostIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        onImageIndexChange={setSelectedPostIndex}
        doubleTapToZoomEnabled
        swipeToCloseEnabled
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
  authorAvatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    backgroundColor: '#EAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
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
    height: 250,
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

  // Comments modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    zIndex: 1,
    elevation: 1,
  },
  commentsSheet: {
    height: '55%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    zIndex: 2,
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  handleArea: {
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#D5D9D7',
  },
  modalHeader: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18241D',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 5,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: '#84928A',
    marginTop: 12,
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingTop: 19,
    paddingBottom: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18241D',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#84928A',
    marginTop: 6,
    textAlign: 'center',
  },

  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 23,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 11,
  },
  commentAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  commentMain: {
    flex: 1,
    paddingRight: 7,
  },
  commentBubble: {
    flex: 1,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#262626',
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: '#262626',
  },
  commentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    gap: 15,
  },
  commentTime: {
    fontSize: 11,
    color: '#8E8E8E',
    fontWeight: '500',
  },
  replyLabel: {
    fontSize: 11,
    color: '#8E8E8E',
    fontWeight: '600',
  },
  deleteCommentText: {
    fontSize: 11,
    color: '#D93636',
    fontWeight: '600',
  },
  commentHeart: {
    width: 25,
    alignItems: 'center',
    paddingTop: 5,
  },

  replyCommentItem: {
    marginTop: 14,
    marginBottom: 12,
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 9,
  },
  repliesContainer: {
    marginTop: 2,
    paddingLeft: 2,
  },
  commentLikeCount: {
    fontSize: 10,
    color: '#8B9690',
    marginTop: 2,
    textAlign: 'center',
  },
  replyingToBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: '#F5F8F6',
    borderTopWidth: 1,
    borderTopColor: '#EEF1EF',
  },
  replyingToText: {
    fontSize: 11,
    color: '#68766F',
    fontWeight: '600',
  },

  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    paddingBottom: Platform.OS === 'ios' ? 22 : 12,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
  },
  inputAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  inputWrapper: {
    flex: 1,
    minHeight: 42,
    borderWidth: 1,
    borderColor: '#E5E8E6',
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 12,
  },
  commentInput: {
    flex: 1,
    height: 40,
    paddingVertical: 0,
    fontSize: 13,
    color: '#262626',
  },
  postCommentButton: {
    paddingLeft: 10,
    paddingVertical: 8,
  },
  postCommentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#08734B',
  },
  postCommentDisabled: {
    color: '#A9C8B8',
  },
});
