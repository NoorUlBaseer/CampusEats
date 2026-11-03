import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alert';
import { COLORS, RADIUS, SHADOW } from '../theme';
import PhoneVerificationModal from '../components/PhoneVerificationModal';

export default function LoginScreen({ navigation }) {
  const {
    user,
    signInWithEmail,
    signUpWithEmail,
    logout,
    isPhoneVerified,
    verifiedPhone,
    isConfigured,
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);

  const handleAuthSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        showAlert('Weak Password', 'Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        showAlert('Password Mismatch', 'Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        showAlert('Welcome Back!', 'You have successfully signed in.', [
          {
            text: 'Continue',
            onPress: () => {
              if (navigation.canGoBack()) navigation.goBack();
              else navigation.navigate('Home');
            },
          },
        ]);
      } else {
        await signUpWithEmail(email, password, name);
        showAlert('Account Created!', 'Welcome to CampusEats. Please verify your phone number.', [
          {
            text: 'Verify Phone Now',
            onPress: () => setOtpModalVisible(true),
          },
          {
            text: 'Later',
            style: 'cancel',
            onPress: () => {
              if (navigation.canGoBack()) navigation.goBack();
              else navigation.navigate('Home');
            },
          },
        ]);
      }
    } catch (error) {
      let msg = error.message;
      if (error.code === 'auth/invalid-email') {
        msg = 'Invalid email address format.';
      } else if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        msg = 'Incorrect email or password. Please try again.';
      } else if (error.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Try signing in.';
      }
      showAlert(mode === 'login' ? 'Sign In Failed' : 'Sign Up Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated with Email & Password
  if (user) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 44 }}>🎓</Text>
          </View>
          <Text style={styles.name}>{user.displayName || 'FAST Student'}</Text>
          <Text style={styles.emailText}>{user.email}</Text>

          {/* Phone OTP Verification Status */}
          <View style={styles.verificationCard}>
            <View style={styles.verificationRow}>
              <Ionicons
                name={isPhoneVerified ? 'checkmark-circle' : 'alert-circle'}
                size={22}
                color={isPhoneVerified ? COLORS.success : '#D97706'}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.verificationTitle}>
                  {isPhoneVerified ? 'Phone Number Verified' : 'Phone Not Verified'}
                </Text>
                <Text style={styles.verificationSubtitle}>
                  {isPhoneVerified
                    ? verifiedPhone || user.phoneNumber
                    : 'Verify your phone via SMS OTP for order updates.'}
                </Text>
              </View>
            </View>

            {!isPhoneVerified && (
              <Pressable
                style={styles.verifyOtpBtn}
                onPress={() => setOtpModalVisible(true)}
              >
                <Ionicons name="shield-checkmark-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.verifyOtpBtnText}>Verify with Phone OTP</Text>
              </Pressable>
            )}
          </View>

          <Pressable
            style={styles.logoutButton}
            onPress={() =>
              showAlert('Log out', 'Are you sure you want to sign out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log out', style: 'destructive', onPress: logout },
              ])
            }
          >
            <Ionicons name="log-out-outline" size={18} color={COLORS.danger} style={{ marginRight: 6 }} />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </Pressable>
        </View>

        <PhoneVerificationModal
          visible={otpModalVisible}
          onClose={() => setOtpModalVisible(false)}
        />
      </ScrollView>
    );
  }

  // Not logged in: Show Email/Password Form
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Branding */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={{ fontSize: 36 }}>🍽️</Text>
          </View>
          <Text style={styles.title}>CampusEats</Text>
          <Text style={styles.subtitle}>
            Sign in with your email to order food and access your student account.
          </Text>
        </View>

        {!isConfigured && (
          <View style={styles.warningBox}>
            <Ionicons name="information-circle" size={20} color="#D97706" />
            <Text style={styles.warningText}>
              Firebase credentials not configured. Please fill{' '}
              <Text style={{ fontWeight: '700' }}>src/firebase/firebaseConfig.js</Text>.
            </Text>
          </View>
        )}

        {/* Tab Toggle: Sign In / Sign Up */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, mode === 'login' && styles.tabActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
              Sign In
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, mode === 'signup' && styles.tabActive]}
            onPress={() => setMode('signup')}
          >
            <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
              Create Account
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {mode === 'signup' && (
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Noor Ul Baseer"
                placeholderTextColor={COLORS.muted}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="student@isb.nu.edu.pk"
              placeholderTextColor={COLORS.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={COLORS.muted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.muted}
                />
              </Pressable>
            </View>
          </View>

          {mode === 'signup' && (
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.muted}
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          )}

          <Pressable
            style={[styles.submitBtn, loading && styles.btnDisabled]}
            onPress={handleAuthSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </Pressable>
        </View>

        <PhoneVerificationModal
          visible={otpModalVisible}
          onClose={() => setOtpModalVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...SHADOW.soft,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAEAEF',
    borderRadius: RADIUS.pill,
    padding: 4,
    marginBottom: 18,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.pill,
  },
  tabActive: {
    backgroundColor: COLORS.card,
    ...SHADOW.soft,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.muted,
  },
  tabTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
    ...SHADOW.soft,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  emailText: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
    marginBottom: 16,
  },
  verificationCard: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  verificationSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  verifyOtpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  verifyOtpBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    width: '100%',
    marginTop: 14,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
  },
  field: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  eyeBtn: {
    padding: 12,
  },
  submitBtn: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    ...SHADOW.primary,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
