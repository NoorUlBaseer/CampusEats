import { COLORS } from '../theme';

// Common header styling shared by every navigator: a clean, flat header that
// blends into the screen background. Some screens override it (see the stacks).
export const sharedHeaderOptions = {
  headerStyle: { backgroundColor: COLORS.background },
  headerShadowVisible: false, // no bottom border/shadow under the header
  headerTintColor: COLORS.text, // colour of the title and back button
  headerTitleStyle: { fontWeight: '700', fontSize: 18 },
  headerTitleAlign: 'center',
};
