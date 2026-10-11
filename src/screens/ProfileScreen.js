import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { COLORS, RADIUS, SHADOW } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { orders, favourites } = useCart();
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  // Each row navigates somewhere else in the app (or shows an alert).
  const rows = [
    {
      icon: 'receipt-outline',
      label: 'My orders',
      onPress: () => navigation.navigate('Home', { screen: 'Orders' }),
    },
    {
      icon: 'heart-outline',
      label: 'My favourites',
      onPress: () => navigation.navigate('Favourites'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & support',
      onPress: () => Alert.alert('Help & support', 'Visit the cafeteria counter or email support@campuseats.pk'),
    },
    {
      icon: 'information-circle-outline',
      label: 'About CampusEats',
      onPress: () => navigation.navigate('About'),
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🎓</Text>
        </View>
        <Text style={styles.name}>FAST Student</Text>
        <Text style={styles.meta}>BS Computer Science · Karachi Campus</Text>

        <View style={styles.stats}>
          <Stat value={orders.length} label="Orders" />
          <View style={styles.statDivider} />
          <Stat value={favourites.length} label="Favourites" />
          <View style={styles.statDivider} />
          <Stat value={`Rs. ${totalSpent}`} label="Spent" />
        </View>
      </View>

      <View style={styles.menu}>
        {rows.map((row, index) => (
          <Pressable
            key={row.label}
            onPress={row.onPress}
            style={({ pressed }) => [
              styles.row,
              index < rows.length - 1 && styles.rowBorder,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.rowIcon}>
              <Ionicons name={row.icon} size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingTop: 8 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 24,
    alignItems: 'center',
    ...SHADOW.soft,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    ...SHADOW.medium,
  },
  avatarText: { fontSize: 48 },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginTop: 14 },
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    alignSelf: 'stretch',
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: COLORS.border },
  menu: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginTop: 18,
    paddingHorizontal: 16,
    ...SHADOW.soft,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderColor: COLORS.border },
  pressed: { opacity: 0.6 },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
});
