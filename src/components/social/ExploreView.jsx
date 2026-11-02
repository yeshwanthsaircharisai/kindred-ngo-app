import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '@/constants/colors';
import { AppText } from '@/components/ui';

const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 18;
const GAP = 12;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - GAP) / 2;

const CATEGORIES = [
  'All',
  'NGOs',
  'Volunteering',
  'Environment',
  'Community',
];

const DISCOVERY_TILES = [
  {
    id: 't-1',
    title: 'Green Earth',
    members: '12.5k members',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    category: 'Environment',
  },
  {
    id: 't-2',
    title: 'Community',
    members: '8.3k members',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&auto=format&fit=crop&q=80',
    category: 'Community',
  },
  {
    id: 't-3',
    title: 'Education',
    members: '15.2k members',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    category: 'Education',
  },
  {
    id: 't-4',
    title: 'Animal Welfare',
    members: '9.1k members',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    category: 'Animal Welfare',
  },
  {
    id: 't-5',
    title: 'Environment',
    members: '11.8k members',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&auto=format&fit=crop&q=80',
    category: 'Environment',
  },
  {
    id: 't-6',
    title: 'Volunteer',
    members: '7.6k members',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    category: 'Volunteering',
  },
];

export default function ExploreView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = DISCOVERY_TILES.filter((item) => {
    const matchesCat =
      selectedCategory === 'All' ||
      item.category === selectedCategory ||
      (selectedCategory === 'NGOs' && item.title.includes('Earth'));
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <View style={styles.container}>
      {/* Explore Header Title */}
      <View style={styles.header}>
        <AppText style={styles.screenTitle}>Explore</AppText>
      </View>

      {/* Search Bar with Filter Icon */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={19} color="#8D9B93" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search NGOs, causes..."
            placeholderTextColor="#8D9B93"
            style={styles.searchInput}
          />
        </View>

        <Pressable style={styles.filterBtn} hitSlop={6}>
          <Feather name="sliders" size={18} color="#18241D" />
        </Pressable>
      </View>

      {/* Category Pills */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryPill,
                  isSelected ? styles.categoryPillActive : styles.categoryPillInactive,
                ]}
              >
                <AppText
                  style={[
                    styles.categoryText,
                    isSelected ? styles.categoryTextActive : styles.categoryTextInactive,
                  ]}
                >
                  {cat}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Grid of Cause Cards */}
      <ScrollView
        contentContainerStyle={styles.gridScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.causeCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.causeCardImage}
                contentFit="cover"
              />
              <View style={styles.causeCardGradient} />
              <View style={styles.causeCardContent}>
                <AppText style={styles.cardTitle}>{item.title}</AppText>
                <AppText style={styles.cardMembers}>{item.members}</AppText>
              </View>
            </View>
          ))}
        </View>

        {/* Space for floating bottom nav */}
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
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 12,
    paddingBottom: 8,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#18241D',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 14,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F4',
    borderRadius: 22,
    height: 42,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#18241D',
    height: '100%',
  },
  filterBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesWrapper: {
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#0F6941',
  },
  categoryPillInactive: {
    backgroundColor: '#F1F4F2',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryTextInactive: {
    color: '#55665E',
  },
  gridScroll: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  causeCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: GAP,
    backgroundColor: '#E7ECE8',
    position: 'relative',
  },
  causeCardImage: {
    width: '100%',
    height: '100%',
  },
  causeCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  causeCardContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardMembers: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 11,
    fontWeight: '400',
  },
  bottomSpacer: {
    height: 100,
  },
});

