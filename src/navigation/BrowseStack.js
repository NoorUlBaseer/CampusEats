import { StyleSheet, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CafeteriasScreen from '../screens/CafeteriasScreen';
import MenuScreen from '../screens/MenuScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import { CartHeaderButton, MenuButton } from '../components/HeaderButtons';
import { getCafeteriaById } from '../data/cafeterias';
import { COLORS } from '../theme';
import { sharedHeaderOptions } from './headerOptions';

const Stack = createNativeStackNavigator();

// Custom header title component (a logo instead of plain text).
function LogoTitle() {
  return (
    <Text style={styles.logo}>
      🍽️ Campus<Text style={styles.logoAccent}>Eats</Text>
    </Text>
  );
}

// STACK NAVIGATOR #1 (inside the "Browse" tab)
// Cafeterias -> Menu -> ItemDetails
export default function BrowseStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...sharedHeaderOptions,
        headerBackButtonDisplayMode: 'minimal', // show only the back arrow
      }}
    >
      <Stack.Screen
        name="Cafeterias"
        component={CafeteriasScreen}
        options={{
          headerTitle: () => <LogoTitle />, // custom title component
          headerLeft: () => <MenuButton />, // opens the drawer
          headerRight: () => <CartHeaderButton />, // goes to the Cart tab
        }}
      />
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        // Options as a function of the route: the title AND the header colour
        // come from the params, so every cafeteria gets its own header.
        options={({ route }) => {
          const cafeteria = getCafeteriaById(route.params.cafeteriaId);
          return {
            title: route.params.name,
            headerStyle: { backgroundColor: cafeteria.color },
            headerTintColor: '#fff',
            headerRight: () => <CartHeaderButton color="#fff" />,
          };
        }}
      />
      {/* The title, transparent header and favourite button for this screen
          are set inside the screen with navigation.setOptions(). */}
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  logo: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  logoAccent: { color: COLORS.primary },
});
