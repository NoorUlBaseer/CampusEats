import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  linkWithPhoneNumber,
  signInWithPhoneNumber,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, isFirebaseConfigured } from '../firebase/firebaseConfig';

const AuthContext = createContext(null);
const STORAGE_PHONE_KEY = '@campuseats_verified_phone';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifiedPhone, setVerifiedPhone] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState(null);

  useEffect(() => {
    // Enable bypass for test phone numbers in development
    if (__DEV__) {
      auth.settings.appVerificationDisabledForTesting = true;
    }

    // Load locally saved verified phone number
    AsyncStorage.getItem(STORAGE_PHONE_KEY)
      .then((saved) => {
        if (saved) setVerifiedPhone(saved);
      })
      .catch((err) => console.log('Error loading saved phone:', err));

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.phoneNumber) {
        setVerifiedPhone(currentUser.phoneNumber);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Helper to get or create an ApplicationVerifier compatible with Firebase modular SDK
   */
  const getAppVerifier = (customVerifier = null) => {
    if (customVerifier) return customVerifier;

    // On Web, instantiate a real invisible RecaptchaVerifier if possible
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      try {
        const { RecaptchaVerifier } = require('firebase/auth');
        let container = document.getElementById('recaptcha-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'recaptcha-container';
          container.style.display = 'none';
          document.body.appendChild(container);
        }

        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {},
            'expired-callback': () => {},
          });
        }
        return window.recaptchaVerifier;
      } catch (err) {
        console.warn('Web RecaptchaVerifier fallback:', err);
      }
    }

    // Comprehensive mock verifier for mobile / test mode
    // Crucial: Must implement _reset() because Firebase internally calls verifier?._reset() in finally
    return {
      type: 'recaptcha',
      verify: async () => 'mock-token',
      render: async () => 0,
      reset: () => {},
      _reset: () => {},
      clear: () => {},
      assertNotDestroyed: () => {},
    };
  };

  /**
   * Sign In with Email & Password
   */
  const signInWithEmail = async (email, password) => {
    if (!isFirebaseConfigured()) {
      throw new Error(
        'Firebase is not yet configured. Please add your credentials in src/firebase/firebaseConfig.js'
      );
    }
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return userCredential.user;
  };

  /**
   * Register with Email, Password and Display Name
   */
  const signUpWithEmail = async (email, password, displayName) => {
    if (!isFirebaseConfigured()) {
      throw new Error(
        'Firebase is not yet configured. Please add your credentials in src/firebase/firebaseConfig.js'
      );
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName?.trim()) {
      await updateProfile(userCredential.user, {
        displayName: displayName.trim(),
      });
      // Force update current user state
      setUser({ ...userCredential.user, displayName: displayName.trim() });
    }
    return userCredential.user;
  };

  /**
   * Sign Out from Firebase
   */
  const logout = async () => {
    await firebaseSignOut(auth);
    setConfirmationResult(null);
    setPendingPhoneNumber(null);
  };

  /**
   * Request Phone OTP verification.
   */
  const sendPhoneOtp = async (phoneNumber, customVerifier = null) => {
    if (!isFirebaseConfigured()) {
      throw new Error(
        'Firebase is not yet configured. Please add your credentials in src/firebase/firebaseConfig.js'
      );
    }

    const verifier = getAppVerifier(customVerifier);

    let confirmation;
    if (auth.currentUser) {
      try {
        confirmation = await linkWithPhoneNumber(auth.currentUser, phoneNumber, verifier);
      } catch (err) {
        // If already linked or credential in use, fallback to signInWithPhoneNumber for verification
        if (
          err.code === 'auth/provider-already-linked' ||
          err.code === 'auth/credential-already-in-use'
        ) {
          confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        } else {
          throw err;
        }
      }
    } else {
      confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    }

    setConfirmationResult(confirmation);
    setPendingPhoneNumber(phoneNumber);
    return confirmation;
  };

  /**
   * Verify the received 6-digit OTP code and save phone as verified.
   */
  const verifyPhoneOtp = async (code) => {
    if (!confirmationResult) {
      throw new Error('No OTP request found. Please request a new code.');
    }

    await confirmationResult.confirm(code);
    const confirmedNumber = pendingPhoneNumber;

    if (confirmedNumber) {
      await AsyncStorage.setItem(STORAGE_PHONE_KEY, confirmedNumber);
      setVerifiedPhone(confirmedNumber);
    }

    setConfirmationResult(null);
    setPendingPhoneNumber(null);
    return confirmedNumber;
  };

  /**
   * Clear the verified phone status
   */
  const removeVerifiedPhone = async () => {
    await AsyncStorage.removeItem(STORAGE_PHONE_KEY);
    setVerifiedPhone(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        logout,
        // Phone OTP verification
        sendPhoneOtp,
        verifyPhoneOtp,
        verifiedPhone,
        isPhoneVerified: Boolean(verifiedPhone || user?.phoneNumber),
        removeVerifiedPhone,
        isConfigured: isFirebaseConfigured(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
