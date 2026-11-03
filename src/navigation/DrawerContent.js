import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alert';
import { COLORS, RADIUS } from '../theme';

// Custom drawer content: a profile card on top, then the normal drawer items.
export default function DrawerContent(props) {
  const { orders, cartCount } = useCart();
  const { user, logout, isPhoneVerified } = useAuth();

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        <Pressable
          style={styles.profile}
          onPress={() => {
            if (!user) {
              props.navigation.navigate('Login');
            } else {
              props.navigation.navigate('Profile');
            }
          }}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user ? '🎓' : '👤'}</Text>
          </View>
          <Text style={styles.name}>
            {user ? user.displayName || user.email : 'Campus Guest'}
          </Text>
          <Text style={styles.meta}>
            {user
              ? `${orders.length} orders · ${isPhoneVerified ? 'Verified Phone ✅' : 'Unverified Phone ⚠️'}`
              : 'Tap to sign in with Email & Password'}
          </Text>
        </Pressable>

        {/* Renders the drawer screens (Home, Favourites, Profile, About, Login) */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {user && (
        <Pressable
          style={styles.logoutRow}
          onPress={() =>
            showAlert('Sign Out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: logout },
            ])
          }
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      )}

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
  name: { color: '#fff', fontSize: 17, fontWeight: '800' },
  meta: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.danger,
  },
  footer: { textAlign: 'center', color: COLORS.muted, fontSize: 12, padding: 16 },
});
