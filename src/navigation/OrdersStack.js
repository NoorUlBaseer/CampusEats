import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import { MenuButton } from '../components/HeaderButtons';
import { COLORS } from '../theme';
import { sharedHeaderOptions } from './headerOptions';

const Stack = createNativeStackNavigator();

// STACK NAVIGATOR #2 (inside the "Orders" tab)
// OrdersList -> OrderDetails
export default function OrdersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...sharedHeaderOptions,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name="OrdersList"
        component={OrdersScreen}
        options={{
          title: 'My Orders',
          headerLeft: () => <MenuButton />,
        }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={({ route }) => ({
          title: `Order ${route.params.orderId}`, // title from params
          headerStyle: { backgroundColor: COLORS.success }, // green "success" header
          headerTintColor: '#fff',
        })}
      />
    </Stack.Navigator>
  );
}
