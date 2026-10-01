import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById, Product } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import { STUDENT, PRICE_MULTIPLIER, VARIANT, ROOM_LABEL } from '@constants/student';
import { COLORS, SIZES } from '@constants/theme';
import Typography from '@components/ui/Typography';
import ShopButton from '@components/ShopButton';
import Watermark from '@components/Watermark';
import { ShopStackParamList } from '@navigation/ShopStack';

type DetailRouteProp = RouteProp<ShopStackParamList, 'Detail'>;

export const DetailScreen = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;

  const addItem = useCartStore((state) => state.addItem);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
  });

  const handleAddToCart = () => {
    if (!product) return;

    // Haptic feedback theo VARIANT
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
      `Đã thêm "${product.title}" vào giỏ hàng thành công!\nPhòng nhận: ${ROOM_LABEL}`,
      [
        { text: 'Tiếp tục mua' },
        {
          text: 'Xem giỏ hàng',
          onPress: () => (navigation as any).navigate('Cart'),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Typography variant="body1" color={COLORS.textLight} style={{ marginTop: 12 }}>
            Đang tải chi tiết món #{id} ({STUDENT.mssv})...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerBox}>
          <Typography variant="h1" style={{ marginBottom: 8 }}>⚠️</Typography>
          <Typography variant="h2" color={COLORS.error} style={{ fontWeight: '800' }}>
            Không thể tải chi tiết món!
          </Typography>
          <Typography variant="body2" color={COLORS.textLight} style={{ marginTop: 4, textAlign: 'center' }}>
            {(error as any)?.message || 'Vui lòng kiểm tra lại kết nối mạng'}
          </Typography>
          <ShopButton title="Thử lại" onPress={() => refetch()} style={{ marginTop: 16, height: 40 }} />
        </View>
      </SafeAreaView>
    );
  }

  const formattedPrice = Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageCard}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
          <View style={styles.badgeCategory}>
            <Typography variant="small" color={COLORS.primary} style={styles.badgeCategoryText}>
              {product.category}
            </Typography>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Typography variant="h2" color={COLORS.text} style={styles.title}>
            {product.title}
          </Typography>

          <View style={styles.ratingRow}>
            <Typography variant="body2" style={{ marginRight: 4 }}>⭐⭐⭐⭐⭐</Typography>
            <Typography variant="small" color={COLORS.textLight} style={{ fontWeight: '600' }}>
              {product.rating?.rate || 4.5} ({product.rating?.count || 120} đánh giá)
            </Typography>
            <View style={styles.deliveryBadge}>
              <Typography variant="small" color={COLORS.secondary} style={{ fontWeight: '700' }}>
                ⚡ Giao tận {ROOM_LABEL}
              </Typography>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Typography variant="body1" color={COLORS.textLight} style={{ marginRight: 8 }}>
              Đơn giá:
            </Typography>
            <Typography variant="h1" color={COLORS.primary} style={styles.priceValue}>
              {formattedPrice}
            </Typography>
          </View>

          <View style={styles.divider} />

          <Typography variant="h3" color={COLORS.text} style={styles.sectionHeading}>
            Mô tả chi tiết
          </Typography>
          <Typography variant="body1" color="#334155" style={styles.description}>
            {product.description}
          </Typography>

          <View style={styles.metaBox}>
            <Typography variant="body2" color={COLORS.text}>• Mã sản phẩm: KTX-{STUDENT.mssv}-{product.id}</Typography>
            <Typography variant="body2" color={COLORS.text} style={{ marginTop: 2 }}>• Thời gian giao dự kiến: 10 - 20 phút</Typography>
            <Typography variant="body2" color={COLORS.text} style={{ marginTop: 2 }}>• Phục vụ nội khu: KTX Trường ĐH Công nghiệp TP.HCM</Typography>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSummary}>
          <Typography variant="small" color={COLORS.textLight}>Thành tiền</Typography>
          <Typography variant="h2" color={COLORS.primary} style={{ fontWeight: '900' }}>
            {formattedPrice}
          </Typography>
        </View>
        <ShopButton
          title="🛒 Thêm vào giỏ"
          onPress={handleAddToCart}
          style={{ width: 160 }}
        />
      </View>

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    padding: SIZES.padding,
    paddingBottom: 24,
  },
  imageCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    height: 260,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeCategory: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeCategoryText: {
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontWeight: '800',
    lineHeight: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  deliveryBadge: {
    marginLeft: 10,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
  },
  priceValue: {
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  sectionHeading: {
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    lineHeight: 20,
  },
  metaBox: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: SIZES.radiusSm,
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceSummary: {
    flex: 1,
  },
});

export default DetailScreen;
