import { useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderIconButton } from '../components/HeaderButtons';
import { Chip, PrimaryButton, QuantityStepper } from '../components/ui';
import { useCart } from '../context/CartContext';
import { getCafeteriaByName } from '../data/cafeterias';
import { COLORS, RADIUS, SHADOW } from '../theme';
import { showAlert } from '../utils/alert';

const HEADER_HEIGHT = 56;

export default function ItemDetailsScreen({ route, navigation }) {
  // RECEIVING PARAMS: the full item object sent from MenuScreen.
  const { item, cafeteriaName } = route.params;
  const cafeteria = getCafeteriaByName(cafeteriaName);
  const { addToCart, isFavourite, toggleFavourite } = useCart();
  const [quantity, setQuantity] = useState(1);
  const favourite = isFavourite(item.id);
  const insets = useSafeAreaInsets();

  // HEADER OPTIONS SET FROM INSIDE THE SCREEN.
  // - title comes from the params
  // - the header is transparent so the coloured hero shows behind it
  // - the heart button adds/removes the item from favourites. This runs
  //   again whenever `favourite` changes, so the icon updates.
  useLayoutEffect(() => {
    navigation.setOptions({
      title: item.name,
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' }, // needed on web
      headerTintColor: '#fff',
      headerRight: () => (
        <HeaderIconButton
          filled
          icon={favourite ? 'heart' : 'heart-outline'}
          color={COLORS.danger}
          onPress={() => toggleFavourite(item, cafeteriaName)}
        />
      ),
    });
  }, [navigation, item, cafeteriaName, favourite]);

  const handleAddToCart = () => {
    addToCart(item, cafeteriaName, quantity);
    showAlert('Added to cart 🛍️', `${quantity} × ${item.name} added.`, [
      { text: 'Keep browsing', onPress: () => navigation.goBack() },
      { text: 'View cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <View
          style={[
            styles.hero,
            { backgroundColor: cafeteria.color, paddingTop: insets.top + HEADER_HEIGHT },
          ]}
        >
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{item.name}</Text>
            {favourite && <Text style={styles.favBadge}>❤️</Text>}
          </View>
          <Text style={styles.from}>from {cafeteriaName}</Text>

          <View style={styles.chips}>
            <Chip icon="star" label={`${cafeteria.rating}`} color={COLORS.star} background="#FFF8E1" />
            <Chip icon="time-outline" label={cafeteria.prepTime} background={COLORS.card} />
            {item.popular && <Chip label="🔥 Popular" color={COLORS.primary} background={COLORS.primarySoft} />}
          </View>

          <Text style={styles.price}>Rs. {item.price}</Text>

          <Text style={styles.sectionTitle}>About this item</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.pickupCard}>
            <Text style={styles.pickupEmoji}>📍</Text>
            <View style={styles.pickupInfo}>
              <Text style={styles.pickupTitle}>Pickup at {cafeteriaName}</Text>
              <Text style={styles.pickupMeta}>{cafeteria.location} · {cafeteria.timing}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar: quantity + add to cart */}
      <View style={styles.bottomBar}>
        <QuantityStepper
          value={quantity}
          onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          onIncrease={() => setQuantity((q) => q + 1)}
        />
        <PrimaryButton
          label={`Add · Rs. ${item.price * quantity}`}
          onPress={handleAddToCart}
          style={styles.addButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 24 },
  hero: { alignItems: 'center', paddingBottom: 56 },
  emojiCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 96 },
  // White sheet that overlaps the coloured hero.
  sheet: {
    marginTop: -32,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 26, fontWeight: '800', color: COLORS.text, flexShrink: 1 },
  favBadge: { fontSize: 20, marginLeft: 8 },
  from: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  chips: { flexDirection: 'row', marginTop: 14, flexWrap: 'wrap' },
  price: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginTop: 18 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginTop: 22 },
  description: { fontSize: 15, color: COLORS.muted, marginTop: 8, lineHeight: 22 },
  pickupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 14,
    marginTop: 22,
    ...SHADOW.soft,
  },
  pickupEmoji: { fontSize: 26, marginRight: 12 },
  pickupInfo: { flex: 1 },
  pickupTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  pickupMeta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    ...SHADOW.medium,
  },
  addButton: { flex: 1, marginLeft: 14 },
});
