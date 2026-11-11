import { useAuth } from '@/context/AuthContext';
import supabase from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// Initial stories
export const INITIAL_STORIES = [
  {
    id: 's-0',
    name: 'Your Story',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    hasUnseen: true,
    isSelf: true,
  },
  {
    id: 's-1',
    name: 'EcoKindred',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=160&auto=format&fit=crop&q=80',
    hasUnseen: true,
  },
  {
    id: 's-2',
    name: 'GreenEarth',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160&auto=format&fit=crop&q=80',
    hasUnseen: true,
  },
  {
    id: 's-3',
    name: 'PawsAid',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    hasUnseen: true,
  },
  {
    id: 's-4',
    name: 'CareFeed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    hasUnseen: false,
  },
];

// Initial posts (fallback/demo data)
export const INITIAL_POSTS = [
  {
    id: 'post-1',
    author: {
      name: 'EcoWarriors NGO',
      handle: '@ecowarriors',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      verified: true,
    },
    location: 'Bangaloer',
    timeAgo: '2h ago',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1080&auto=format&fit=crop&q=80',
    caption: 'Planting 1,200 native saplings with over 80 vibrant volunteers this sunny morning.\n#GreenIndia #TreePlantation #EcoDrive',
    likesCount: 342,
    commentsCount: 28,
    sharesCount: 14,
    isLiked: true,
    isSaved: false,
    isFollowing: false,
    category: 'Environment',
  },
  {
    id: 'post-2',
    author: {
      name: 'Annamma Feed Trust',
      handle: '@feedtrust',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      verified: true,
    },
    location: 'Chennai',
    timeAgo: '4h ago',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1080&auto=format&fit=crop&q=80',
    caption: 'Together for a hunger-free tomorrow ❤️',
    likesCount: 512,
    commentsCount: 46,
    sharesCount: 39,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    category: 'Food Relief',
  },
  {
    id: 'post-3',
    author: {
      name: 'Paws & Tails Shelter',
      handle: '@paws_tails',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      verified: false,
    },
    location: 'Kindred Animal Sanctuary',
    timeAgo: '6h ago',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1080&auto=format&fit=crop&q=80',
    caption: 'Little Buster found his forever loving home today through Kindred adoption network! Wishing them endless joyful cuddles. 🐶🐾',
    likesCount: 890,
    commentsCount: 64,
    sharesCount: 52,
    isLiked: false,
    isSaved: false,
    category: 'Animal Welfare',
  },
  {
    id: 'post-4',
    author: {
      name: 'Ignite Vidya Learning',
      handle: '@ignitevidya',
      avatar: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&auto=format&fit=crop&q=80',
      verified: true,
    },
    location: 'Community Center Library',
    timeAgo: '1d ago',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1080&auto=format&fit=crop&q=80',
    caption: 'Weekend digital literacy workshop for 60 young minds. Knowledge empowers our next generation! 📚✨',
    likesCount: 420,
    commentsCount: 19,
    sharesCount: 11,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    category: 'Education',
  },
];

// Initial reels
export const INITIAL_REELS = [
  {
    id: 'reel-1',
    creator: {
      name: 'GreenEarth NGO',
      handle: '@greenearth',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
      verified: true,
    },
    caption: 'A greener tomorrow\nstarts with you. 🌱\n#GoGreen #Nature #Kindred',
    music: 'Original Audio',
    likesCount: '12.8K',
    commentsCount: '423',
    sharesCount: '1.2K',
    isLiked: false,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1080&auto=format&fit=crop&q=80',
  },
];

