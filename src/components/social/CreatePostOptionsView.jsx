
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';

import { Feather, Ionicons } from '@expo/vector-icons';

export default function CreatePostOptionsView({
  onBack,
  onSelectNormalPost,
  onSelectImageSimilarity,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Feather name="arrow-left" size={23} color="#173F32" />
        </Pressable>

        <Text style={styles.headerTitle}>Create</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={styles.heading}>Share something meaningful.</Text>

          <Text style={styles.subtitle}>
            Choose how you want to share your community moments with Kindred.
          </Text>
        </View>

        <Pressable
          onPress={onSelectNormalPost}
          style={({ pressed }) => [
            styles.optionCard,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="image-outline"
              size={29}
              color="#176B45"
            />
          </View>

          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Normal Create Post</Text>

            <Text style={styles.optionDescription}>
              Select a photo, write a caption and publish your post.
            </Text>

            <View style={styles.optionFooter}>
              <Text style={styles.optionAction}>Create a post</Text>
              <Feather name="arrow-right" size={17} color="#176B45" />
            </View>
          </View>
        </Pressable>

        <Pressable
          onPress={onSelectImageSimilarity}
          style={({ pressed }) => [
            styles.optionCard,
            styles.similarityCard,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="scan-outline"
              size={29}
              color="#176B45"
            />
          </View>

          <View style={styles.optionContent}>
            <View style={styles.titleRow}>
              <Text style={styles.optionTitle}>
                Image Similarity Post
              </Text>

              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            </View>

            <Text style={styles.optionDescription}>
              Check whether similar images already exist in Kindred before
              publishing your post.
            </Text>

            <View style={styles.optionFooter}>
              <Text style={styles.optionAction}>Check similar images</Text>
              <Feather name="arrow-right" size={17} color="#176B45" />
            </View>
          </View>
        </Pressable>

        <View style={styles.infoContainer}>
          <Feather name="heart" size={17} color="#638576" />

          <Text style={styles.infoText}>
            Help keep Kindred's community content original and meaningful.
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
    fontSize: 18,
    fontWeight: '700',
    color: '#173F32',
  },

  headerSpacer: {
    width: 42,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 130,
  },

  intro: {
    marginBottom: 28,
  },

  heading: {
    fontSize: 27,
    fontWeight: '800',
    color: '#173F32',
    lineHeight: 35,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#78877F',
    marginTop: 10,
  },

  optionCard: {
    flexDirection: 'row',
    backgroundColor: '#F7FAF7',
    borderWidth: 1,
    borderColor: '#E7EEE8',
    borderRadius: 22,
    padding: 19,
    marginBottom: 17,
  },

  similarityCard: {
    backgroundColor: '#F2F8F2',
    borderColor: '#CFE3D4',
  },

  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 17,
    backgroundColor: '#E2F0E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#173F32',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },

  newBadge: {
    backgroundColor: '#DDF1DF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  newBadgeText: {
    color: '#176B45',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  optionDescription: {
    fontSize: 13,
    color: '#78877F',
    lineHeight: 20,
    marginTop: 8,
  },

  optionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    gap: 7,
  },

  optionAction: {
    color: '#176B45',
    fontSize: 13,
    fontWeight: '800',
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9F7',
    padding: 15,
    borderRadius: 14,
    marginTop: 12,
    gap: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#718078',
  },
});
