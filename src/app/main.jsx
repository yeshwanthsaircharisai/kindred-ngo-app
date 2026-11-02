
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/ui';
import { FloatingGlassBottomNav } from '@/components/ui/FloatingGlassBottomNav';

import colors from '@/constants/colors';

import CreatePostView from '@/components/social/CreatePostView';
import ExploreView from '@/components/social/ExploreView';
import HomeFeedView from '@/components/social/HomeFeedView';
import MessagesView from '@/components/social/MessagesView';
import ProfileView from '@/components/social/ProfileView';
import ReelsView from '@/components/social/ReelsView';
import IndividualChatScreen from './chat';
import ActivityScreen from './notifications';

export default function MainAppScreen() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeChatUser, setActiveChatUser] = useState(null);

  const isReels = activeTab === 'reels';
  const isActivity = activeTab === 'activity';
  const isIndividualChat = Boolean(activeChatUser);

  return (
    <AppScreen
      safe={!isReels}
      padding={false}
      backgroundColor={isReels ? '#000000' : '#FFFFFF'}
      statusBarStyle={isReels ? 'light' : 'dark'}
      style={styles.screen}
    >
      <View style={styles.contentContainer}>
        {isIndividualChat ? (
          <IndividualChatScreen
            user={activeChatUser}
            onBack={() => setActiveChatUser(null)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeFeedView
                onNavigateCreate={() => setActiveTab('create')}
                onNavigateNotifications={() => setActiveTab('activity')}
                onNavigateActivity={() => setActiveTab('activity')}
              />
            )}

            {activeTab === 'explore' && <ExploreView />}

            {activeTab === 'messages' && (
              <MessagesView
                onOpenChat={(user) => setActiveChatUser(user)}
              />
            )}

            {activeTab === 'create' && (
              <CreatePostView
                onPostCreated={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'reels' && <ReelsView />}

            {activeTab === 'profile' && <ProfileView />}

            {activeTab === 'activity' && (
              <ActivityScreen onBack={() => setActiveTab('home')} />
            )}
          </>
        )}
      </View>

      {!isIndividualChat && (
        <FloatingGlassBottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          dark={isReels}
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
