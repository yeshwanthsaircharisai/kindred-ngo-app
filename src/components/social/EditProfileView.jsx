
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { AppText } from '@/components/ui';
import { useSocialApp } from '@/context/SocialAppContext';

export default function EditProfileView({ onBack }) {
  const { profile, updateProfile, uploadAvatar } = useSocialApp();

  const [name, setName] = useState(profile.name || '');
  const [username, setUsername] = useState(
    (profile.handle || '').replace(/^@/, '')
  );
  const [bio, setBio] = useState(profile.bio || '');
  const [avatar, setAvatar] = useState(profile.avatar || '');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    setName(profile.name || '');
    setUsername((profile.handle || '').replace(/^@/, ''));
    setBio(profile.bio || '');
    setAvatar(profile.avatar || '');
  }, [profile]);

  const handleChooseAvatar = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow photo library access to choose a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        'Image Error',
        error?.message || 'Unable to select an image.'
      );
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter your name.');
      return;
    }

    if (!username.trim()) {
      Alert.alert('Missing Username', 'Please enter a username.');
      return;
    }

    const cleanUsername = username.trim().replace(/^@/, '');

    if (!/^[a-zA-Z0-9_.]+$/.test(cleanUsername)) {
      Alert.alert(
        'Invalid Username',
        'Use only letters, numbers, underscores, and periods.'
      );
      return;
    }

    setSaving(true);

    try {
      let finalAvatar = avatar;

      if (avatar && !/^https?:\/\//i.test(avatar)) {
        setUploadingAvatar(true);
        finalAvatar = await uploadAvatar(avatar);
        setUploadingAvatar(false);
      }

      await updateProfile({
        name: name.trim(),
        username: cleanUsername,
        bio: bio.trim(),
        avatar: finalAvatar,
      });

      Alert.alert('Success', 'Your profile has been updated.', [
        {
          text: 'OK',
          onPress: () => onBack?.(),
        },
      ]);
    } catch (error) {
      setUploadingAvatar(false);

      Alert.alert(
        'Update Failed',
        error?.message || 'Unable to update your profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Feather name="arrow-left" size={23} color="#18241D" />
        </Pressable>

        <AppText style={styles.headerTitle}>Edit Profile</AppText>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Picture */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Feather name="user" size={42} color="#08734B" />
              </View>
            )}
          </View>

          <Pressable
            style={styles.changePhotoButton}
            onPress={handleChooseAvatar}
            disabled={saving}
          >
            <Feather name="camera" size={15} color="#08734B" />
            <AppText style={styles.changePhotoText}>
              Change Profile Photo
            </AppText>
          </Pressable>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <AppText style={styles.label}>Full Name</AppText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#94A39B"
            editable={!saving}
            maxLength={60}
          />

          <AppText style={styles.label}>Username</AppText>
          <View style={styles.usernameInputWrapper}>
            <AppText style={styles.usernamePrefix}>@</AppText>
            <TextInput
              style={styles.usernameInput}
              value={username}
              onChangeText={setUsername}
              placeholder="username"
              placeholderTextColor="#94A39B"
              autoCapitalize="none"
              editable={!saving}
              maxLength={30}
            />
          </View>

          <AppText style={styles.label}>Bio</AppText>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell people about yourself..."
            placeholderTextColor="#94A39B"
            multiline
            textAlignVertical="top"
            editable={!saving}
            maxLength={160}
          />

          <AppText style={styles.characterCount}>
            {bio.length}/160
          </AppText>
        </View>

        {/* Save Button */}
        <Pressable
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <ActivityIndicator color="#FFFFFF" />
              <AppText style={styles.saveButtonText}>
                {uploadingAvatar ? 'Uploading Photo...' : 'Saving...'}
              </AppText>
            </>
          ) : (
            <AppText style={styles.saveButtonText}>
              Save Changes
            </AppText>
          )}
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={onBack}
          disabled={saving}
        >
          <AppText style={styles.cancelButtonText}>Cancel</AppText>
        </Pressable>
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
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F1',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#18241D',
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: '#C4F135',
    padding: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 52,
  },
  avatarPlaceholder: {
    flex: 1,
    borderRadius: 52,
    backgroundColor: '#EAF7EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#08734B',
  },
  form: {
    gap: 9,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#34453D',
    marginTop: 9,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4EBE6',
    backgroundColor: '#F8FAF8',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#18241D',
  },
  usernameInputWrapper: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4EBE6',
    backgroundColor: '#F8FAF8',
    paddingHorizontal: 14,
  },
  usernamePrefix: {
    fontSize: 14,
    fontWeight: '600',
    color: '#08734B',
  },
  usernameInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 5,
    fontSize: 14,
    color: '#18241D',
  },
  bioInput: {
    minHeight: 110,
    paddingTop: 13,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 11,
    color: '#94A39B',
  },
  saveButton: {
    height: 50,
    backgroundColor: '#08734B',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
    marginTop: 30,
  },
  disabledButton: {
    opacity: 0.65,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64736B',
  },
});
