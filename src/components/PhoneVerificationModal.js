import React, { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { showAlert } from '../utils/alert';
import { COLORS, RADIUS, SHADOW } from '../theme';

export default function PhoneVerificationModal({ visible, onClose, onSuccess }) {
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();

  const [step, setStep] = useState(1); // 1 = Phone Input, 2 = OTP Input
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const otpInputRef = useRef(null);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setStep(1);
      setPhone('');
      setOtp('');
      setLoading(false);
      setTimer(30);
    }
  }, [visible]);

  // Resend timer countdown
  useEffect(() => {
    let interval = null;
    if (visible && step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [visible, step, timer]);

  const getFullPhone = () => {
    const cleaned = phone.replace(/\D/g, '');
    const formatted = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;
    return `${countryCode}${formatted}`;
  };

  const handleSendOtp = async () => {
    if (phone.trim().length < 7) {
      showAlert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      await sendPhoneOtp(getFullPhone());
      setStep(2);
      setTimer(30);
      setOtp('');
      setTimeout(() => otpInputRef.current?.focus(), 300);
    } catch (error) {
      let msg = error.message;
      if (error.code === 'auth/invalid-phone-number') {
        msg = 'Invalid phone number format. Check digits and country code.';
      } else if (error.code === 'auth/quota-exceeded') {
        msg = 'SMS quota reached. Please use test numbers in Firebase Console.';
      }
      showAlert('Failed to Send OTP', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.trim().length < 6) {
      showAlert('Invalid OTP', 'Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const verified = await verifyPhoneOtp(otp.trim());
      showAlert('Phone Verified!', `Your number (${verified}) is now verified with OTP.`);
      if (onSuccess) onSuccess(verified);
      onClose();
    } catch (error) {
      let msg = error.message;
      if (error.code === 'auth/invalid-verification-code') {
        msg = 'Incorrect verification code. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        msg = 'The verification code has expired. Please resend a new one.';
      }
      showAlert('Verification Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.iconCircle}>
              <Text style={{ fontSize: 28 }}>📱</Text>
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.title}>
                {step === 1 ? 'Verify Phone with OTP' : 'Enter Verification Code'}
              </Text>
              <Text style={styles.subtitle}>
                {step === 1
                  ? 'We will send a 6-digit one-time code to verify your phone.'
                  : `Code sent to ${getFullPhone()}`}
              </Text>
            </View>
            <Pressable hitSlop={12} onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.muted} />
            </Pressable>
          </View>

          {/* STEP 1: Phone input */}
          {step === 1 && (
            <View style={styles.content}>
              <Text style={styles.label}>Mobile Phone Number</Text>
              <View style={styles.phoneRow}>
                <View style={styles.countryBox}>
                  <TextInput
                    style={styles.countryInput}
                    value={countryCode}
                    onChangeText={setCountryCode}
                    keyboardType="phone-pad"
                  />
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="650 555 1234"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  autoFocus
                />
              </View>

              <Pressable
                style={[styles.primaryBtn, loading && styles.btnDisabled]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="paper-plane-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryBtnText}>Send Verification Code</Text>
                  </>
                )}
              </Pressable>

              <View style={styles.hintBox}>
                <Text style={styles.hintText}>
                  💡 <Text style={{ fontWeight: '700' }}>Testing Tip:</Text> Use the test phone number added in Firebase Console: <Text style={{ fontWeight: '700' }}>+1 650 555 1234</Text> with code <Text style={{ fontWeight: '700' }}>123456</Text>.
                </Text>
              </View>
            </View>
          )}

          {/* STEP 2: OTP input */}
          {step === 2 && (
            <View style={styles.content}>
              <View style={styles.changeRow}>
                <Text style={styles.label}>6-Digit Verification Code</Text>
                <Pressable onPress={() => setStep(1)}>
                  <Text style={styles.changeLink}>Change Number</Text>
                </Pressable>
              </View>

              <TextInput
                ref={otpInputRef}
                style={styles.otpInput}
                placeholder="123456"
                placeholderTextColor={COLORS.muted}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />

              <Pressable
                style={[styles.primaryBtn, loading && styles.btnDisabled]}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryBtnText}>Verify OTP Code</Text>
                  </>
                )}
              </Pressable>

              <View style={styles.resendRow}>
                {timer > 0 ? (
                  <Text style={styles.timerText}>
                    Resend code in <Text style={{ fontWeight: '700' }}>{timer}s</Text>
                  </Text>
                ) : (
                  <Pressable onPress={handleSendOtp} disabled={loading}>
                    <Text style={styles.resendLink}>Resend OTP Code</Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    ...SHADOW.medium,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  countryBox: {
    width: 70,
    height: 50,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  countryInput: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  phoneInput: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  otpInput: {
    height: 54,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 6,
    color: COLORS.text,
    marginBottom: 18,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.primary,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  resendRow: {
    marginTop: 14,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 13,
    color: COLORS.muted,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  hintBox: {
    marginTop: 14,
    padding: 10,
    backgroundColor: COLORS.primarySoft,
    borderRadius: RADIUS.sm,
  },
  hintText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 16,
  },
});
