import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import BrowseStack from './BrowseStack';
import OrdersStack from './OrdersStack';
import CartScreen from '../screens/CartScreen';
import { ClearCartButton, MenuButton } from '../components/HeaderButtons';
import { useCart } from '../context/CartContext';
import { COLORS, SHADOW } from '../theme';
import { sharedHeaderOptions } from './headerOptions';

const Tab = createBottomTabNavigator();

// [icon when focused, icon when not focused]
const TAB_ICONS = {
  Browse: ['home', 'home-outline'],
  Cart: ['bag-handle', 'bag-handle-outline'],
  Orders: ['receipt', 'receipt-outline'],
};

// TAB NAVIGATOR (the "Home" screen of the Drawer)
export default function MainTabs() {
  const { cartCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...sharedHeaderOptions,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 0,
          paddingTop: 6,
          ...SHADOW.medium,
        },
        tabBarBadgeStyle: { backgroundColor: COLORS.primary, fontSize: 11 },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={TAB_ICONS[route.name][focused ? 0 : 1]}
            size={size}
            color={color}
          />
        ),
      })}
    >
      {/* Browse and Orders are stacks with their own headers, so the tab header is hidden. */}
      <Tab.Screen
        name="Browse"
        component={BrowseStack}
        options={{ headerShown: false, title: 'Home' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'My Cart',
          tabBarLabel: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          headerLeft: () => <MenuButton />,
          headerLeftContainerStyle: { paddingLeft: 8 },
          headerRight: () => <ClearCartButton />, // asks for confirmation, then clears the cart
          headerRightContainerStyle: { paddingRight: 8 },
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
