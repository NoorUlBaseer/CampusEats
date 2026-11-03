import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import RootDrawer from './src/navigation/RootDrawer';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <RootDrawer />
        </NavigationContainer>
        <StatusBar style="dark" />
      </CartProvider>
    </AuthProvider>
  );
}
