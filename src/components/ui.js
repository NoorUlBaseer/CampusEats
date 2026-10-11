// Small reusable UI building blocks shared by the screens.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '../theme';

// Rounded coloured square with a big emoji, used for food/cafeteria images.
export function EmojiTile({ emoji, tint = COLORS.primarySoft, size = 56 }) {
  return (
    <View
      style={[
        styles.tile,
        { backgroundColor: tint, width: size, height: size, borderRadius: size * 0.3 },
      ]}
    >
      <Text style={{ fontSize: size * 0.55 }}>{emoji}</Text>
    </View>
  );
}

// Small rounded label, e.g. "⭐ 4.6" or "10–15 min".
export function Chip({ icon, label, color = COLORS.text, background = COLORS.background }) {
  return (
    <View style={[styles.chip, { backgroundColor: background }]}>
      {icon && <Ionicons name={icon} size={13} color={color} style={styles.chipIcon} />}
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </View>
  );
}

export function PrimaryButton({ label, onPress, icon, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.primary, pressed && styles.pressed, style]}
    >
      {icon && <Ionicons name={icon} size={20} color="#fff" style={styles.primaryIcon} />}
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

// − 2 + control used on the item and cart screens.
export function QuantityStepper({ value, onDecrease, onIncrease, compact = false }) {
  const size = compact ? 28 : 40;
  return (
    <View style={[styles.stepper, compact && styles.stepperCompact]}>
      <Pressable onPress={onDecrease} hitSlop={8} style={[styles.stepBtn, { width: size, height: size }]}>
        <Ionicons name="remove" size={compact ? 16 : 20} color={COLORS.text} />
      </Pressable>
      <Text style={[styles.stepValue, compact && styles.stepValueCompact]}>{value}</Text>
      <Pressable
        onPress={onIncrease}
        hitSlop={8}
        style={[styles.stepBtn, styles.stepBtnPlus, { width: size, height: size }]}
      >
        <Ionicons name="add" size={compact ? 16 : 20} color="#fff" />
      </Pressable>
    </View>
  );
}

export function EmptyState({ emoji, title, subtitle, actionLabel, onAction }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyCircle}>
        <Text style={styles.emptyEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
      {actionLabel && (
        <PrimaryButton label={actionLabel} onPress={onAction} style={styles.emptyButton} />
      )}
    </View>
  );
}

export function SectionTitle({ children, style }) {
  return <Text style={[styles.section, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    marginRight: 6,
  },
  chipIcon: { marginRight: 4 },
  chipText: { fontSize: 12, fontWeight: '600' },
  primary: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.primary,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  primaryIcon: { marginRight: 8 },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.pill,
    padding: 4,
    ...SHADOW.soft,
  },
  stepperCompact: { boxShadow: 'none', backgroundColor: COLORS.background },
  stepBtn: {
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  stepBtnPlus: { backgroundColor: COLORS.primary },
  stepValue: { fontSize: 18, fontWeight: '700', minWidth: 44, textAlign: 'center', color: COLORS.text },
  stepValueCompact: { fontSize: 14, minWidth: 28 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: COLORS.background,
  },
  emptyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  emptySubtitle: { fontSize: 14, color: COLORS.muted, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  emptyButton: { marginTop: 24, alignSelf: 'stretch' },
  section: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
});
