import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { STUDENT } from '@constants/student';
import Watermark from '@components/Watermark';

export const LoginScreen = () => {
  const login = useAuthStore((state) => state.login);
  const [authInput, setAuthInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Số cuối 1 -> Ô Login: phone
  const placeholderText = `Số điện thoại — ${STUDENT.mssv}`;

  const handleLogin = () => {
    setError('');
    const trimmed = authInput.trim() || STUDENT.mssv;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(trimmed);
    }, 400);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          {/* Brand Header */}
          <View style={styles.headerBox}>
            <Text style={styles.brandTitle}>KTXGO</Text>
            <Text style={styles.brandSubtitle}>Giao đồ tận phòng ký túc xá</Text>
          </View>

          {/* Input Box with (A) Badge */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={placeholderText}
              placeholderTextColor="#94A3B8"
              value={authInput}
              onChangeText={(t) => {
                setAuthInput(t);
                if (error) setError('');
              }}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
            <Text style={styles.badgeA}>(A)</Text>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          {/* Action Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginBtnText}>Vào cửa hàng</Text>
            )}
          </TouchableOpacity>

          {/* Footer Subtitle */}
          <Text style={styles.footerText}>Auth Stack · chưa có token</Text>
        </View>
      </KeyboardAvoidingView>

      {/* Watermark DƯỚI cho thí sinh số cuối 1 */}
      <Watermark />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1E3A8A',
    fontWeight: '500',
    paddingVertical: 0,
  },
  badgeA: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
    marginLeft: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  loginBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default LoginScreen;