// Initial notifications
export const INITIAL_NOTIFICATIONS = [
  {
    id: 'n-1',
    user: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    action: 'liked your post',
    time: '2m ago',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=120&auto=format&fit=crop&q=80',
    type: 'like',
    section: 'Today',
    read: false,
  },
  {
    id: 'n-2',
    user: 'GreenEarth NGO',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    action: 'started following you',
    time: '15m ago',
    type: 'follow',
    isFollowButton: true,
    section: 'Today',
    read: false,
  },
  {
    id: 'n-3',
    user: 'Rahul Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211161-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    action: 'commented:\n"Great initiative!"',
    time: '1h ago',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80',
    type: 'comment',
    section: 'Today',
    read: true,
  },
  {
    id: 'n-4',
    user: 'CareFeed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    action: 'shared your post',
    time: '2h ago',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=120&auto=format&fit=crop&q=80',
    type: 'share',
    section: 'Today',
    read: true,
  },
  {
    id: 'n-5',
    user: 'Ananya Reddy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    action: 'liked your post',
    time: '1d ago',
    thumbnail: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=120&auto=format&fit=crop&q=80',
    type: 'like',
    section: 'Earlier',
    read: true,
  },
];

// Initial profile structure
export const INITIAL_USER_PROFILE = {
  name: 'Yeshwanth Sai R',
  handle: '@yeshwanthsair',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  bio: 'Building a kinder, greener world 🌱\nTech • Community • Impact',
  postsCount: '24',
  followersCount: 0,
  followingCount: 0,
  photos: [
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
  ],
};

const getTimeAgo = (dateString) => {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );

  if (!Number.isFinite(seconds) || seconds < 0) return 'Just now';
  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateString).toLocaleDateString();
};

const SocialAppContext = createContext(null);

