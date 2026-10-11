import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { getCafeteriaByName } from '../data/cafeterias';
import { EmojiTile, EmptyState, PrimaryButton, QuantityStepper } from '../components/ui';
import { COLORS, RADIUS, SHADOW } from '../theme';

export default function CartScreen({ navigation }) {
  const { cart, cartCount, cartTotal, changeQuantity, placeOrder } = useCart();

  const handleCheckout = () => {
    const order = placeOrder();
    // PASSING PARAMS TO A SCREEN IN ANOTHER NAVIGATOR:
    // go to the "Orders" tab, then the "OrderDetails" screen inside its stack.
    // initial: false keeps OrdersList underneath, so the back button works.
    navigation.navigate('Orders', {
      screen: 'OrderDetails',
      params: { orderId: order.id },
      initial: false,
    });
  };

  if (cart.length === 0) {
    return (
      <EmptyState
        emoji="🛍️"
        title="Your cart is empty"
        subtitle="Looks like you haven't added anything yet. Hungry?"
        actionLabel="Browse cafeterias"
        onAction={() => navigation.navigate('Browse')}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        contentContainerStyle={styles.list}
        data={cart}
        keyExtractor={(e) => e.item.id}
        ListHeaderComponent={
          <Text style={styles.count}>
            {cartCount} item{cartCount === 1 ? '' : 's'} in your cart
          </Text>
        }
        renderItem={({ item: entry }) => (
          <View style={styles.row}>
            <EmojiTile
              emoji={entry.item.emoji}
              tint={getCafeteriaByName(entry.cafeteriaName)?.tint}
              size={64}
            />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {entry.item.name}
              </Text>
              <Text style={styles.meta}>{entry.cafeteriaName}</Text>
              <Text style={styles.price}>Rs. {entry.item.price * entry.quantity}</Text>
            </View>
            <QuantityStepper
              compact
              value={entry.quantity}
              onDecrease={() => changeQuantity(entry.item.id, -1)}
              onIncrease={() => changeQuantity(entry.item.id, 1)}
            />
          </View>
        )}
        ListFooterComponent={
          <View style={styles.summary}>
            <SummaryLine label="Subtotal" value={`Rs. ${cartTotal}`} />
            <SummaryLine label="Service fee" value="Free" highlight />
            <View style={styles.divider} />
            <SummaryLine label="Total" value={`Rs. ${cartTotal}`} bold />
            <View style={styles.pickupNote}>
              <Ionicons name="time-outline" size={16} color={COLORS.success} />
              <Text style={styles.pickupText}>Ready for pickup in about 15 minutes</Text>
            </View>
          </View>
        }
      />
      <View style={styles.footer}>
        <PrimaryButton
          icon="checkmark-circle"
          label={`Place order · Rs. ${cartTotal}`}
          onPress={handleCheckout}
        />
      </View>
    </View>
  );
}

function SummaryLine({ label, value, bold, highlight }) {
  return (
    <View style={styles.line}>
      <Text style={[styles.lineLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.lineValue, bold && styles.bold, highlight && styles.highlight]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 20, paddingTop: 4 },
  count: { fontSize: 14, color: COLORS.muted, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 12,
    ...SHADOW.soft,
  },
  info: { flex: 1, marginHorizontal: 12 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.primary, marginTop: 6 },
  summary: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 16,
    marginTop: 8,
    ...SHADOW.soft,
  },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  lineLabel: { fontSize: 15, color: COLORS.muted },
  lineValue: { fontSize: 15, color: COLORS.text, fontWeight: '600' },
  bold: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  highlight: { color: COLORS.success },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  pickupNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successSoft,
    borderRadius: RADIUS.sm,
    padding: 10,
    marginTop: 12,
  },
  pickupText: { color: COLORS.success, fontSize: 13, fontWeight: '600', marginLeft: 6 },
  footer: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    ...SHADOW.medium,
  },
});
