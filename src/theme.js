// Design tokens used across the app, so every screen looks consistent.

export const COLORS = {
  primary: '#FF6B35',
  primaryDark: '#E8551F',
  primarySoft: '#FFF0E8',
  background: '#F6F6F9',
  card: '#FFFFFF',
  text: '#1C1C28',
  muted: '#8E8EA0',
  border: '#ECECF2',
  success: '#1FA971',
  successSoft: '#E6F7EF',
  danger: '#E5484D',
  star: '#FFB800',
};

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

// boxShadow works on both iOS and Android with the New Architecture.
export const SHADOW = {
  soft: { boxShadow: '0px 4px 16px rgba(28, 28, 40, 0.06)' },
  medium: { boxShadow: '0px 8px 24px rgba(28, 28, 40, 0.10)' },
  primary: { boxShadow: '0px 8px 20px rgba(255, 107, 53, 0.35)' },
};
