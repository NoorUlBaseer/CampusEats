import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase project credentials
export const firebaseConfig = {
  apiKey: "AIzaSyAgcPFF-iN2hxERciWexir8nj1nTvevyWc",
  authDomain: "campuseats-9c35c.firebaseapp.com",
  projectId: "campuseats-9c35c",
  storageBucket: "campuseats-9c35c.firebasestorage.app",
  messagingSenderId: "347399471588",
  appId: "1:347399471588:web:8ce0e5e1e94179eadb07f1",
};

// Check if Firebase is already initialized to prevent duplicate app errors during hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Cross-platform Auth initialization
function getFirebaseAuth() {
  if (Platform.OS === 'web') {
    // On web, browser IndexedDB/LocalStorage is handled automatically
    return getAuth(app);
  }

  try {
    // On iOS & Android, use AsyncStorage persistence
    const { getReactNativePersistence } = require('firebase/auth');
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // Fallback if already initialized during Fast Refresh
    return getAuth(app);
  }
}

export const auth = getFirebaseAuth();

// Helper check to verify configuration
export const isFirebaseConfigured = () => {
  return (
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID"
  );
};

export default app;
