import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { showAlert } from '../utils/alert';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS, SHADOW } from '../theme';
import PhoneVerificationModal from '../components/PhoneVerificationModal';

export default function ProfileScreen({ navigation }) {
  const { orders, favourites } = useCart();
  const { user, logout, isPhoneVerified, verifiedPhone } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
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
      onPress: () =>
        showAlert(
          'Help & support',
          'Visit the cafeteria counter or email support@campuseats.pk'
        ),
    },
    {
      icon: 'information-circle-outline',
      label: 'About CampusEats',
      onPress: () => navigation.navigate('About'),
    },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user ? '🎓' : '👤'}</Text>
        </View>

        {user ? (
          <>
            <Text style={styles.name}>{user.displayName || 'FAST Student'}</Text>
            <Text style={styles.meta}>{user.email}</Text>

            {/* Phone Verification Status */}
            <View style={styles.phoneSection}>
              {isPhoneVerified ? (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.verifiedText}>
                    Verified Phone: {verifiedPhone || user.phoneNumber}
                  </Text>
                </View>
              ) : (
                <View style={styles.unverifiedBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="alert-circle" size={16} color="#D97706" />
                    <Text style={styles.unverifiedText}>Phone Not Verified</Text>
                  </View>
                  <Pressable
                    style={styles.verifyOtpBtn}
                    onPress={() => setModalVisible(true)}
                  >
                    <Ionicons name="shield-checkmark-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
                    <Text style={styles.verifyOtpBtnText}>Verify with OTP</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.name}>Guest Student</Text>
            <Text style={styles.meta}>Sign in with Email to manage orders & profile</Text>
            <Pressable
              style={styles.signInButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Ionicons name="log-in-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.signInButtonText}>Sign In / Create Account</Text>
            </Pressable>
          </>
        )}

        <View style={styles.stats}>
          <Stat value={orders.length} label="Orders" />
          <View style={styles.statDivider} />
          <Stat value={favourites.length} label="Favourites" />
          <View style={styles.statDivider} />
          <Stat value={`Rs. ${totalSpent}`} label="Spent" />
        </View>
      </View>

      {/* Menu Options */}
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

      {/* Logout option if signed in */}
      {user && (
        <Pressable
          style={styles.logoutBtn}
          onPress={() =>
            showAlert('Sign Out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: logout },
            ])
          }
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </Pressable>
      )}

      {/* Phone OTP Verification Modal */}
      <PhoneVerificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 4, textAlign: 'center' },
  phoneSection: {
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successSoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
    marginLeft: 6,
  },
  unverifiedBox: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  unverifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 4,
  },
  verifyOtpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    marginTop: 6,
  },
  verifyOtpBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    marginTop: 14,
    ...SHADOW.primary,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
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
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.danger,
  },
});
