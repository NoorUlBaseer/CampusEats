import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CAFETERIAS, POPULAR_ITEMS } from '../data/cafeterias';
import { Chip, SectionTitle } from '../components/ui';
import { COLORS, RADIUS, SHADOW } from '../theme';

export default function CafeteriasScreen({ navigation }) {
  const [search, setSearch] = useState('');

  const openMenu = (cafeteria) => {
    // PASSING PARAMS: send the cafeteria's id and name to the Menu screen.
    navigation.navigate('Menu', {
      cafeteriaId: cafeteria.id,
      name: cafeteria.name,
    });
  };

  const openItem = (item, cafeteria) => {
    // PASSING PARAMS: jump straight to an item from the "Popular" list.
    navigation.navigate('ItemDetails', { item, cafeteriaName: cafeteria.name });
  };

  // Match the search text against cafeteria names, tags and their dishes.
  const query = search.trim().toLowerCase();
  const results = CAFETERIAS.filter(
    (c) =>
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.tag.toLowerCase().includes(query) ||
      c.items.some((i) => i.name.toLowerCase().includes(query))
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.greeting}>Hey there 👋</Text>
      <Text style={styles.headline}>What are you craving today?</Text>

      <View style={styles.search}>
        <Ionicons name="search" size={20} color={COLORS.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search cafeterias or dishes"
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={10}>
            <Ionicons name="close-circle" size={20} color={COLORS.muted} />
          </Pressable>
        )}
      </View>

      {!query && (
        <>
          <SectionTitle>🔥 Popular right now</SectionTitle>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            style={styles.carouselWrap}
          >
            {POPULAR_ITEMS.map(({ item, cafeteria }) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.popular, pressed && styles.pressed]}
                onPress={() => openItem(item, cafeteria)}
              >
                <View style={[styles.popularImage, { backgroundColor: cafeteria.tint }]}>
                  <Text style={styles.popularEmoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.popularName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.popularMeta} numberOfLines={1}>
                  {cafeteria.name}
                </Text>
                <Text style={styles.popularPrice}>Rs. {item.price}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}

      <SectionTitle>{query ? `Results (${results.length})` : '🏫 Campus cafeterias'}</SectionTitle>

      {results.length === 0 && (
        <Text style={styles.noResults}>No cafeterias match "{search}" 😕</Text>
      )}

      {results.map((cafeteria) => (
        <Pressable
          key={cafeteria.id}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() => openMenu(cafeteria)}
        >
          <View style={[styles.banner, { backgroundColor: cafeteria.tint }]}>
            <Text style={styles.bannerEmoji}>{cafeteria.emoji}</Text>
            <View style={[styles.tag, { backgroundColor: cafeteria.color }]}>
              <Text style={styles.tagText}>{cafeteria.tag}</Text>
            </View>
            <View style={styles.rating}>
              <Ionicons name="star" size={12} color={COLORS.star} />
              <Text style={styles.ratingText}>{cafeteria.rating}</Text>
            </View>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>{cafeteria.name}</Text>
              <Ionicons name="arrow-forward-circle" size={26} color={cafeteria.color} />
            </View>
            <View style={styles.chips}>
              <Chip icon="location-outline" label={cafeteria.location} color={COLORS.muted} />
              <Chip icon="time-outline" label={cafeteria.prepTime} color={COLORS.muted} />
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingTop: 8 },
  greeting: { fontSize: 15, color: COLORS.muted },
  headline: { fontSize: 26, fontWeight: '800', color: COLORS.text, marginTop: 4, lineHeight: 32 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    height: 50,
    marginTop: 18,
    marginBottom: 24,
    ...SHADOW.soft,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.text },
  carouselWrap: { marginHorizontal: -20, marginBottom: 24 },
  carousel: { paddingHorizontal: 20, paddingBottom: 8 },
  popular: {
    width: 150,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 10,
    marginRight: 12,
    ...SHADOW.soft,
  },
  popularImage: {
    height: 96,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  popularEmoji: { fontSize: 52 },
  popularName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  popularMeta: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  popularPrice: { fontSize: 14, fontWeight: '800', color: COLORS.primary, marginTop: 6 },
  noResults: { color: COLORS.muted, textAlign: 'center', marginTop: 20, fontSize: 15 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginBottom: 18,
    overflow: 'hidden',
    ...SHADOW.soft,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  banner: { height: 120, alignItems: 'center', justifyContent: 'center' },
  bannerEmoji: { fontSize: 64 },
  tag: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  tagText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  rating: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  ratingText: { fontSize: 12, fontWeight: '700', marginLeft: 3, color: COLORS.text },
  cardBody: { padding: 16 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 19, fontWeight: '800', color: COLORS.text },
  chips: { flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' },
});
