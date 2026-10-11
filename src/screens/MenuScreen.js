import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCafeteriaById } from '../data/cafeterias';
import { useCart } from '../context/CartContext';
import { EmojiTile, QuantityStepper } from '../components/ui';
import { COLORS, RADIUS, SHADOW } from '../theme';

export default function MenuScreen({ route, navigation }) {
  // RECEIVING PARAMS sent from CafeteriasScreen.
  const { cafeteriaId, name } = route.params;
  const cafeteria = getCafeteriaById(cafeteriaId);
  const { cart, addToCart, changeQuantity } = useCart();

  const openItem = (item) => {
    // PASSING PARAMS: send the whole item object plus the cafeteria name.
    navigation.navigate('ItemDetails', { item, cafeteriaName: name });
  };

  const quantityInCart = (itemId) =>
    cart.find((entry) => entry.item.id === itemId)?.quantity ?? 0;

  const renderHero = () => (
    <View style={[styles.hero, { backgroundColor: cafeteria.color }]}>
      <View style={styles.heroEmojiCircle}>
        <Text style={styles.heroEmoji}>{cafeteria.emoji}</Text>
      </View>
      <Text style={styles.heroTitle}>{name}</Text>
      <View style={styles.heroChips}>
        <HeroChip icon="star" label={`${cafeteria.rating}`} />
        <HeroChip icon="time-outline" label={cafeteria.prepTime} />
        <HeroChip icon="location-outline" label={cafeteria.location} />
      </View>
      <Text style={styles.paramsNote}>
        Received params → cafeteriaId: "{cafeteriaId}", name: "{name}"
      </Text>
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={cafeteria.items}
      keyExtractor={(i) => i.id}
      ListHeaderComponent={
        <>
          {renderHero()}
          <Text style={styles.sectionTitle}>Menu · {cafeteria.items.length} items</Text>
        </>
      }
      renderItem={({ item }) => {
        const qty = quantityInCart(item.id);
        return (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => openItem(item)}
          >
            <EmojiTile emoji={item.emoji} tint={cafeteria.tint} size={72} />
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                {item.popular && <Text style={styles.popular}>🔥</Text>}
              </View>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.bottomRow}>
                <Text style={styles.price}>Rs. {item.price}</Text>
                {qty > 0 ? (
                  <QuantityStepper
                    compact
                    value={qty}
                    onDecrease={() => changeQuantity(item.id, -1)}
                    onIncrease={() => changeQuantity(item.id, 1)}
                  />
                ) : (
                  <Pressable
                    style={[styles.addButton, { backgroundColor: cafeteria.color }]}
                    onPress={() => addToCart(item, name)}
                    hitSlop={8}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </Pressable>
                )}
              </View>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

function HeroChip({ icon, label }) {
  return (
    <View style={styles.heroChip}>
      <Ionicons name={icon} size={13} color="#fff" />
      <Text style={styles.heroChipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  list: { paddingBottom: 24 },
  // The hero continues the coloured header, then curves into the page.
  hero: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 20,
  },
  heroEmojiCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 48 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginTop: 10 },
  heroChips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    margin: 3,
  },
  heroChipText: { color: '#fff', fontSize: 12, fontWeight: '600', marginLeft: 4 },
  paramsNote: {
    marginTop: 14,
    fontSize: 11,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    ...SHADOW.soft,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  info: { flex: 1, marginLeft: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: '700', color: COLORS.text, flexShrink: 1 },
  popular: { marginLeft: 4, fontSize: 13 },
  description: { fontSize: 13, color: COLORS.muted, marginTop: 3, lineHeight: 18 },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
