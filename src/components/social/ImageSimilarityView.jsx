
import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

import { Feather, Ionicons } from '@expo/vector-icons';

import { useSocialApp } from '@/context/SocialAppContext';

import {
  searchSimilarImages,
  savePostImageEmbedding,
} from '@/lib/imageSimilarityApi';

const showMessage = (title, message, onConfirm) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    onConfirm?.();
    return;
  }

  Alert.alert(title, message, [
    { text: 'OK', onPress: onConfirm },
  ]);
};

const formatSimilarity = (value) => {
  if (value === null || value === undefined) return 'N/A';

  const number = Number(value);

  if (!Number.isFinite(number)) return 'N/A';

  const percentage = number <= 1 ? number * 100 : number;

  return `${percentage.toFixed(2)}%`;
};

export default function ImageSimilarityView({ onBack, onPostCreated }) {
  const { posts, uploadPostImage, addPost } = useSocialApp();

  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showMessage(
          'Permission required',
          'Please allow Kindred to access your photo library.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;

      setSelectedImage(result.assets[0].uri);
      setSearchResult(null);
    } catch (error) {
      console.error('[ImageSimilarity] Image selection error:', error);
      showMessage(
        'Image selection failed',
        error.message || 'Could not select your image.'
      );
    }
  };

  const handleRemoveImage = () => {
    if (isChecking || isPublishing) return;

    setSelectedImage(null);
    setSearchResult(null);
  };

  const handleCheckSimilarImages = async () => {
    if (!selectedImage || isChecking || isPublishing) return;

    setIsChecking(true);
    setSearchResult(null);

    try {
      const result = await searchSimilarImages(selectedImage);

      if (!result || typeof result !== 'object') {
        throw new Error('The image comparison service returned an invalid response.');
      }

      setSearchResult(result);

      const foundMatches = Array.isArray(result.matches)
        ? result.matches
        : [];

      if (foundMatches.length === 0) {
        showMessage(
          'No similar images found',
          'No matching images were found. You can proceed with publishing.'
        );
      }
    } catch (error) {
      console.error('[ImageSimilarity] Search error:', error);

      showMessage(
        'Image comparison failed',
        error.message || 'Unable to compare images. Please try again.'
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedImage || !searchResult || isPublishing || isChecking) {
      return;
    }

    setIsPublishing(true);

    let createdPost = null;

    try {
      const uploadedImageUrl = await uploadPostImage(selectedImage);

      createdPost = await addPost({
        caption: caption.trim() || '',
        image: uploadedImageUrl,
        location: null,
        category: 'Community',
      });

      if (!createdPost?.id) {
        throw new Error(
          'The post was created, but its ID could not be retrieved.'
        );
      }

      try {
        const embeddingResult = await savePostImageEmbedding({
          imageUri: selectedImage,
          postId: createdPost.id,
          imageUrl: uploadedImageUrl,
        });

        console.log(
          '[ImageSimilarity] Embedding saved:',
          embeddingResult
        );

        showMessage(
          'Post published successfully!',
          'Your post is now available in Kindred.',
          onPostCreated
        );
      } catch (embeddingError) {
        console.error(
          '[ImageSimilarity] Embedding registration failed:',
          embeddingError
        );

        showMessage(
          'Post published, indexing pending',
          'Your post was published, but image indexing could not be completed. You do not need to publish it again.',
          onPostCreated
        );
      }
    } catch (error) {
      console.error('[ImageSimilarity] Publishing error:', error);

      showMessage(
        createdPost ? 'Post published' : 'Publishing failed',
        createdPost
          ? 'Your post was created, but another operation failed. Please check your Home Feed.'
          : error.message || 'Could not publish your post.'
      );

      if (createdPost) {
        onPostCreated?.();
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const matches = Array.isArray(searchResult?.matches)
    ? searchResult.matches
    : [];

  const getMatchedPost = (match) =>
    posts.find((post) => post.id === match.post_id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          disabled={isPublishing}
        >
          <Feather name="arrow-left" size={23} color="#173F32" />
        </Pressable>

        <Text style={styles.headerTitle}>Image Similarity</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.intro}>
          <Text style={styles.heading}>Check before you share.</Text>
          <Text style={styles.subtitle}>
            Find visually similar images already published in Kindred
            before creating your post.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Image</Text>

          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
                contentFit="cover"
              />

              <Pressable
                style={styles.removeImageButton}
                onPress={handleRemoveImage}
                disabled={isChecking || isPublishing}
              >
                <Feather name="x" size={19} color="#FFFFFF" />
              </Pressable>

              <View style={styles.imageSelectedBadge}>
                <Feather
                  name="check-circle"
                  size={15}
                  color="#FFFFFF"
                />
                <Text style={styles.imageSelectedText}>
                  Image selected
                </Text>
              </View>
            </View>
          ) : (
            <Pressable
              style={styles.imagePicker}
              onPress={handlePickImage}
            >
              <View style={styles.uploadIcon}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={34}
                  color="#176B45"
                />
              </View>

              <Text style={styles.uploadTitle}>Select an image</Text>
              <Text style={styles.uploadDescription}>
                Choose a photo from your device gallery.
              </Text>

              <View style={styles.chooseImageButton}>
                <Feather name="image" size={16} color="#FFFFFF" />
                <Text style={styles.chooseImageText}>Choose Image</Text>
              </View>
            </Pressable>
          )}

          {selectedImage && (
            <Pressable
              style={styles.changeImageButton}
              onPress={handlePickImage}
              disabled={isChecking || isPublishing}
            >
              <Feather
                name="refresh-cw"
                size={14}
                color="#176B45"
              />
              <Text style={styles.changeImageText}>Change image</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caption (Optional)</Text>

          <TextInput
            style={styles.captionInput}
            value={caption}
            onChangeText={setCaption}
            placeholder="Write something about this image..."
            placeholderTextColor="#A0AAA3"
            multiline
            maxLength={500}
            textAlignVertical="top"
            editable={!isPublishing}
          />

          <Text style={styles.characterCount}>
            {caption.length}/500
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Image Comparison</Text>

          <View style={styles.comparisonInfo}>
            <View style={styles.comparisonIcon}>
              <Feather name="layers" size={21} color="#176B45" />
            </View>

            <View style={styles.comparisonTextContainer}>
              <Text style={styles.comparisonTitle}>
                AI-powered image matching
              </Text>

              <Text style={styles.comparisonDescription}>
                Kindred compares your image with previously indexed
                post images to find visually similar content.
              </Text>
            </View>
          </View>

          <Pressable
            style={[
              styles.checkButton,
              (!selectedImage || isChecking || isPublishing) &&
                styles.disabledButton,
            ]}
            onPress={handleCheckSimilarImages}
            disabled={!selectedImage || isChecking || isPublishing}
          >
            {isChecking ? (
              <>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.checkButtonText}>
                  Checking images...
                </Text>
              </>
            ) : (
              <>
                <Feather name="search" size={17} color="#FFFFFF" />
                <Text style={styles.checkButtonText}>
                  Check Similar Images
                </Text>
              </>
            )}
          </Pressable>
        </View>

        {searchResult && (
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.sectionTitle}>Similarity Results</Text>

              <View style={styles.resultsCountBadge}>
                <Text style={styles.resultsCountText}>
                  {matches.length} found
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.resultSummary,
                matches.length > 0
                  ? styles.warningSummary
                  : styles.successSummary,
              ]}
            >
              <Feather
                name={
                  matches.length > 0
                    ? 'alert-circle'
                    : 'check-circle'
                }
                size={20}
                color={matches.length > 0 ? '#B7791F' : '#176B45'}
              />

              <View style={styles.resultSummaryText}>
                <Text style={styles.resultSummaryTitle}>
                  {matches.length > 0
                    ? 'Similar images detected'
                    : 'No similar images detected'}
                </Text>

                <Text style={styles.resultSummaryDescription}>
                  {matches.length > 0
                    ? 'Review the matching posts below before publishing.'
                    : 'No matching images were found in the indexed posts.'}
                </Text>
              </View>
            </View>

            {matches.map((match, index) => {
              const matchedPost = getMatchedPost(match);

              const matchImage =
                match.image_url ||
                matchedPost?.image ||
                matchedPost?.image_url;

              return (
                <View
                  key={match.id || match.post_id || index}
                  style={styles.matchCard}
                >
                  {matchImage ? (
                    <Image
                      source={{ uri: matchImage }}
                      style={styles.matchImage}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={styles.matchImagePlaceholder}>
                      <Feather
                        name="image"
                        size={25}
                        color="#91A096"
                      />
                    </View>
                  )}

                  <View style={styles.matchContent}>
                    <Text style={styles.matchTitle}>
                      {matchedPost?.author?.name || 'Kindred Post'}
                    </Text>

                    <Text
                      style={styles.matchCaption}
                      numberOfLines={2}
                    >
                      {matchedPost?.caption ||
                        'Matching image found in the Kindred image database.'}
                    </Text>

                    <Text style={styles.matchScore}>
                      Visual similarity:{' '}
                      {formatSimilarity(
                        match.dinov2_similarity ?? match.similarity
                      )}
                    </Text>
                  </View>
                </View>
              );
            })}

            <Text style={styles.scoreNote}>
              Similarity scores measure visual resemblance. They are
              not probabilities that two posts are duplicates.
            </Text>
          </View>
        )}

        <View style={styles.publishSection}>
          <Pressable
            style={[
              styles.publishButton,
              (
                !selectedImage ||
                !searchResult ||
                isChecking ||
                isPublishing
              ) && styles.disabledButton,
            ]}
            onPress={handlePublish}
            disabled={
              !selectedImage ||
              !searchResult ||
              isChecking ||
              isPublishing
            }
          >
            {isPublishing ? (
              <>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.publishButtonText}>
                  Publishing...
                </Text>
              </>
            ) : (
              <>
                <Feather name="send" size={18} color="#FFFFFF" />
                <Text style={styles.publishButtonText}>
                  Publish Post
                </Text>
              </>
            )}
          </Pressable>

          <Text style={styles.publishNote}>
            You must check image similarity before publishing through
            this screen.
          </Text>
        </View>
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
    paddingHorizontal: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: '#173F32',
  },
  headerSpacer: {
    width: 42,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 140,
  },
  intro: {
    marginBottom: 27,
  },
  heading: {
    fontSize: 25,
    lineHeight: 33,
    fontWeight: '800',
    color: '#173F32',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 21,
    color: '#78877F',
    marginTop: 8,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#173F32',
    marginBottom: 13,
  },
  imagePicker: {
    minHeight: 235,
    borderWidth: 1.5,
    borderColor: '#CFE0D2',
    borderStyle: 'dashed',
    borderRadius: 20,
    backgroundColor: '#F7FAF7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
  },
  uploadIcon: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#E4F1E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  uploadTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#173F32',
  },
  uploadDescription: {
    fontSize: 12,
    color: '#829087',
    textAlign: 'center',
    marginTop: 7,
  },
  chooseImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#176B45',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
    gap: 8,
    marginTop: 17,
  },
  chooseImageText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  imagePreviewContainer: {
    height: 260,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#EEF2EF',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSelectedBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,85,52,0.88)',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  imageSelectedText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  changeImageButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    padding: 12,
    marginTop: 6,
  },
  changeImageText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#176B45',
  },
  captionInput: {
    minHeight: 115,
    borderWidth: 1,
    borderColor: '#E0E8E1',
    borderRadius: 15,
    padding: 15,
    fontSize: 14,
    color: '#173F32',
    backgroundColor: '#FAFCFA',
  },
  characterCount: {
    textAlign: 'right',
    color: '#98A39B',
    fontSize: 11,
    marginTop: 7,
  },
  comparisonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#F3F8F3',
    marginBottom: 14,
  },
  comparisonIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#E1EFE3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  comparisonTextContainer: {
    flex: 1,
  },
  comparisonTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173F32',
  },
  comparisonDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#77857C',
    marginTop: 5,
  },
  checkButton: {
    minHeight: 49,
    borderRadius: 14,
    backgroundColor: '#176B45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.45,
  },
  resultsSection: {
    marginBottom: 25,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  resultsCountBadge: {
    backgroundColor: '#E6F2E8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  resultsCountText: {
    fontSize: 11,
    color: '#176B45',
    fontWeight: '800',
  },
  resultSummary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 15,
    padding: 14,
    gap: 11,
    marginBottom: 13,
  },
  successSummary: {
    backgroundColor: '#EDF7EF',
  },
  warningSummary: {
    backgroundColor: '#FFF7E9',
  },
  resultSummaryText: {
    flex: 1,
  },
  resultSummaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173F32',
  },
  resultSummaryDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#77857C',
    marginTop: 5,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: '#FAFCFA',
    borderWidth: 1,
    borderColor: '#E7EDE7',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    gap: 12,
  },
  matchImage: {
    width: 92,
    height: 100,
    borderRadius: 11,
    backgroundColor: '#E9EEE9',
  },
  matchImagePlaceholder: {
    width: 92,
    height: 100,
    borderRadius: 11,
    backgroundColor: '#E9EEE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchContent: {
    flex: 1,
    justifyContent: 'center',
  },
  matchTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#173F32',
  },
  matchCaption: {
    fontSize: 11,
    lineHeight: 17,
    color: '#77857C',
    marginTop: 5,
  },
  matchScore: {
    fontSize: 11,
    fontWeight: '800',
    color: '#176B45',
    marginTop: 8,
  },
  scoreNote: {
    fontSize: 10,
    lineHeight: 16,
    color: '#89958D',
    marginTop: 5,
  },
  publishSection: {
    marginTop: 4,
  },
  publishButton: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: '#176B45',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  publishButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  publishNote: {
    fontSize: 10,
    color: '#89958D',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 10,
  },
});
