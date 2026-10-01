import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import useCampusLocation, { KTX_GATE_COORDS } from '@hooks/useCampusLocation';
import { STUDENT, examStamp, ROOM_LABEL, VARIANT, BASE_SHIP_FEE } from '@constants/student';
import { COLORS, SIZES } from '@constants/theme';
import Typography from '@components/ui/Typography';
import ShopButton from '@components/ShopButton';
import Watermark from '@components/Watermark';

export const MeScreen = () => {
  const logout = useAuthStore((state) => state.logout);
  const phoneNumber = useAuthStore((state) => state.phoneNumber);

  const {
    status,
    coords,
    distanceKm,
    shipFee,
    errorMessage,
    requestLocationPermission,
    openSettings,
    mockLocation,
  } = useCampusLocation();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi KTXGo?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const handleTestHaptic = () => {
    if (VARIANT.hapticOnAdd === 'impact') {
      Vibration.vibrate(40);
      Alert.alert('Haptic Feedback', `Đã rung kiểu IMPACT (40ms) - [${STUDENT.mssv}]`);
    } else {
      Vibration.vibrate(20);
      Alert.alert('Haptic Feedback', `Đã rung kiểu SELECTION (20ms) - [${STUDENT.mssv}]`);
    }
  };

  const stamp = examStamp();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Typography variant="h1">🎓</Typography>
          </View>
          <Typography variant="h2" color={COLORS.text} style={{ fontWeight: '900' }}>
            {STUDENT.hoTen}
          </Typography>
          <Typography variant="body1" color={COLORS.primary} style={{ fontWeight: '700', marginTop: 2 }}>
            MSSV: {STUDENT.mssv}
          </Typography>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Typography variant="small" color="#B45309" style={{ fontWeight: '700' }}>
                Phòng {ROOM_LABEL}
              </Typography>
            </View>
            <View style={[styles.tag, { backgroundColor: '#EDE9FE' }]}>
              <Typography variant="small" color="#6D28D9" style={{ fontWeight: '700' }}>
                Stamp #{stamp}
              </Typography>
            </View>
          </View>
          {phoneNumber && (
            <Typography variant="body2" color={COLORS.textLight} style={{ marginTop: 8 }}>
              📱 {phoneNumber}
            </Typography>
          )}
        </View>

        {/* Location & Shipping Section (Chương 7) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Typography variant="h3" color={COLORS.text} style={{ fontWeight: '800' }}>
              📍 Định vị GPS & Phí Ship KTX
            </Typography>
            <View
              style={[
                styles.statusBadge,
                status === 'granted'
                  ? styles.statusGranted
                  : status === 'blocked'
                  ? styles.statusBlocked
                  : styles.statusDenied,
              ]}
            >
              <Typography variant="small" color="#1E293B" style={{ fontWeight: '800', fontSize: 9 }}>
                {status === 'granted'
                  ? 'ĐÃ CẤP QUYỀN'
                  : status === 'blocked'
                  ? 'BỊ CHẶN (BLOCKED)'
                  : status === 'denied'
                  ? 'TỪ CHỐI'
                  : 'CHƯA CẤP'}
              </Typography>
            </View>
          </View>

          <Typography variant="small" color={COLORS.textLight} style={{ marginBottom: 10 }}>
            Cổng KTX IUH ({KTX_GATE_COORDS.latitude}, {KTX_GATE_COORDS.longitude})
          </Typography>

          {status === 'checking' && (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={COLORS.primary} size="small" />
              <Typography variant="small" color={COLORS.textLight} style={{ marginLeft: 8 }}>
                Đang kiểm tra quyền GPS...
              </Typography>
            </View>
          )}

          {status === 'granted' && coords && (
            <View style={styles.locationResultBox}>
              <Typography variant="body2" color={COLORS.text} style={{ marginVertical: 2 }}>
                • Tọa độ hiện tại: <Typography variant="body2" color={COLORS.primary} style={{ fontWeight: '700' }}>{coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}</Typography>
              </Typography>
              <Typography variant="body2" color={COLORS.text} style={{ marginVertical: 2 }}>
                • Khoảng cách từ Cổng KTX: <Typography variant="body2" color={COLORS.primary} style={{ fontWeight: '700' }}>{distanceKm} km</Typography> (Haversine)
              </Typography>
              <Typography variant="body2" color={COLORS.text} style={{ marginVertical: 2 }}>
                • Công thức phí ship ({VARIANT.shipFormula}): <Typography variant="body2" color={COLORS.primary} style={{ fontWeight: '800' }}>{shipFee.toLocaleString('vi-VN')} đ</Typography>
              </Typography>
              <Typography variant="small" color={COLORS.textLight} style={{ fontStyle: 'italic', marginTop: 4 }}>
                {VARIANT.shipFormula === 'B'
                  ? `[Công thức B: ${BASE_SHIP_FEE} + (${distanceKm} * 1500) + 2000]`
                  : `[Công thức A: ${BASE_SHIP_FEE} + (${distanceKm} * 2000)]`}
              </Typography>
            </View>
          )}

          {errorMessage && (
            <View style={styles.errorContainer}>
              <Typography variant="small" color={COLORS.error} style={{ fontWeight: '600' }}>
                ⚠️ {errorMessage}
              </Typography>
            </View>
          )}

          <View style={styles.buttonRow}>
            <ShopButton
              title="📡 Xin quyền / Định vị"
              onPress={requestLocationPermission}
              style={{ height: 38, paddingHorizontal: 12 }}
              textStyle={{ fontSize: 12 }}
            />

            {status === 'blocked' && (
              <ShopButton
                title="⚙️ Mở Cài đặt"
                variant="danger"
                onPress={openSettings}
                style={{ height: 38, paddingHorizontal: 12 }}
                textStyle={{ fontSize: 12 }}
              />
            )}

            <ShopButton
              title="🧪 Giả lập toạ độ"
              variant="outline"
              onPress={() => mockLocation({ latitude: 10.8250, longitude: 106.6905 })}
              style={{ height: 38, paddingHorizontal: 12 }}
              textStyle={{ fontSize: 12 }}
            />
          </View>
        </View>

        {/* VARIANT & System Info */}
        <View style={styles.sectionCard}>
          <Typography variant="h3" color={COLORS.text} style={{ fontWeight: '800' }}>
            ⚙️ Thông tin Biến thể đề thi (VARIANT)
          </Typography>
          <View style={styles.variantList}>
            <Typography variant="body2" color={COLORS.text} style={{ marginVertical: 2 }}>• Số cuối MSSV: <Typography variant="body2" color={COLORS.primary} style={{ fontWeight: '700' }}>1</Typography></Typography>
            <Typography variant="body2" color={COLORS.text} style={{ marginVertical: 2 }}>• Watermark: <Typography variant="body2" color={COLORS.primary} style={{ fontWeight: '700' }}>{VARIANT.watermarkAtTop ? 'Trên' : 'Dưới'}</Typography></Typography>
            <Typography variant="body2" color={COLORS.text} style={{ marginVertical: 2 }}>• Ô Login: <Typography variant="body2" color={COLORS.primary} style={{ fontWeight: '700' }}>{VARIANT.authField}</Typography></Typography>
            <Typography variant="body2" color={COLORS.text} style={{ marginVertical: 2 }}>• Thứ tự Tab: <Typography variant="body2" color={COLORS.primary} style={{ fontWeight: '700' }}>{VARIANT.tabOrder}</Typography></Typography>
            <Typography variant="body2" color={COLORS.text} style={{ marginVertical: 2 }}>• Haptic: <Typography variant="body2" color={COLORS.primary} style={{ fontWeight: '700' }}>{VARIANT.hapticOnAdd}</Typography></Typography>
            <Typography variant="body2" color={COLORS.text} style={{ marginVertical: 2 }}>• Công thức Ship: <Typography variant="body2" color={COLORS.primary} style={{ fontWeight: '700' }}>Công thức {VARIANT.shipFormula}</Typography></Typography>
            <Typography variant="body2" color={COLORS.text} style={{ marginVertical: 2 }}>• Chi tiết món: <Typography variant="body2" color={COLORS.primary} style={{ fontWeight: '700' }}>{VARIANT.detailPresentation}</Typography></Typography>
          </View>

          <ShopButton
            title={`📳 Thử nghiệm Rung Haptic (${VARIANT.hapticOnAdd})`}
            variant="outline"
            onPress={handleTestHaptic}
            style={{ marginTop: 8, height: 42 }}
            textStyle={{ fontSize: 12 }}
          />
        </View>

        {/* Logout Button */}
        <ShopButton
          title="🚪 Đăng xuất khỏi KTXGo"
          variant="danger"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </ScrollView>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SIZES.padding,
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusGranted: { backgroundColor: '#DCFCE7' },
  statusBlocked: { backgroundColor: '#FEE2E2' },
  statusDenied: { backgroundColor: '#FEF3C7' },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  locationResultBox: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: SIZES.radiusSm,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 6,
    marginVertical: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  variantList: {
    marginVertical: 6,
  },
  logoutButton: {
    marginTop: 4,
  },
});

export default MeScreen;
