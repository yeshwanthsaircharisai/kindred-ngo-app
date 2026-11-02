import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { AppText } from '@/components/ui';
import { useSocialApp } from '@/context/SocialAppContext';

export default function NotificationsScreen({ onBack }) {
  const router = useRouter();
  const { notifications, markAllNotificationsRead } = useSocialApp();

  useEffect(() => {
    markAllNotificationsRead();
  }, []);

  const todayNotifs = notifications.filter((n) => n.section === 'Today');
  const earlierNotifs = notifications.filter((n) => n.section === 'Earlier');

  const renderNotifItem = (item) => (
    <View key={item.id} style={styles.notifRow}>
      {/* User Avatar or Group Icon */}
      {item.type === 'follow' ? (
        <View style={styles.leafIconCircle}>
          <Ionicons name="leaf" size={20} color="#34A853" />
        </View>
      ) : item.type === 'share' ? (
        <View style={styles.shareIconCircle}>
          <Feather name="share-2" size={18} color="#08734B" />
        </View>
      ) : (
        <Image
          source={{ uri: item.avatar }}
          style={styles.userAvatar}
          contentFit="cover"
        />
      )}

      {/* Action Text & Timestamp */}
      <View style={styles.textContainer}>
        <AppText style={styles.actionText}>
          <AppText style={styles.userName}>{item.user} </AppText>
          {item.action}
        </AppText>
        <AppText style={styles.timeText}>{item.time}</AppText>
      </View>

      {/* Right Thumbnail or Follow Button */}
      {item.isFollowButton ? (
        <Pressable style={styles.followBtn} hitSlop={6}>
          <AppText style={styles.followBtnText}>Follow</AppText>
        </Pressable>
      ) : item.thumbnail ? (
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.postThumbnail}
          contentFit="cover"
        />
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header matching Reference Screen 7 */}
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Activity</AppText>

        <View style={styles.bellWrap}>
          <Feather name="bell" size={22} color="#18241D" />
          <View style={styles.redBadge} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today Section */}
        {todayNotifs.length > 0 && (
          <View style={styles.section}>
            <AppText style={styles.sectionHeading}>Today</AppText>
            {todayNotifs.map(renderNotifItem)}
          </View>
        )}

        {/* Earlier Section */}
        {earlierNotifs.length > 0 && (
          <View style={styles.section}>
            <AppText style={styles.sectionHeading}>Earlier</AppText>
            {earlierNotifs.map(renderNotifItem)}
          </View>
        )}

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
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18241D',
  },
  bellWrap: {
    position: 'relative',
    padding: 4,
  },
  redBadge: {
    position: 'absolute',
    top: 2,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18241D',
    marginBottom: 12,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  leafIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shareIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  actionText: {
    fontSize: 13.5,
    lineHeight: 18,
    color: '#34453D',
  },
  userName: {
    fontWeight: '700',
    color: '#18241D',
  },
  timeText: {
    fontSize: 11.5,
    color: '#9EABA4',
    marginTop: 3,
  },
  followBtn: {
    backgroundColor: '#EAF7EE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#08734B',
  },
  postThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  bottomSpacer: {
    height: 100,
  },
});
