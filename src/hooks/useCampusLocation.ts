import { useState, useCallback, useEffect } from 'react';
import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type PermissionStatus = 'idle' | 'checking' | 'granted' | 'denied' | 'blocked';

// Tọa độ cổng KTX (Cố định trong code theo yêu cầu đề thi)
export const KTX_GATE_COORDS: Coordinates = {
  latitude: 10.8225,
  longitude: 106.6875,
};

// Công thức Haversine tính khoảng cách (km) giữa 2 tọa độ
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Bán kính Trái Đất (km)
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Tính phí ship theo đúng VARIANT.shipFormula ('A' hoặc 'B')
export function calculateShipFee(km: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  }
  // Formula B
  return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
}

export function useCampusLocation() {
  const [status, setStatus] = useState<PermissionStatus>('idle');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [shipFee, setShipFee] = useState<number>(BASE_SHIP_FEE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const computeLocationAndFee = useCallback((userCoords: Coordinates) => {
    setCoords(userCoords);
    const dist = calculateDistanceKm(
      KTX_GATE_COORDS.latitude,
      KTX_GATE_COORDS.longitude,
      userCoords.latitude,
      userCoords.longitude
    );
    setDistanceKm(dist);
    const fee = calculateShipFee(dist);
    setShipFee(fee);
  }, []);

  const requestLocationPermission = useCallback(async () => {
    setStatus('checking');
    setErrorMessage(null);

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'KTXGo cần quyền vị trí',
            message: 'Cho phép KTXGo truy cập vị trí để ước tính khoảng cách và phí ship nội khu KTX.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Cho phép',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setStatus('granted');
          // Giả lập/lấy toạ độ vị trí thực tế hoặc toạ độ trong KTX
          const defaultUserCoords: Coordinates = {
            latitude: 10.8242,
            longitude: 106.6890,
          };
          computeLocationAndFee(defaultUserCoords);
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setStatus('blocked');
          setErrorMessage('Quyền vị trí đã bị chặn vĩnh viễn (Blocked). Vui lòng mở Cài đặt để cấp quyền.');
        } else {
          setStatus('denied');
          setErrorMessage('Bạn đã từ chối cấp quyền vị trí.');
        }
      } else {
        // iOS
        setStatus('granted');
        const defaultUserCoords: Coordinates = {
          latitude: 10.8242,
          longitude: 106.6890,
        };
        computeLocationAndFee(defaultUserCoords);
      }
    } catch (err: any) {
      setStatus('denied');
      setErrorMessage(err.message || 'Lỗi khi xin quyền vị trí');
    }
  }, [computeLocationAndFee]);

  const openSettings = useCallback(() => {
    Linking.openSettings().catch(() => {
      Alert.alert('Thông báo', 'Không thể mở Cài đặt hệ thống');
    });
  }, []);

  // Cho phép mock toạ độ để test trên máy ảo
  const mockLocation = useCallback((newCoords: Coordinates) => {
    setStatus('granted');
    computeLocationAndFee(newCoords);
  }, [computeLocationAndFee]);

  return {
    status,
    coords,
    distanceKm,
    shipFee,
    errorMessage,
    requestLocationPermission,
    openSettings,
    mockLocation,
  };
}

export default useCampusLocation;
