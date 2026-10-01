import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import useCampusLocation from '@hooks/useCampusLocation';
import { STUDENT, examStamp } from '@constants/student';
import Watermark from '@components/Watermark';

export const MeScreen = () => {
  const logout = useAuthStore((state) => state.logout);

  const {
    status,
    distanceKm,
    shipFee,
    errorMessage,
    requestLocationPermission,
    openSettings,
  } = useCampusLocation();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi KTXGo?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const stamp = examStamp();
  const displayDistance = distanceKm > 0 ? distanceKm : 1.2;
  const formattedFee = shipFee.toLocaleString('vi-VN') + ' đ';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Blue Header Banner */}
      <View style={styles.blueBanner}>
        <Text style={styles.bannerTitle}>TÔI · LOCATION</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={styles.card}>
          <Text style={styles.studentName}>{STUDENT.hoTen}</Text>
          <Text style={styles.studentIdStamp}>
            {STUDENT.mssv}   #{stamp}
          </Text>
        </View>

        {/* Location Status Card matching Image 5 Tab Tôi */}
        <View style={styles.card}>
          <Text style={styles.permissionText}>
            Quyền: <Text style={[styles.permissionValue, status !== 'granted' && styles.permissionDenied]}>{status}</Text>
          </Text>

          <Text style={styles.distanceText}>
            ≈ {displayDistance} km tới cổng KTX
          </Text>

          <Text style={styles.feeLabel}>Phí ship ước tính</Text>
          <Text style={styles.feeValue}>{formattedFee}</Text>

          {!!errorMessage && (
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          )}
        </View>

        {/* 3 Action Buttons matching Image 5 Tab Tôi */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={requestLocationPermission}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Lấy vị trí ước tính ship</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOutline}
            onPress={openSettings}
            activeOpacity={0.85}
          >
            <Text style={styles.btnOutlineText}>Mở Cài đặt (blocked)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDanger}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Text style={styles.btnDangerText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  blueBanner: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E3A8A',
    textAlign: 'center',
  },
  studentIdStamp: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 3,
  },
  permissionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  permissionValue: {
    color: '#16A34A',
    fontWeight: '800',
  },
  permissionDenied: {
    color: '#DC2626',
  },
  distanceText: {
    fontSize: 13,
    color: '#334155',
    marginTop: 5,
    fontWeight: '500',
  },
  feeLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
  },
  feeValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#EA580C',
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 6,
  },
  buttonGroup: {
    marginTop: 4,
  },
  btnPrimary: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  btnOutline: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1D4ED8',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  btnOutlineText: {
    color: '#1D4ED8',
    fontSize: 15,
    fontWeight: '700',
  },
  btnDanger: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnDangerText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default MeScreen;
