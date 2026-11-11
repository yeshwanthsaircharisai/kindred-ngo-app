
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui';
import { useSocialApp } from '@/context/SocialAppContext';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1080&auto=format&fit=crop&q=80';

export default function CreatePostView({ onPostCreated }) {
  const { addPost, uploadPostImage } = useSocialApp();

  const [caption, setCaption] = useState(
    'Together for a greener planet 💚'
  );
  const [selectedImage, setSelectedImage] = useState(DEFAULT_IMAGE);
  const [activeMediaType, setActiveMediaType] = useState('image');
  const [isPosting, setIsPosting] = useState(false);

  const handlePickLocalImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Please allow gallery access to select a photo.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setActiveMediaType('image');
      }
    } catch (error) {
      Alert.alert(
        'Image selection failed',
        error.message || 'Could not open your gallery.'
      );
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
  };

  const handleCreatePost = async () => {
    if (isPosting) return;

    if (!caption.trim()) {
      Alert.alert('Required', 'Please enter a caption for your post.');
      return;
    }

    setIsPosting(true);

    try {
      let uploadedImageUrl = null;

      // Upload only a newly selected local image.
      if (
        selectedImage &&
        !selectedImage.startsWith('http://') &&
        !selectedImage.startsWith('https://')
      ) {
        uploadedImageUrl = await uploadPostImage(selectedImage);
      } else if (selectedImage) {
        uploadedImageUrl = selectedImage;
      }

      await addPost({
        caption: caption.trim(),
        image: uploadedImageUrl,
        location: null,
        category: 'Volunteering',
      });

      Alert.alert('Success', 'Your post has been published!', [
        {
          text: 'OK',
          onPress: () => {
            if (onPostCreated) onPostCreated();
          },
        },
      ]);
    } catch (error) {
      console.error('[CreatePost] Failed:', error);

      Alert.alert(
        'Post failed',
        error.message || 'Something went wrong while creating your post.'
      );
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onPostCreated}
          hitSlop={10}
          style={styles.backBtn}
          disabled={isPosting}
        >
          <Feather name="arrow-left" size={24} color="#18241D" />
        </Pressable>

        <AppText style={styles.headerTitle}>Create Post</AppText>

        <Pressable
          onPress={handleCreatePost}
          style={[
            styles.postBtn,
            isPosting && styles.postBtnDisabled,
          ]}
          hitSlop={6}
          disabled={isPosting}
        >
          {isPosting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <AppText style={styles.postBtnText}>Post</AppText>
          )}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {selectedImage ? (
          <View style={styles.mediaContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImage}
              contentFit="cover"
            />

            <Pressable
              onPress={handleClearImage}
              style={styles.closeBtn}
              hitSlop={6}
              disabled={isPosting}
            >
              <Ionicons
                name="close-circle"
                size={26}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={handlePickLocalImage}
            style={styles.emptyMediaBox}
            disabled={isPosting}
          >
            <Feather name="image" size={36} color="#8D9B93" />
            <AppText style={styles.emptyMediaText}>
              Tap to choose photo
            </AppText>
          </Pressable>
        )}

        <View style={styles.mediaTypesRow}>
          <Pressable
            onPress={() => {
              setActiveMediaType('image');
              handlePickLocalImage();
            }}
            style={[
              styles.mediaTypeBtn,
              activeMediaType === 'image' &&
                styles.mediaTypeBtnActive,
            ]}
            disabled={isPosting}
          >
            <Feather
              name="image"
              size={17}
              color="#08734B"
              style={{ marginRight: 6 }}
            />
            <AppText style={styles.mediaTypeBtnText}>
              Image
            </AppText>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveMediaType('video');
              Alert.alert(
                'Coming soon',
                'Video posting will be available in a future update.'
              );
            }}
            style={[
              styles.mediaTypeBtn,
              activeMediaType === 'video' &&
                styles.mediaTypeBtnActive,
            ]}
            disabled={isPosting}
          >
            <Ionicons
              name="videocam-outline"
              size={19}
              color="#08734B"
              style={{ marginRight: 6 }}
            />
            <AppText style={styles.mediaTypeBtnText}>
              Video
            </AppText>
          </Pressable>
        </View>

        <View style={styles.captionWrapper}>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Write a caption..."
            placeholderTextColor="#8D9B93"
            multiline
            maxLength={220}
            style={styles.captionInput}
            editable={!isPosting}
          />

          <AppText style={styles.charCount}>
            {caption.length}/220
          </AppText>
        </View>

        <Pressable
          style={styles.locationRow}
          disabled={isPosting}
          onPress={() =>
            Alert.alert(
              'Location',
              'Location tagging will be added in a future update.'
            )
          }
        >
          <View style={styles.locationLeft}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#55665E"
              style={{ marginRight: 8 }}
            />
            <AppText style={styles.locationText}>
              Add Location
            </AppText>
          </View>

          <Feather
            name="chevron-right"
            size={20}
            color="#8D9B93"
          />
        </Pressable>

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
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18241D',
  },
  postBtn: {
    backgroundColor: '#0F6941',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 18,
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBtnDisabled: {
    opacity: 0.7,
  },
  postBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  mediaContainer: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E8EDE9',
    position: 'relative',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 13,
  },
  emptyMediaBox: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CED8D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyMediaText: {
    fontSize: 13,
    color: '#8D9B93',
    marginTop: 8,
  },
  mediaTypesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  mediaTypeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F4',
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 20,
  },
  mediaTypeBtnActive: {
    backgroundColor: '#EAF7EE',
  },
  mediaTypeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#18241D',
  },
  captionWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F5F3',
    paddingBottom: 14,
    marginBottom: 16,
  },
  captionInput: {
    fontSize: 15,
    color: '#18241D',
    minHeight: 50,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 11,
    color: '#8D9B93',
    marginTop: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F5F3',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#18241D',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
});