export function SocialAppProvider({ children }) {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState(null);

  const [pendingLikes, setPendingLikes] = useState([]);

  // Follow system state
  const [followingIds, setFollowingIds] = useState([]);
  const [pendingFollows, setPendingFollows] = useState([]);

  const followingIdsRef = useRef([]);
  const pendingFollowsRef = useRef(new Set());

  // Comments state
  const [commentsByPost, setCommentsByPost] = useState({});
  const [pendingComments, setPendingComments] = useState([]);

  const [reels, setReels] = useState(INITIAL_REELS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [profile, setProfile] = useState(INITIAL_USER_PROFILE);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2);

  const { user } = useAuth();

  // Keep the following IDs ref synchronized.
  useEffect(() => {
    followingIdsRef.current = followingIds;
  }, [followingIds]);

  // Fetch the accounts followed by the logged-in user.
  useEffect(() => {
    let cancelled = false;

    const fetchFollowing = async () => {
      if (!user?.id) {
        setFollowingIds([]);
        followingIdsRef.current = [];
        setPendingFollows([]);
        pendingFollowsRef.current.clear();
        return;
      }

      try {
        const { data, error } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', user.id);

        if (error) throw error;
        if (cancelled) return;

        const ids = (data || []).map((row) => row.following_id);

        setFollowingIds(ids);
        followingIdsRef.current = ids;
      } catch (error) {
        console.error('[Follows] Could not fetch following list:', error);
      }
    };

    fetchFollowing();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Fetch real follower and following totals.
  const refreshFollowCounts = async () => {
    if (!user?.id) return;

    const [followersResult, followingResult] = await Promise.all([
      supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', user.id),

      supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', user.id),
    ]);

    if (followersResult.error) throw followersResult.error;
    if (followingResult.error) throw followingResult.error;

    setProfile((prev) => ({
      ...prev,
      followersCount: followersResult.count || 0,
      followingCount: followingResult.count || 0,
    }));
  };

  // Load the follow counts when the authenticated user changes.
  useEffect(() => {
    if (!user?.id) {
      setProfile((prev) => ({
        ...prev,
        followersCount: 0,
        followingCount: 0,
      }));
      return;
    }

    refreshFollowCounts().catch((error) => {
      console.error('[Follows] Could not fetch follow counts:', error);
    });
  }, [user?.id]);

  // Follow or unfollow a user and save the change in Supabase.
  const toggleFollow = async (targetUserId) => {
    if (!user?.id) {
      throw new Error('Please log in to follow people.');
    }

    if (!targetUserId) {
      throw new Error('The account to follow is invalid.');
    }

    if (targetUserId === user.id) {
      throw new Error('You cannot follow yourself.');
    }

    if (pendingFollowsRef.current.has(targetUserId)) return;

    const wasFollowing = followingIdsRef.current.includes(targetUserId);
    const previousIds = [...followingIdsRef.current];

    pendingFollowsRef.current.add(targetUserId);

    setPendingFollows((prev) => [...prev, targetUserId]);

    const optimisticIds = wasFollowing
      ? previousIds.filter((id) => id !== targetUserId)
      : [...previousIds, targetUserId];

    followingIdsRef.current = optimisticIds;
    setFollowingIds(optimisticIds);

    try {
      if (wasFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId,
          });

        if (error && error.code !== '23505') {
          throw error;
        }
      }

      await refreshFollowCounts();

      return !wasFollowing;
    } catch (error) {
      followingIdsRef.current = previousIds;
      setFollowingIds(previousIds);

      console.error('[Follows] Follow update failed:', error);
      throw error;
    } finally {
      pendingFollowsRef.current.delete(targetUserId);

      setPendingFollows((prev) =>
        prev.filter((id) => id !== targetUserId)
      );
    }
  };

  // Update the authenticated user's profile in Supabase.
  const updateProfile = async ({ name, username, bio, avatar }) => {
    if (!user?.id) {
      throw new Error('Please log in to update your profile.');
    }

    const cleanName = (name || '').trim();
    const cleanUsername = (username || '').trim().replace(/^@/, '');
    const cleanBio = (bio || '').trim();

    if (!cleanName) throw new Error('Full name cannot be empty.');
    if (!cleanUsername) throw new Error('Username cannot be empty.');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: cleanName,
        username: cleanUsername,
        bio: cleanBio,
        avatar_url: avatar || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('id, full_name, username, bio, avatar_url')
      .single();

    if (error) throw error;

    setProfile((prev) => ({
      ...prev,
      name: data.full_name || '',
      handle: data.username ? `@${data.username}` : '',
      bio: data.bio || '',
      avatar: data.avatar_url || '',
    }));

    return data;
  };

  // Upload the user's profile picture to Supabase Storage.
  const uploadAvatar = async (imageUri) => {
    if (!user?.id) {
      throw new Error('Please log in to upload a profile picture.');
    }

    if (!imageUri) {
      throw new Error('Please select an image first.');
    }

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (!base64) {
      throw new Error('Could not read the selected image.');
    }

    const arrayBuffer = decode(base64);

    const extension = imageUri
      .split('.')
      .pop()
      ?.split('?')[0]
      ?.toLowerCase();

    const safeExtension = ['jpg', 'jpeg', 'png', 'webp'].includes(extension)
      ? extension
      : 'jpg';

    const contentType =
      safeExtension === 'png'
        ? 'image/png'
        : safeExtension === 'webp'
          ? 'image/webp'
          : 'image/jpeg';

    const filePath = `${user.id}/avatar-${Date.now()}.${safeExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Upload a post image to Supabase Storage.
  const uploadPostImage = async (imageUri) => {
    if (!user?.id) {
      throw new Error('Please log in to upload a post image.');
    }

    if (!imageUri) {
      throw new Error('Please select an image first.');
    }

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (!base64) {
      throw new Error('Could not read the selected post image.');
    }

    const arrayBuffer = decode(base64);

    const extension = imageUri
      .split('.')
      .pop()
      ?.split('?')[0]
      ?.toLowerCase();

    const safeExtension = ['jpg', 'jpeg', 'png', 'webp'].includes(extension)
      ? extension
      : 'jpg';

    const contentType =
      safeExtension === 'png'
        ? 'image/png'
        : safeExtension === 'webp'
          ? 'image/webp'
          : 'image/jpeg';

    const filePath = `${user.id}/post-${Date.now()}.${safeExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(filePath, arrayBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Fetch the authenticated user's profile from Supabase.
  useEffect(() => {
    let cancelled = false;

    if (!user?.id) {
      setProfile({
        ...INITIAL_USER_PROFILE,
        name: '',
        handle: '',
        avatar: '',
        bio: '',
        followersCount: 0,
        followingCount: 0,
      });

      return () => {
        cancelled = true;
      };
    }

    const emailPrefix = user.email?.split('@')[0] || '';

    const fallbackProfile = {
      ...INITIAL_USER_PROFILE,
      name: user.user_metadata?.full_name || emailPrefix,
      handle: user.user_metadata?.username
        ? `@${user.user_metadata.username.replace(/^@/, '')}`
        : emailPrefix
          ? `@${emailPrefix}`
          : '',
      avatar: user.user_metadata?.avatar_url || '',
      bio: '',
      followersCount: 0,
      followingCount: 0,
    };

    setProfile((prev) => ({
      ...fallbackProfile,
      followersCount: prev.followersCount || 0,
      followingCount: prev.followingCount || 0,
    }));

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, bio, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.warn('[SocialApp] Profile fetch error:', error.message);
          return;
        }

        if (!data) return;

        setProfile((prev) => ({
          ...fallbackProfile,
          ...prev,
          name: data.full_name ?? fallbackProfile.name,
          handle: data.username
            ? `@${data.username.replace(/^@/, '')}`
            : fallbackProfile.handle,
          avatar: data.avatar_url ?? fallbackProfile.avatar,
          bio: data.bio ?? fallbackProfile.bio,
        }));
      } catch (error) {
        if (!cancelled) {
          console.warn(
            '[SocialApp] Unexpected profile fetch error:',
            error
          );
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Fetch posts, authors, like counts and comment counts.
  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      if (!user?.id) {
        setPosts(INITIAL_POSTS);
        setCommentsByPost({});
        setIsLoadingPosts(false);
        setPostsError(null);
        return;
      }

      setIsLoadingPosts(true);
      setPostsError(null);

      try {
        const { data: postRows, error: postError } = await supabase
          .from('posts')
          .select('id, user_id, caption, image_url, created_at')
          .order('created_at', { ascending: false });

        if (postError) throw postError;
        if (cancelled) return;

        if (!postRows || postRows.length === 0) {
          setPosts([]);
          setCommentsByPost({});
          return;
        }

        const userIds = [...new Set(postRows.map((post) => post.user_id))];
        const postIds = postRows.map((post) => post.id);

        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .in('id', userIds);

        if (profileError) throw profileError;
        if (cancelled) return;

        // Fetch likes.
        const { data: likeRows, error: likesError } = await supabase
          .from('post_likes')
          .select('post_id, user_id')
          .in('post_id', postIds);

        if (likesError) throw likesError;
        if (cancelled) return;

        // Fetch comment counts.
        const { data: commentRows, error: commentsError } = await supabase
          .from('post_comments')
          .select('post_id')
          .in('post_id', postIds);

        if (commentsError) throw commentsError;
        if (cancelled) return;

        const likesMap = new Map();
        const commentsCountMap = new Map();

        postRows.forEach((post) => {
          likesMap.set(post.id, {
            count: 0,
            isLiked: false,
          });

          commentsCountMap.set(post.id, 0);
        });

        (likeRows || []).forEach((like) => {
          const current = likesMap.get(like.post_id);

          if (current) {
            current.count += 1;

            if (like.user_id === user.id) {
              current.isLiked = true;
            }
          }
        });

        (commentRows || []).forEach((comment) => {
          commentsCountMap.set(
            comment.post_id,
            (commentsCountMap.get(comment.post_id) || 0) + 1
          );
        });

        const profileMap = new Map(
          (profiles || []).map((item) => [item.id, item])
        );

        const mappedPosts = postRows.map((post) => {
          const authorProfile = profileMap.get(post.user_id);
          const postLikes = likesMap.get(post.id);

          return {
            id: post.id,
            userId: post.user_id,
            author: {
              name: authorProfile?.full_name || 'Kindred Member',
              handle: authorProfile?.username
                ? `@${authorProfile.username.replace(/^@/, '')}`
                : '@kindredmember',
              avatar: authorProfile?.avatar_url || '',
              verified: false,
            },
            location: '',
            timeAgo: getTimeAgo(post.created_at),
            image: post.image_url || null,
            caption: post.caption || '',
            likesCount: postLikes?.count || 0,
            commentsCount: commentsCountMap.get(post.id) || 0,
            sharesCount: 0,
            isLiked: postLikes?.isLiked || false,
            isSaved: false,
            isFollowing: false,
            category: 'Community',
          };
        });

        setPosts(mappedPosts);
      } catch (error) {
        console.error('[SocialApp] Posts fetch error:', error);

        if (!cancelled) {
          setPostsError(error.message || 'Could not load posts.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPosts(false);
        }
      }
    };

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Delete a post and its associated Storage image.
  const deletePost = async (postId) => {
    if (!user?.id) {
      throw new Error('Please log in to delete a post.');
    }

    if (!postId) {
      throw new Error('Invalid post.');
    }

    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('id, user_id, image_url')
      .eq('id', postId)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('[DeletePost] Post fetch failed:', fetchError);
      throw fetchError;
    }

    if (post.image_url) {
      const marker = '/storage/v1/object/public/post-images/';
      const markerIndex = post.image_url.indexOf(marker);

      if (markerIndex !== -1) {
        let filePath;

        try {
          filePath = decodeURIComponent(
            post.image_url
              .substring(markerIndex + marker.length)
              .split('?')[0]
          );
        } catch (error) {
          console.error('[DeletePost] Could not decode image path:', error);
          throw new Error('Could not read the post image path.');
        }

        if (!filePath.startsWith(`${user.id}/`)) {
          throw new Error(
            'The image does not belong to the logged-in user. The post was not deleted.'
          );
        }

        const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
        const fileName = filePath.split('/').pop();

        const { data: existingFiles, error: listError } =
          await supabase.storage
            .from('post-images')
            .list(folderPath);

        if (listError) {
          throw new Error(
            `Storage folder listing failed: ${listError.message}`
          );
        }

        const fileExists = (existingFiles || []).some(
          (file) => file.name === fileName
        );

        if (!fileExists) {
          throw new Error(
            'Image not found in the listed Storage folder. Check the folder contents in the console.'
          );
        }

        const { data: storageData, error: storageError } =
          await supabase.storage
            .from('post-images')
            .remove([filePath]);

        if (storageError) {
          throw new Error(
            `Storage deletion failed: ${storageError.message}. The post was not deleted.`
          );
        }

        if (!Array.isArray(storageData) || storageData.length === 0) {
          throw new Error(
            'Supabase returned no deleted objects. The post was not deleted.'
          );
        }
      }
    }

    const { data: deletedPost, error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle();

    if (deleteError) {
      console.error('[DeletePost] Database deletion failed:', deleteError);
      throw deleteError;
    }

    if (!deletedPost) {
      throw new Error('The post could not be deleted from the database.');
    }

    setPosts((prev) => prev.filter((item) => item.id !== postId));

    setCommentsByPost((prev) => {
      const updated = { ...prev };
      delete updated[postId];
      return updated;
    });

    setProfile((prev) => ({
      ...prev,
      postsCount: Math.max(0, Number(prev.postsCount || 0) - 1),
    }));

    console.log('[DeletePost] Post and associated image deletion completed.');
  };

  // Toggle post like using Supabase.
  const toggleLikePost = async (postId) => {
    if (!user?.id) {
      throw new Error('Please log in to like a post.');
    }

    const post = posts.find((item) => item.id === postId);

    if (!post) throw new Error('Post not found.');

    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid post ID.');
    }

    if (pendingLikes.includes(postId)) return;

    setPendingLikes((prev) => [...prev, postId]);

    try {
      if (post.isLiked) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;

        setPosts((prev) =>
          prev.map((item) =>
            item.id === postId
              ? {
                  ...item,
                  isLiked: false,
                  likesCount: Math.max(0, item.likesCount - 1),
                }
              : item
          )
        );
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id,
          });

        if (error && error.code !== '23505') throw error;

        setPosts((prev) =>
          prev.map((item) =>
            item.id === postId
              ? {
                  ...item,
                  isLiked: true,
                  likesCount:
                    error?.code === '23505'
                      ? item.likesCount
                      : item.likesCount + 1,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error('[PostLikes] Error:', error);
      throw error;
    } finally {
      setPendingLikes((prev) =>
        prev.filter((id) => id !== postId)
      );
    }
  };

  // Fetch comments, replies, and comment likes for a particular post.
  const fetchComments = async (postId) => {
    if (!user?.id) {
      throw new Error('Please log in to view comments.');
    }

    if (!postId) throw new Error('Invalid post ID.');

    const { data: commentRows, error } = await supabase
      .from('post_comments')
      .select('id, post_id, user_id, content, created_at, parent_comment_id')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const commentIds = (commentRows || []).map((comment) => comment.id);

    const userIds = [
      ...new Set((commentRows || []).map((comment) => comment.user_id)),
    ];

    let profiles = [];
    let likeRows = [];

    if (userIds.length > 0) {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .in('id', userIds);

      if (profileError) throw profileError;

      profiles = data || [];
    }

    if (commentIds.length > 0) {
      const { data, error: likesError } = await supabase
        .from('comment_likes')
        .select('comment_id, user_id')
        .in('comment_id', commentIds);

      if (likesError) throw likesError;

      likeRows = data || [];
    }

    const profileMap = new Map(
      profiles.map((item) => [item.id, item])
    );

    const likesMap = new Map();

    likeRows.forEach((like) => {
      const current = likesMap.get(like.comment_id) || {
        count: 0,
        isLiked: false,
      };

      current.count += 1;

      if (like.user_id === user.id) {
        current.isLiked = true;
      }

      likesMap.set(like.comment_id, current);
    });

    const mappedComments = (commentRows || []).map((comment) => {
      const author = profileMap.get(comment.user_id);

      const likes = likesMap.get(comment.id) || {
        count: 0,
        isLiked: false,
      };

      return {
        id: comment.id,
        postId: comment.post_id,
        userId: comment.user_id,
        parentCommentId: comment.parent_comment_id || null,
        content: comment.content,
        createdAt: comment.created_at,
        timeAgo: getTimeAgo(comment.created_at),
        author: {
          name: author?.full_name || 'Kindred Member',
          handle: author?.username
            ? `@${author.username.replace(/^@/, '')}`
            : '@kindredmember',
          avatar: author?.avatar_url || '',
        },
        isOwnComment: comment.user_id === user.id,
        likesCount: likes.count,
        isLiked: likes.isLiked,
        replies: [],
      };
    });

    // Keep replies one level deep and attach them to their parent comment.
    const commentsById = new Map(
      mappedComments.map((comment) => [comment.id, comment])
    );

    const rootComments = [];

    mappedComments.forEach((comment) => {
      if (comment.parentCommentId) {
        const parent = commentsById.get(comment.parentCommentId);

        if (parent) {
          parent.replies.push(comment);
        } else {
          rootComments.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: rootComments,
    }));

    return rootComments;
  };

  // Add a top-level comment or a one-level reply to a post.
  const addComment = async (postId, content, parentCommentId = null) => {
    if (!user?.id) {
      throw new Error('Please log in to comment.');
    }

    const cleanContent = (content || '').trim();

    if (!cleanContent) {
      throw new Error('Comment cannot be empty.');
    }

    if (!postId) throw new Error('Invalid post ID.');

    if (pendingComments.includes(postId)) return null;

    setPendingComments((prev) => [...prev, postId]);

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: cleanContent,
          parent_comment_id: parentCommentId || null,
        })
        .select('id, post_id, user_id, content, created_at, parent_comment_id')
        .single();

      if (error) throw error;

      await fetchComments(postId);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                commentsCount: (post.commentsCount || 0) + 1,
              }
            : post
        )
      );

      console.log('[PostComments] Comment added:', data.id);

      return data;
    } catch (error) {
      console.error('[PostComments] Add comment error:', error);
      throw error;
    } finally {
      setPendingComments((prev) =>
        prev.filter((id) => id !== postId)
      );
    }
  };

  // Like or unlike a comment using the comment_likes table.
  const toggleLikeComment = async (commentId, postId) => {
    if (!user?.id) {
      throw new Error('Please log in to like a comment.');
    }

    if (!commentId || !postId) {
      throw new Error('Invalid comment.');
    }

    const postComments = commentsByPost[postId] || [];

    const findComment = (items) => {
      for (const item of items) {
        if (item.id === commentId) return item;

        const nested = findComment(item.replies || []);

        if (nested) return nested;
      }

      return null;
    };

    const target = findComment(postComments);

    if (!target) {
      throw new Error('Comment not found. Refresh and try again.');
    }

    if (target.isLiked) {
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: user.id,
        });

      if (error && error.code !== '23505') throw error;
    }

    const nextLiked = !target.isLiked;

    const updateLikes = (items) =>
      items.map((item) => {
        if (item.id === commentId) {
          return {
            ...item,
            isLiked: nextLiked,
            likesCount: Math.max(
              0,
              (item.likesCount || 0) + (nextLiked ? 1 : -1)
            ),
          };
        }

        return {
          ...item,
          replies: updateLikes(item.replies || []),
        };
      });

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: updateLikes(prev[postId] || []),
    }));
  };

  // Delete a comment written by the logged-in user.
  const deleteComment = async (commentId, postId) => {
    if (!user?.id) {
      throw new Error('Please log in to delete a comment.');
    }

    if (!commentId || !postId) {
      throw new Error('Invalid comment.');
    }

    const { data, error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error(
        'Comment not found or you cannot delete this comment.'
      );
    }

    let removedCount = 0;

    const removeComment = (items) =>
      items.reduce((result, comment) => {
        if (comment.id === commentId) {
          removedCount += 1 + (comment.replies || []).length;
          return result;
        }

        result.push({
          ...comment,
          replies: removeComment(comment.replies || []),
        });

        return result;
      }, []);

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: removeComment(prev[postId] || []),
    }));

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentsCount: Math.max(
                0,
                (post.commentsCount || 0) - removedCount
              ),
            }
          : post
      )
    );

    console.log('[PostComments] Comment deleted:', commentId);

    return true;
  };

  // Toggle post save (local state for now).
  const toggleSavePost = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
  };

  // Create a post in Supabase.
  const addPost = async ({ caption, image, location, category }) => {
    if (!user?.id) {
      throw new Error('Please log in to create a post.');
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        caption: caption?.trim() || '',
        image_url: image || null,
      })
      .select('id, user_id, caption, image_url, created_at')
      .single();

    if (error) throw error;

    const newPost = {
      id: data.id,
      userId: data.user_id,
      author: {
        name: profile.name,
        handle: profile.handle,
        avatar: profile.avatar,
        verified: false,
      },
      location: location || '',
      timeAgo: getTimeAgo(data.created_at),
      image: data.image_url,
      caption: data.caption,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      isFollowing: false,
      category: category || 'Community',
    };

    setPosts((prev) => [newPost, ...prev]);

    setProfile((prev) => ({
      ...prev,
      postsCount: Number(prev.postsCount || 0) + 1,
    }));

    return newPost;
  };

  // Toggle reel like (local state for now).
  const toggleLikeReel = (reelId) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const isLiked = !reel.isLiked;

          return {
            ...reel,
            isLiked,
            likesCount: isLiked
              ? reel.likesCount + 1
              : reel.likesCount - 1,
          };
        }

        return reel;
      })
    );
  };

  // Mark all notifications as read (local state for now).
  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    setUnreadNotificationsCount(0);
  };

  return (
    <SocialAppContext.Provider
      value={{
        posts,
        isLoadingPosts,
        postsError,
        reels,
        notifications,
        profile,
        updateProfile,

        // Follow system
        followingIds,
        pendingFollows,
        toggleFollow,
        refreshFollowCounts,

        uploadAvatar,
        uploadPostImage,
        unreadNotificationsCount,
        toggleLikePost,
        toggleSavePost,
        addPost,
        deletePost,
        toggleLikeReel,
        markAllNotificationsRead,

        // Comments
        commentsByPost,
        pendingComments,
        fetchComments,
        addComment,
        toggleLikeComment,
        deleteComment,
      }}
    >
      {children}
    </SocialAppContext.Provider>
  );
}

export function useSocialApp() {
  const context = useContext(SocialAppContext);

  if (!context) {
    throw new Error('useSocialApp must be used within a SocialAppProvider');
  }

  return context;
}

export default SocialAppProvider;