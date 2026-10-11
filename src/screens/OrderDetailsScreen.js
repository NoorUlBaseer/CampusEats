import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/ui';
import { COLORS, RADIUS, SHADOW } from '../theme';

export default function OrderDetailsScreen({ route }) {
  // RECEIVING PARAMS: orderId comes from CartScreen (after checkout)
  // or from OrdersScreen (when the user taps an order).
  const { orderId } = route.params;
  const { orders } = useCart();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return <EmptyState emoji="🤔" title="Order not found" subtitle={`No order with id ${orderId}.`} />;
  }

  // Short pickup code shown at the counter (last 4 digits of the id).
  const pickupCode = orderId.slice(-4);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Green hero that continues the green header */}
      <View style={styles.hero}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={44} color={COLORS.success} />
        </View>
        <Text style={styles.title}>Order placed!</Text>
        <Text style={styles.subtitle}>{order.placedAt}</Text>
      </View>

      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>PICKUP CODE</Text>
        <Text style={styles.code}>{pickupCode}</Text>
        <Text style={styles.codeHint}>Show this at the counter to collect your food</Text>
      </View>

      <View style={styles.receipt}>
        <Text style={styles.receiptTitle}>Receipt</Text>
        <Text style={styles.receiptId}>Order ID: {orderId}</Text>
        <View style={styles.dashed} />
        {order.items.map((entry) => (
          <View key={entry.item.id} style={styles.line}>
            <Text style={styles.lineText}>
              {entry.item.emoji}  {entry.quantity} × {entry.item.name}
            </Text>
            <Text style={styles.lineText}>Rs. {entry.item.price * entry.quantity}</Text>
          </View>
        ))}
        <View style={styles.dashed} />
        <View style={styles.line}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={[styles.totalText, styles.totalValue]}>Rs. {order.total}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 32 },
  hero: {
    backgroundColor: COLORS.success,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 56,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 14 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  codeCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginHorizontal: 20,
    marginTop: -36, // overlaps the green hero
    padding: 20,
    alignItems: 'center',
    ...SHADOW.medium,
  },
  codeLabel: { fontSize: 12, fontWeight: '700', color: COLORS.muted, letterSpacing: 2 },
  code: { fontSize: 44, fontWeight: '900', color: COLORS.text, letterSpacing: 8, marginTop: 4 },
  codeHint: { fontSize: 13, color: COLORS.muted, marginTop: 4, textAlign: 'center' },
  receipt: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 20,
    ...SHADOW.soft,
  },
  receiptTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  receiptId: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  dashed: {
    borderTopWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    marginVertical: 14,
  },
  line: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  lineText: { fontSize: 15, color: COLORS.text },
  totalText: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  totalValue: { color: COLORS.success },
});
