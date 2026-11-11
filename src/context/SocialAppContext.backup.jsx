
import { useAuth } from '@/context/AuthContext';
import supabase from '@/lib/supabase';
import { createContext, useContext, useEffect, useState } from 'react';

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

// Initial posts
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
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
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
  followersCount: '1.2K',
  followingCount: '342',
  photos: [
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
  ],
};

const SocialAppContext = createContext(null);

export function SocialAppProvider({ children }) {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [reels, setReels] = useState(INITIAL_REELS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [profile, setProfile] = useState(INITIAL_USER_PROFILE);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2);

  const { user } = useAuth();

  // Fetch the authenticated user's profile from Supabase.
  useEffect(() => {
    let cancelled = false;

    // Clear personal profile information when logged out.
    if (!user?.id) {
      setProfile({
        ...INITIAL_USER_PROFILE,
        name: '',
        handle: '',
        avatar: '',
        bio: '',
      });

      return () => {
        cancelled = true;
      };
    }

    const emailPrefix = user.email?.split('@')[0] || '';

    // Safe fallback using the current authenticated user's information.
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
    };

    // Immediately show the current user's fallback information.
    setProfile(fallbackProfile);

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, bio, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.warn(
            '[SocialApp] Profile fetch error:',
            error.message
          );
          return;
        }

        // Keep fallback data if no database row exists.
        if (!data) return;

        const mappedProfile = {
          ...fallbackProfile,
          name: data.full_name ?? fallbackProfile.name,
          handle: data.username
            ? `@${data.username.replace(/^@/, '')}`
            : fallbackProfile.handle,
          avatar: data.avatar_url ?? fallbackProfile.avatar,
          bio: data.bio ?? fallbackProfile.bio,
        };

        if (!cancelled) {
          setProfile(mappedProfile);
        }
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

    // Cancel old requests when the user changes or logs out.
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Toggle post like
  const toggleLikePost = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  // Toggle post save
  const toggleSavePost = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isSaved: !p.isSaved } : p
      )
    );
  };

  // Add a new post
  const addPost = ({ caption, image, location, category }) => {
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        name: profile.name,
        handle: profile.handle,
        avatar: profile.avatar,
        verified: true,
      },
      location: location || 'Kindred Community Drive',
      timeAgo: 'Just now',
      image:
        image ||
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1080&auto=format&fit=crop&q=80',
      caption: caption || 'Supporting community welfare with Kindred! 🌱',
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: true,
      isSaved: false,
      category: category || 'Volunteering',
    };

    setPosts((prev) => [newPost, ...prev]);

    setProfile((prev) => ({
      ...prev,
      postsCount: prev.postsCount + 1,
    }));

    return newPost;
  };

  // Toggle reel like
  const toggleLikeReel = (reelId) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likesCount: isLiked ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  // Mark all notifications as read
  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setUnreadNotificationsCount(0);
  };

  return (
    <SocialAppContext.Provider
      value={{
        posts,
        reels,
        notifications,
        profile,
        unreadNotificationsCount,
        toggleLikePost,
        toggleSavePost,
        addPost,
        toggleLikeReel,
        markAllNotificationsRead,
      }}
    >
      {children}
    </SocialAppContext.Provider>
  );
}

export function useSocialApp() {
  const context = useContext(SocialAppContext);

  if (!context) {
    throw new Error(
      'useSocialApp must be used within a SocialAppProvider'
    );
  }

  return context;
}
