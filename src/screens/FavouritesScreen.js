import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { getCafeteriaByName } from '../data/cafeterias';
import { EmptyState } from '../components/ui';
import { COLORS, RADIUS, SHADOW } from '../theme';

export default function FavouritesScreen({ navigation }) {
  const { favourites, toggleFavourite } = useCart();

  const openItem = ({ item, cafeteriaName }) => {
    // PASSING PARAMS THROUGH NESTED NAVIGATORS:
    // Drawer "Home" -> Tab "Browse" -> Stack "ItemDetails".
    navigation.navigate('Home', {
      screen: 'Browse',
      params: {
        screen: 'ItemDetails',
        params: { item, cafeteriaName },
        initial: false,
      },
    });
  };

  if (favourites.length === 0) {
    return (
      <EmptyState
        emoji="💔"
        title="No favourites yet"
        subtitle="Tap the ♡ in an item's header to save it here."
        actionLabel="Find something tasty"
        onAction={() => navigation.navigate('Home', { screen: 'Browse' })}
      />
    );
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={favourites}
      keyExtractor={(f) => f.item.id}
      numColumns={2}
      columnWrapperStyle={styles.columns}
      renderItem={({ item: fav }) => (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() => openItem(fav)}
        >
          <View
            style={[
              styles.image,
              { backgroundColor: getCafeteriaByName(fav.cafeteriaName)?.tint ?? COLORS.primarySoft },
            ]}
          >
            <Text style={styles.emoji}>{fav.item.emoji}</Text>
            <Pressable
              style={styles.heart}
              hitSlop={8}
              onPress={() => toggleFavourite(fav.item, fav.cafeteriaName)}
            >
              <Ionicons name="heart" size={16} color={COLORS.danger} />
            </Pressable>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {fav.item.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {fav.cafeteriaName}
          </Text>
          <Text style={styles.price}>Rs. {fav.item.price}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 20, paddingTop: 4 },
  columns: { justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 14,
    ...SHADOW.soft,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  image: {
    height: 110,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emoji: { fontSize: 56 },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.primary, marginTop: 6 },
});
