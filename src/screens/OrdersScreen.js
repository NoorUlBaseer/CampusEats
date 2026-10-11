import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { Chip, EmptyState } from '../components/ui';
import { COLORS, RADIUS, SHADOW } from '../theme';

export default function OrdersScreen({ navigation }) {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <EmptyState
        emoji="🧾"
        title="No orders yet"
        subtitle="Orders you place will show up here."
        actionLabel="Start ordering"
        onAction={() => navigation.navigate('Browse')}
      />
    );
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={orders}
      keyExtractor={(o) => o.id}
      renderItem={({ item: order }) => {
        const itemCount = order.items.reduce((sum, e) => sum + e.quantity, 0);
        const summary = order.items.map((e) => e.item.name).join(', ');
        return (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            // PASSING PARAMS: only the id is sent; OrderDetails looks up the rest.
            onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
          >
            <View style={styles.top}>
              <View style={styles.icon}>
                <Text style={styles.iconEmoji}>{order.items[0]?.item.emoji ?? '🧾'}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.id}>{order.id}</Text>
                <Text style={styles.meta}>{order.placedAt}</Text>
              </View>
              <Chip
                icon="checkmark-circle"
                label="Placed"
                color={COLORS.success}
                background={COLORS.successSoft}
              />
            </View>
            <Text style={styles.summary} numberOfLines={1}>
              {summary}
            </Text>
            <View style={styles.bottom}>
              <Text style={styles.meta}>
                {itemCount} item{itemCount === 1 ? '' : 's'}
              </Text>
              <View style={styles.totalRow}>
                <Text style={styles.total}>Rs. {order.total}</Text>
                <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
              </View>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 20, paddingTop: 4 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 14,
    ...SHADOW.soft,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  top: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 24 },
  info: { flex: 1, marginLeft: 12 },
  id: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  summary: { fontSize: 14, color: COLORS.text, marginTop: 12 },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  totalRow: { flexDirection: 'row', alignItems: 'center' },
  total: { fontSize: 16, fontWeight: '800', color: COLORS.primary, marginRight: 4 },
});
