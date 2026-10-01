import React from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCartStore, CartItem } from '@stores/cartStore';
import useCampusLocation from '@hooks/useCampusLocation';
import { STUDENT, ROOM_LABEL, VARIANT } from '@constants/student';
import { COLORS, SIZES } from '@constants/theme';
import Typography from '@components/ui/Typography';
import ShopButton from '@components/ShopButton';
import Watermark from '@components/Watermark';

export const CartScreen = () => {
  const navigation = useNavigation();
  const items = useCartStore((state) => state.items);
  const changeQty = useCartStore((state) => state.changeQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalAmount = useCartStore((state) => state.totalAmount());
  const totalQuantity = useCartStore((state) => state.totalQuantity());
  const clearCart = useCartStore((state) => state.clearCart);

  const { coords, distanceKm, shipFee } = useCampusLocation();

  const formattedProductTotal = totalAmount.toLocaleString('vi-VN') + ' đ';
  const effectiveShipFee = coords ? shipFee : 0;
  const grandTotal = totalAmount + effectiveShipFee;
  const formattedGrandTotal = grandTotal.toLocaleString('vi-VN') + ' đ';

  const handleCheckout = () => {
    if (items.length === 0) return;

    Alert.alert(
      `Xác nhận đặt hàng · KTXGo`,
      `Sinh viên: ${STUDENT.hoTen} (${STUDENT.mssv})\nPhòng nhận: ${ROOM_LABEL}\nSố lượng món: ${totalQuantity}\nTổng thanh toán: ${formattedGrandTotal}\n(Shipper nội khu sẽ liên hệ giao tận phòng)`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận đặt đơn',
          onPress: () => {
            clearCart();
            Alert.alert(
              '🎉 Đặt đơn thành công!',
              `Đơn hàng đã được chuyển tới cửa hàng. Shipper đang chuẩn bị mang lên phòng ${ROOM_LABEL}.`
            );
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemTotal = (item.price * item.quantity).toLocaleString('vi-VN') + ' đ';

    return (
      <View style={styles.cartCard}>
        <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
        <View style={styles.itemInfo}>
          <Typography variant="body2" color={COLORS.text} style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Typography>
          <Typography variant="small" color={COLORS.textLight} style={{ marginTop: 2 }}>
            {item.price.toLocaleString('vi-VN')} đ
          </Typography>

          <View style={styles.actionRow}>
            <View style={styles.qtyBox}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => changeQty(item.id, -1)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Giảm số lượng"
                accessibilityRole="button"
              >
                <Typography variant="body1" color={COLORS.primary} style={{ fontWeight: 'bold' }}>−</Typography>
              </TouchableOpacity>
              <Typography variant="body1" color={COLORS.text} style={styles.qtyText}>
                {item.quantity}
              </Typography>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => changeQty(item.id, 1)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Tăng số lượng"
                accessibilityRole="button"
              >
                <Typography variant="body1" color={COLORS.primary} style={{ fontWeight: 'bold' }}>+</Typography>
              </TouchableOpacity>
            </View>

            <Typography variant="body1" color={COLORS.primary} style={{ fontWeight: '800' }}>
              {itemTotal}
            </Typography>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeItem(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={`Xóa ${item.title}`}
              accessibilityRole="button"
            >
              <Typography variant="body1">🗑️</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <View style={styles.header}>
        <Typography variant="h2" color={COLORS.primary} style={{ fontWeight: '800' }}>
          Giỏ hàng KTXGo
        </Typography>
        <View style={styles.roomTag}>
          <Typography variant="small" color="#B45309" style={{ fontWeight: '700' }}>
            Phòng {ROOM_LABEL}
          </Typography>
        </View>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Typography variant="h1" style={{ fontSize: 54, marginBottom: 12 }}>🛒</Typography>
          <Typography variant="h2" color={COLORS.text} style={{ fontWeight: '800' }}>
            Giỏ hàng đang trống!
          </Typography>
          <Typography variant="body1" color={COLORS.textLight} style={styles.emptySubtitle}>
            Bạn chưa chọn món nào. Hãy khám phá thực đơn hấp dẫn tại KTXGo nhé!
          </Typography>
          <ShopButton
            title="Khám phá món ngay ➔"
            onPress={() => (navigation as any).navigate('Shop')}
            style={styles.browseButton}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContainer}
          />

          {/* Checkout Bill Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.billRow}>
              <Typography variant="body2" color={COLORS.textLight}>Địa chỉ giao:</Typography>
              <Typography variant="body2" color={COLORS.primary} style={{ fontWeight: '700' }}>
                {ROOM_LABEL} · KTX IUH
              </Typography>
            </View>

            <View style={styles.billRow}>
              <Typography variant="body2" color={COLORS.textLight}>
                Tiền hàng ({totalQuantity} món):
              </Typography>
              <Typography variant="body2" color={COLORS.text} style={{ fontWeight: '600' }}>
                {formattedProductTotal}
              </Typography>
            </View>

            <View style={styles.billRow}>
              <Typography variant="body2" color={COLORS.textLight}>
                Phí ship {coords ? `(~${distanceKm}km)` : ''}:
              </Typography>
              <Typography variant="body2" color={COLORS.text} style={{ fontWeight: '600' }}>
                {coords ? `${shipFee.toLocaleString('vi-VN')} đ` : 'Chưa định vị (tab Tôi)'}
              </Typography>
            </View>

            <View style={styles.divider} />

            <View style={styles.billRow}>
              <Typography variant="h3" color={COLORS.text} style={{ fontWeight: '800' }}>
                Tổng cộng:
              </Typography>
              <Typography variant="h2" color={COLORS.primary} style={{ fontWeight: '900' }}>
                {formattedGrandTotal}
              </Typography>
            </View>

            <ShopButton
              title="Xác nhận đặt đơn KTX ➔"
              onPress={handleCheckout}
              style={styles.checkoutBtn}
            />
          </View>
        </View>
      )}

      {!VARIANT.watermarkAtTop && <Watermark />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  roomTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: SIZES.padding,
    paddingBottom: 8,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  itemImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontWeight: '700',
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  qtyText: {
    fontWeight: '800',
    marginHorizontal: 10,
  },
  deleteBtn: {
    padding: 4,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  checkoutBtn: {
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  browseButton: {
    marginTop: 20,
    width: 200,
  },
});

export default CartScreen;
