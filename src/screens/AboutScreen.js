import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../theme';

const FEATURES = [
  { icon: 'restaurant-outline', text: 'Browse menus from every campus cafeteria' },
  { icon: 'bag-handle-outline', text: 'Add to cart and order ahead, no queues' },
  { icon: 'heart-outline', text: 'Save your favourite dishes' },
  { icon: 'receipt-outline', text: 'Track orders with a pickup code' },
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.logo}>🍽️</Text>
        <Text style={styles.title}>
          Campus<Text style={styles.accent}>Eats</Text>
        </Text>
        <Text style={styles.tagline}>Skip the queue. Grab your food.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Features</Text>
        {FEATURES.map((f) => (
          <View key={f.text} style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Navigation structure</Text>
        <Text style={styles.code}>
          {`Drawer (root)
├─ Home → Tabs
│   ├─ Browse → Stack
│   │   ├─ Cafeterias
│   │   ├─ Menu
│   │   └─ ItemDetails
│   ├─ Cart
│   └─ Orders → Stack
│       ├─ OrdersList
│       └─ OrderDetails
├─ Favourites
├─ Profile
└─ About`}
        </Text>
      </View>

      <Text style={styles.footer}>Assignment 02 · Software for Mobile Devices</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20 },
  hero: { alignItems: 'center', paddingVertical: 16 },
  logo: { fontSize: 56 },
  title: { fontSize: 30, fontWeight: '900', color: COLORS.text, marginTop: 6 },
  accent: { color: COLORS.primary },
  tagline: { fontSize: 15, color: COLORS.muted, marginTop: 4 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginTop: 16,
    ...SHADOW.soft,
  },
  heading: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  feature: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: { flex: 1, fontSize: 14, color: COLORS.text },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    padding: 14,
    borderRadius: RADIUS.sm,
    lineHeight: 20,
  },
  footer: { textAlign: 'center', color: COLORS.muted, fontSize: 12, marginTop: 24 },
});
