import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Vibration,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById, Product } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import { STUDENT, PRICE_MULTIPLIER, VARIANT, ROOM_LABEL } from '@constants/student';
import Watermark from '@components/Watermark';
import { ShopStackParamList } from '@navigation/ShopStack';

type DetailRouteProp = RouteProp<ShopStackParamList, 'Detail'>;

export const DetailScreen = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;

  const addItem = useCartStore((state) => state.addItem);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
  });

  const handleAddToCart = () => {
    if (!product) return;

    // Haptic selection cho số cuối 1
    if (VARIANT.hapticOnAdd === 'impact') {
      Vibration.vibrate(40);
    } else {
      Vibration.vibrate(20);
    }

    const priceScaled = Math.round(product.price * PRICE_MULTIPLIER);

    addItem({
      id: product.id,
      title: product.title,
      price: priceScaled,
      image: product.image,
    });

    Alert.alert(
      `KTXGo · ${STUDENT.mssv}`,
      `Đã thêm "${product.title}" vào giỏ hàng thành công!\nPhòng nhận: ${ROOM_LABEL}`
    );
  };

  const formattedPrice = product
    ? Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ'
    : '28.500 đ';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header with Back button and Stack badge */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>← Chi tiết món</Text>
        </TouchableOpacity>
        <Text style={styles.stackBadge}>Stack</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#1D4ED8" />
          <Text style={styles.loadingText}>Đang tải chi tiết món...</Text>
        </View>
      ) : isError || !product ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
          <Text style={styles.errorMessage}>Không thể tải chi tiết món #{id}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container} bounces={false}>
          {/* Food Image Banner */}
          <View style={styles.imageCard}>
            {!imgError && product.image ? (
              <>
                <Image
                  source={{ uri: product.image }}
                  style={styles.detailImage}
                  resizeMode="cover"
                  onLoadEnd={() => setImgLoading(false)}
                  onError={() => {
                    setImgLoading(false);
                    setImgError(true);
                  }}
                />
                {imgLoading && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color="#1D4ED8" />
                  </View>
                )}
              </>
            ) : (
              <View style={styles.fallbackBox}>
                <Text style={styles.fallbackEmoji}>🍲</Text>
              </View>
            )}
          </View>

          {/* Centered Product Info */}
          <View style={styles.infoSection}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>{formattedPrice}</Text>
            <Text style={styles.subtitle}>Giao nội khu · nhận tận {ROOM_LABEL}</Text>

            <View style={styles.descBox}>
              <Text style={styles.descText} numberOfLines={3}>
                {product.description || 'Mô tả ngắn từ API (tối đa 3 dòng).'}
              </Text>
              <Text style={styles.idNote}>Mã món #{product.id} · Giữ nguyên id từ route.params</Text>
            </View>
          </View>

          {/* Action Button: Thêm vào giỏ · Haptic */}
          <TouchableOpacity
            style={styles.addCartBtn}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Text style={styles.addCartBtnText}>Thêm vào giỏ · Haptic</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

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
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  stackBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EA580C',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexGrow: 1,
  },
  imageCard: {
    width: '100%',
    height: 180,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  detailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  fallbackBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackEmoji: {
    fontSize: 54,
  },
  infoSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A8A',
    textAlign: 'center',
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1D4ED8',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  descBox: {
    width: '100%',
    marginTop: 14,
    paddingHorizontal: 10,
  },
  descText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
  },
  idNote: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
  addCartBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addCartBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
    marginTop: 12,
  },
  errorMssv: {
    fontSize: 18,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 36,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default DetailScreen;
