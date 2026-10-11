import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { COLORS, SHADOW } from '../theme';

// Basic icon button used in navigation headers.
// `filled` draws a white circle behind the icon (for transparent headers).
export function HeaderIconButton({ icon, onPress, color = COLORS.text, filled = false }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={({ pressed }) => [styles.button, filled && styles.filled, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={22} color={color} />
    </Pressable>
  );
}

// Hamburger button. Screens nested inside Tabs/Stack don't get the drawer's
// header, so we dispatch openDrawer(); the action bubbles up to the Drawer.
export function MenuButton({ color }) {
  const navigation = useNavigation();
  return (
    <HeaderIconButton
      icon="menu"
      color={color}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    />
  );
}

// Cart icon with item count. Navigates from the Browse stack to the Cart tab.
export function CartHeaderButton({ color = COLORS.text }) {
  const navigation = useNavigation();
  const { cartCount } = useCart();
  return (
    <Pressable
      onPress={() => navigation.navigate('Cart')}
      hitSlop={10}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name="bag-handle-outline" size={24} color={color} />
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </Pressable>
  );
}

// "Clear" button on the Cart screen. Asks for confirmation, then clears the cart.
export function ClearCartButton() {
  const { cart, clearCart } = useCart();
  const onPress = () => {
    if (cart.length === 0) {
      Alert.alert('Cart is empty', 'There is nothing to clear.');
      return;
    }
    Alert.alert('Clear cart?', 'All items will be removed from your cart.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart },
    ]);
  };
  return (
    <Pressable onPress={onPress} hitSlop={10} style={styles.textButton}>
      <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
      <Text style={styles.textButtonLabel}>Clear</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  filled: { backgroundColor: '#fff', ...SHADOW.soft },
  pressed: { opacity: 0.6 },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginHorizontal: 4,
  },
  textButtonLabel: { color: COLORS.danger, fontSize: 14, fontWeight: '700', marginLeft: 4 },
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});
