import { StyleSheet, Text, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useCart } from '../context/CartContext';
import { COLORS, RADIUS } from '../theme';

// Custom drawer content: a profile card on top, then the normal drawer items.
export default function DrawerContent(props) {
  const { orders, cartCount } = useCart();

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🎓</Text>
          </View>
          <Text style={styles.name}>FAST Student</Text>
          <Text style={styles.meta}>
            {orders.length} orders · {cartCount} in cart
          </Text>
        </View>

        {/* Renders the drawer screens (Home, Favourites, Profile, About) */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <Text style={styles.footer}>CampusEats v1.0 · FAST NUCES</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 0 },
  profile: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 64,
    marginBottom: 12,
    borderBottomRightRadius: RADIUS.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32 },
  name: { color: '#fff', fontSize: 20, fontWeight: '800' },
  meta: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  footer: { textAlign: 'center', color: COLORS.muted, fontSize: 12, padding: 20 },
});
