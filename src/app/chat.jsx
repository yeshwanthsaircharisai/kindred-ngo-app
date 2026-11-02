import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { AppText } from '@/components/ui';
import { FloatingGlassBottomNav } from '@/components/ui/FloatingGlassBottomNav';

const MOCK_MESSAGES = [
  {
    id: 'm-1',
    sender: 'them',
    text: 'Thank you for your support! 🌱',
    time: '9:15 AM',
  },
  {
    id: 'm-2',
    sender: 'me',
    text: 'Keep up the great work! 💚',
    time: '9:17 AM',
  },
  {
    id: 'm-3',
    sender: 'them',
    text: 'Together for a greener\nfuture! 🌍',
    time: '9:20 AM',
  },
];

export default function IndividualChatScreen({ onBack, user }) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userName = user?.name || params?.name || 'EcoWarriors NGO';

  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/main');
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Header matching Reference Screen 8 */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={10} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#18241D" />
        </Pressable>

        <Image
          source={{
            uri:
              user?.avatar ||
              'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
          }}
          style={styles.headerAvatar}
          contentFit="cover"
        />

        <View style={styles.headerInfo}>
          <View style={styles.headerNameRow}>
            <AppText style={styles.headerName}>{userName}</AppText>
            <Ionicons
              name="checkmark-circle"
              size={15}
              color="#08734B"
              style={{ marginLeft: 4 }}
            />
          </View>
          <AppText style={styles.statusText}>Online now</AppText>
        </View>

        <Pressable hitSlop={8} style={styles.moreBtn}>
          <Feather name="more-vertical" size={21} color="#18241D" />
        </Pressable>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        contentContainerStyle={styles.messagesScroll}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const isMe = msg.sender === 'me';

          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isMe ? styles.rowMe : styles.rowThem,
              ]}
            >
              {!isMe ? (
                <Image
                  source={{
                    uri:
                      user?.avatar ||
                      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=160&auto=format&fit=crop&q=80',
                  }}
                  style={styles.chatAvatar}
                  contentFit="cover"
                />
              ) : null}

              <View style={isMe ? styles.bubbleWrapperMe : styles.bubbleWrapperThem}>
                <View
                  style={[
                    styles.bubble,
                    isMe ? styles.bubbleMe : styles.bubbleThem,
                  ]}
                >
                  <AppText
                    style={[
                      styles.messageText,
                      isMe ? styles.textMe : styles.textThem,
                    ]}
                  >
                    {msg.text}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.timeRow,
                    isMe ? styles.timeRowMe : styles.timeRowThem,
                  ]}
                >
                  <AppText style={styles.timeText}>{msg.time}</AppText>
                  {isMe ? (
                    <Ionicons
                      name="checkmark-done"
                      size={15}
                      color="#34A853"
                      style={{ marginLeft: 4 }}
                    />
                  ) : null}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Message Input Bar matching Reference Screen 8 */}
      <View style={styles.inputBar}>
        <View style={styles.inputWrapper}>
          <Pressable hitSlop={6} style={styles.attachBtn}>
            <Ionicons name="attach" size={20} color="#8D9B93" />
          </Pressable>

          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#8D9B93"
            style={styles.textInput}
          />
        </View>

        <Pressable onPress={handleSend} style={styles.sendBtn} hitSlop={6}>
          <Feather
            name="send"
            size={18}
            color="#FFFFFF"
            style={{ transform: [{ rotate: '15deg' }] }}
          />
        </Pressable>
      </View>

      {/* Bottom Nav Bar on Chat screen matching reference */}
      <FloatingGlassBottomNav
        activeTab="messages"
        onSelectTab={(tab) => {
          if (onBack) onBack();
          router.replace('/main');
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F5F3',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 4,
    marginRight: 6,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#18241D',
  },
  statusText: {
    fontSize: 11,
    color: '#8D9B93',
    marginTop: 1,
  },
  moreBtn: {
    padding: 6,
  },
  messagesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  rowThem: {
    justifyContent: 'flex-start',
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  chatAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 16,
  },
  bubbleWrapperThem: {
    maxWidth: '72%',
  },
  bubbleWrapperMe: {
    maxWidth: '72%',
    alignItems: 'flex-end',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleThem: {
    backgroundColor: '#F1F4F2',
    borderBottomLeftRadius: 4,
  },
  bubbleMe: {
    backgroundColor: '#E2F7CB',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 19,
  },
  textThem: {
    color: '#18241D',
  },
  textMe: {
    color: '#18241D',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeRowThem: {
    justifyContent: 'flex-end',
  },
  timeRowMe: {
    justifyContent: 'flex-end',
  },
  timeText: {
    fontSize: 10.5,
    color: '#9EABA4',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F5F3',
    backgroundColor: '#FFFFFF',
    marginBottom: Platform.OS === 'ios' ? 10 : 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F4',
    borderRadius: 22,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 10,
  },
  attachBtn: {
    padding: 4,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#18241D',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F6941',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
