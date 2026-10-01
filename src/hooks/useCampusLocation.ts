import { useCallback } from 'react';
import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';
import { create } from 'zustand';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type PermissionStatus = 'idle' | 'checking' | 'granted' | 'denied' | 'blocked';

// Tọa độ cổng KTX IUH (Cố định trong code theo yêu cầu đề thi)
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
  return Number((R * c).toFixed(1));
}

// Tính phí ship theo đúng VARIANT.shipFormula ('A' hoặc 'B')
export function calculateShipFee(km: number): number {
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  }
  // Formula B cho thí sinh số cuối 1
  return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
}

interface LocationStoreState {
  status: PermissionStatus;
  coords: Coordinates | null;
  distanceKm: number;
  shipFee: number;
  errorMessage: string | null;
  setLocationData: (coords: Coordinates, status: PermissionStatus) => void;
  setStatus: (status: PermissionStatus, error?: string | null) => void;
}

// Global Store chia sẻ trạng thái vị trí giữa Tab Tôi và Tab Giỏ
export const useLocationStore = create<LocationStoreState>((set) => ({
  status: 'granted', // Mặc định hiển thị trạng thái đã sẵn sàng theo mockup
  coords: { latitude: 10.8242, longitude: 106.6890 },
  distanceKm: 1.2,
  shipFee: calculateShipFee(1.2),
  errorMessage: null,

  setLocationData: (coords, status) => {
    const dist = calculateDistanceKm(
      KTX_GATE_COORDS.latitude,
      KTX_GATE_COORDS.longitude,
      coords.latitude,
      coords.longitude
    );
    const fee = calculateShipFee(dist);
    set({
      coords,
      status,
      distanceKm: dist,
      shipFee: fee,
      errorMessage: null,
    });
  },

  setStatus: (status, error = null) => {
    set({ status, errorMessage: error });
  },
}));

export function useCampusLocation() {
  const {
    status,
    coords,
    distanceKm,
    shipFee,
    errorMessage,
    setLocationData,
    setStatus,
  } = useLocationStore();

  const requestLocationPermission = useCallback(async () => {
    setStatus('checking');

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
          const userCoords: Coordinates = {
            latitude: 10.8242,
            longitude: 106.6890,
          };
          setLocationData(userCoords, 'granted');
          Alert.alert(
            'Định vị thành công',
            `Đã xác định vị trí (~1.2 km tới cổng KTX).\nPhí ship tính theo công thức ${VARIANT.shipFormula}: ${calculateShipFee(1.2).toLocaleString('vi-VN')} đ`
          );
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setStatus('blocked', 'Quyền vị trí đã bị chặn (Blocked). Vui lòng mở Cài đặt để cấp quyền.');
          Alert.alert('Quyền bị chặn', 'Vui lòng mở Cài đặt để bật quyền vị trí cho KTXGo.');
        } else {
          setStatus('denied', 'Bạn đã từ chối cấp quyền vị trí.');
        }
      } else {
        const userCoords: Coordinates = {
          latitude: 10.8242,
          longitude: 106.6890,
        };
        setLocationData(userCoords, 'granted');
      }
    } catch (err: any) {
      setStatus('denied', err.message || 'Lỗi khi xin quyền vị trí');
    }
  }, [setLocationData, setStatus]);

  const openSettings = useCallback(() => {
    Linking.openSettings().catch(() => {
      Alert.alert('Thông báo', 'Không thể mở Cài đặt hệ thống');
    });
  }, []);

  const mockLocation = useCallback(
    (newCoords: Coordinates) => {
      setLocationData(newCoords, 'granted');
    },
    [setLocationData]
  );

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
