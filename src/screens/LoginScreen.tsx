import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { STUDENT, VARIANT, ROOM_LABEL } from '@constants/student';
import { COLORS, SIZES } from '@constants/theme';
import Typography from '@components/ui/Typography';
import ShopInput from '@components/ui/ShopInput';
import ShopButton from '@components/ShopButton';
import Watermark from '@components/Watermark';

export const LoginScreen = () => {
  const login = useAuthStore((state) => state.login);
  const [authInput, setAuthInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isPhoneField = VARIANT.authField === 'phone';
  const fieldLabel = isPhoneField ? 'Số điện thoại sinh viên' : 'Email sinh viên';
  const fieldPlaceholder = isPhoneField ? 'Nhập 10 số điện thoại (vd: 0987654321)' : 'Nhập email sinh viên (vd: sv@student.iuh.edu.vn)';

  const handleLogin = () => {
    setError('');
    const trimmed = authInput.trim();

    if (!trimmed) {
      setError(`Vui lòng nhập ${fieldLabel.toLowerCase()}`);
      return;
    }

    if (isPhoneField) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(trimmed)) {
        setError('Số điện thoại phải gồm đúng 10 chữ số hợp lệ');
        return;
      }
    } else {
      if (!trimmed.includes('@')) {
        setError('Email không đúng định dạng');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(trimmed);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {VARIANT.watermarkAtTop && <Watermark />}

          <View style={styles.headerBox}>
            <View style={styles.iconCircle}>
              <Typography variant="h1">🛵</Typography>
            </View>
            <Typography variant="h1" color={COLORS.primary} style={styles.title}>
              KTXGo
            </Typography>
            <Typography variant="body1" color={COLORS.textLight} style={styles.subtitle}>
              Dịch vụ giao đồ tận phòng Ký túc xá
            </Typography>
            <View style={styles.roomBadge}>
              <Typography variant="small" color="#B45309" style={{ fontWeight: '700' }}>
                Khu nội trú · {ROOM_LABEL}
              </Typography>
            </View>
          </View>

          <View style={styles.formCard}>
            <Typography variant="h2" color={COLORS.text} style={styles.formTitle}>
              Đăng nhập ứng dụng
            </Typography>

            <ShopInput
              label={fieldLabel}
              placeholder={fieldPlaceholder}
              value={authInput}
              onChangeText={(text) => {
                setAuthInput(text);
                if (error) setError('');
              }}
              error={error}
              keyboardType={isPhoneField ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
            />

            <ShopButton
              title="Vào cửa hàng ➔"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.infoBox}>
              <Typography variant="small" color={COLORS.textLight} style={{ fontWeight: '600' }}>
                Thí sinh: {STUDENT.hoTen} ({STUDENT.mssv})
              </Typography>
              <Typography variant="small" color={COLORS.primary} style={{ fontWeight: '700', marginTop: 2 }}>
                Biến thể đăng nhập: {VARIANT.authField.toUpperCase()}
              </Typography>
            </View>
          </View>

          {!VARIANT.watermarkAtTop && <Watermark />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  title: {
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    textAlign: 'center',
  },
  roomBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  formCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  formTitle: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 10,
  },
  infoBox: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
});

export default LoginScreen;
