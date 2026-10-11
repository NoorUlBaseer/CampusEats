import { Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import MainTabs from './MainTabs';
import DrawerContent from './DrawerContent';
import FavouritesScreen from '../screens/FavouritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AboutScreen from '../screens/AboutScreen';
import { HeaderIconButton } from '../components/HeaderButtons';
import { COLORS } from '../theme';
import { sharedHeaderOptions } from './headerOptions';

const Drawer = createDrawerNavigator();

const drawerIcon =
  (name) =>
  ({ color, size }) =>
    <Ionicons name={name} size={size} color={color} />;

// DRAWER NAVIGATOR (the root of the app)
// Drawer -> Home (Tabs) -> Browse (Stack) -> screens
export default function RootDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        ...sharedHeaderOptions,
        headerLeftContainerStyle: { paddingLeft: 8 },
        headerRightContainerStyle: { paddingRight: 8 },
        drawerActiveTintColor: COLORS.primary,
        drawerActiveBackgroundColor: COLORS.primarySoft,
        drawerInactiveTintColor: COLORS.text,
        drawerLabelStyle: { fontWeight: '600', fontSize: 15 },
        drawerItemStyle: { borderRadius: 14, marginHorizontal: 12 },
        drawerStyle: { backgroundColor: COLORS.card, width: 290 },
      }}
    >
      {/* The tabs and stacks inside Home show their own headers. */}
      <Drawer.Screen
        name="Home"
        component={MainTabs}
        options={{ headerShown: false, drawerIcon: drawerIcon('home-outline') }}
      />
      <Drawer.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ title: 'My Favourites', drawerIcon: drawerIcon('heart-outline') }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          drawerIcon: drawerIcon('person-outline'),
          headerRight: () => (
            <HeaderIconButton
              icon="log-out-outline"
              color={COLORS.danger}
              onPress={() =>
                Alert.alert('Log out', 'Are you sure you want to log out?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Log out', style: 'destructive' },
                ])
              }
            />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About CampusEats',
          drawerIcon: drawerIcon('information-circle-outline'),
          // A different header style for this screen only.
          headerStyle: { backgroundColor: COLORS.text },
          headerTintColor: '#fff',
        }}
      />
    </Drawer.Navigator>
  );
}
