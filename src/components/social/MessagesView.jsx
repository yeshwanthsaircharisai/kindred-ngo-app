
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { AppText } from '@/components/ui';

const ACTIVE_PEOPLE = [
  {
    id: 'u-0',
    name: 'Your Note',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80',
    isNote: true,
  },
  {
    id: 'u-1',
    name: 'GreenEarth',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=160&auto=format&fit=crop&q=80',
    hasRing: true,
  },
  {
    id: 'u-2',
    name: 'EcoKindred',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=160&auto=format&fit=crop&q=80',
    hasRing: true,
  },
  {
    id: 'u-3',
    name: 'PawsAid',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    hasRing: true,
  },
];

const CONVERSATIONS = [
  {
    id: 'c-1',
    name: 'GreenEarth NGO',
    handle: '@greenearth',
    avatar: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=200&auto=format&fit=crop&q=80',
    verified: true,
    lastMessage: 'Thanks for your support!',
    time: '2m',
    unread: true,
  },
  {
    id: 'c-2',
    name: 'EcoKindred Team',
    handle: '@ecokindred',
    avatar: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&auto=format&fit=crop&q=80',
    verified: false,
    lastMessage: 'New volunteering event...',
    time: '12m',
    unread: true,
  },
  {
    id: 'c-3',
    name: 'Priya Sharma',
    handle: '@priyasharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    verified: false,
    lastMessage: 'Great post! 👏',
    time: '1h',
    unread: false,
  },
  {
    id: 'c-4',
    name: 'Rahul Kumar',
    handle: '@rahulkumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    verified: false,
    lastMessage: 'Let’s plan next drive?',
    time: '2h',
    unread: false,
  },
  {
    id: 'c-5',
    name: 'CareFeed NGO',
    handle: '@carefeed',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    verified: true,
    lastMessage: 'Event details attached.',
    time: '3h',
    unread: false,
  },
];

export default function MessagesView({ onOpenChat }) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredConversations = CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenConversation = (item) => {
    if (onOpenChat) {
      onOpenChat(item);
    } else {
      router.push({
        pathname: '/chat',
        params: { name: item.name },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header matching Reference Screen 6 */}
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Messages</AppText>
        <Pressable hitSlop={8} style={styles.composeBtn}>
          <Feather name="edit" size={21} color="#18241D" />
        </Pressable>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#8D9B93" style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search people..."
            placeholderTextColor="#8D9B93"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Horizontal Active People / Notes row */}
        <View style={styles.notesRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.notesScroll}
          >
            {ACTIVE_PEOPLE.map((person) => (
              <View key={person.id} style={styles.noteItem}>
                <View style={styles.avatarWrap}>
                  <View
                    style={[
                      styles.avatarBorder,
                      person.hasRing && styles.avatarBorderActive,
                    ]}
                  >
                    <Image
                      source={{ uri: person.avatar }}
                      style={styles.personAvatar}
                      contentFit="cover"
                    />
                  </View>
                  {person.isNote ? (
                    <View style={styles.addNotePlus}>
                      <Ionicons name="add" size={12} color="#FFFFFF" />
                    </View>
                  ) : null}
                </View>
                <AppText style={styles.personName} numberOfLines={1}>
                  {person.name}
                </AppText>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Conversation List */}
        <View style={styles.conversationsList}>
          {filteredConversations.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => handleOpenConversation(item)}
              style={({ pressed }) => [
                styles.conversationRow,
                pressed && { backgroundColor: '#F9FAF9' },
              ]}
            >
              <Image
                source={{ uri: item.avatar }}
                style={styles.convAvatar}
                contentFit="cover"
              />

              <View style={styles.convCenter}>
                <View style={styles.convNameRow}>
                  <AppText style={styles.convName}>{item.name}</AppText>
                  {item.verified ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={15}
                      color="#08734B"
                      style={{ marginLeft: 4 }}
                    />
                  ) : null}
                </View>
                <AppText style={styles.convSnippet} numberOfLines={1}>
                  {item.lastMessage}
                </AppText>
              </View>

              <View style={styles.convRight}>
                <AppText style={styles.convTime}>{item.time}</AppText>
                {item.unread ? <View style={styles.unreadDot} /> : <View style={{ height: 8 }} />}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Space for bottom navigation */}
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
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18241D',
  },
  composeBtn: {
    padding: 6,
  },
  searchWrapper: {
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F4',
    borderRadius: 22,
    height: 42,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#18241D',
    height: '100%',
  },
  scrollContent: {
    paddingTop: 4,
  },
  notesRow: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F5F3',
    paddingBottom: 14,
  },
  notesScroll: {
    paddingHorizontal: 16,
  },
  noteItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 6,
  },
  avatarBorder: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 2.5,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBorderActive: {
    borderColor: '#C4F135',
  },
  personAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  addNotePlus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#08734B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  personName: {
    fontSize: 11,
    color: '#55665E',
    textAlign: 'center',
    fontWeight: '500',
  },
  conversationsList: {
    paddingHorizontal: 18,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  convAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  convCenter: {
    flex: 1,
  },
  convNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  convName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#18241D',
  },
  convSnippet: {
    fontSize: 13,
    color: '#7B8A82',
  },
  convRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
  },
  convTime: {
    fontSize: 11,
    color: '#9EABA4',
    marginBottom: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#08734B',
  },
  bottomSpacer: {
    height: 100,
  },
});
