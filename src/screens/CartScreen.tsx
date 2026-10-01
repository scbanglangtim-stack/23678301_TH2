import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCartStore, CartItem } from '@stores/cartStore';
import useCampusLocation from '@hooks/useCampusLocation';
import { STUDENT, ROOM_LABEL, VARIANT, BASE_SHIP_FEE } from '@constants/student';
import Watermark from '@components/Watermark';

export const CartScreen = () => {
  const navigation = useNavigation();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const changeQty = useCartStore((state) => state.changeQty);
  const clearCart = useCartStore((state) => state.clearCart);

  // totalAmount() tính trực tiếp từ store (price đã nhân PRICE_MULTIPLIER lúc add)
  const totalItems = useCartStore((state) => state.totalAmount());

  const { coords, shipFee } = useCampusLocation();

  // Phí ship: lấy từ GPS nếu đã có quyền, không thì dùng BASE_SHIP_FEE
  const effectiveShipFee = coords ? shipFee : BASE_SHIP_FEE;
  const grandTotal = totalItems + (items.length > 0 ? effectiveShipFee : 0);

  const formattedItemsTotal = totalItems.toLocaleString('vi-VN') + ' đ';
  const formattedShipFee = effectiveShipFee.toLocaleString('vi-VN') + ' đ';
  const formattedGrandTotal = grandTotal.toLocaleString('vi-VN') + ' đ';

  const handleCheckout = () => {
    if (items.length === 0) return;

    Alert.alert(
      `Xác nhận đặt đơn · KTXGo`,
      `Sinh viên: ${STUDENT.hoTen} (${STUDENT.mssv})\nPhòng nhận: ${ROOM_LABEL}\nTiền hàng: ${formattedItemsTotal}\nPhí ship (công thức ${VARIANT.shipFormula}): ${formattedShipFee}\nTổng: ${formattedGrandTotal}\n(Shipper nội khu sẽ giao tận phòng)`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            clearCart();
            Alert.alert('🎉 Thành công', `Đơn hàng đã được đặt tới phòng ${ROOM_LABEL}!`);
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemTotal = (item.price * item.quantity).toLocaleString('vi-VN') + ' đ';

    return (
      <View style={styles.itemCard}>
        {/* Thông tin sản phẩm */}
        <View style={styles.itemLeft}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemSubtitle}>
            ×{item.quantity}  {itemTotal}
          </Text>
        </View>

        {/* Nút sửa SL: − / + và xóa */}
        <View style={styles.itemActions}>
          {/* Nút − giảm SL (nếu SL = 1 thì xóa) */}
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => changeQty(item.id, -1)}
            activeOpacity={0.8}
            accessibilityLabel={`Giảm số lượng ${item.title}`}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qtyNumber}>{item.quantity}</Text>

          {/* Nút + tăng SL */}
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => changeQty(item.id, 1)}
            activeOpacity={0.8}
            accessibilityLabel={`Tăng số lượng ${item.title}`}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>

          {/* Nút xóa */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => removeItem(item.id)}
            activeOpacity={0.8}
            accessibilityLabel={`Xóa ${item.title}`}
            accessibilityRole="button"
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Blue Header Banner */}
      <View style={styles.blueBanner}>
        <Text style={styles.bannerTitle}>GIỎ HÀNG</Text>
        {items.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllBtn}
            onPress={clearCart}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.clearAllText}>Xoá hết</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        /* ─── GIỎ TRỐNG ───────────────────────────────────────────── */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
          <Text style={styles.emptySubtitle}>
            Chưa có món nào. Hãy quay lại Cửa hàng để chọn món nhé!
          </Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => (navigation as any).navigate('Shop')}
            activeOpacity={0.85}
          >
            <Text style={styles.shopNowText}>Khám phá món ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ─── CÓ HÀNG TRONG GIỎ ──────────────────────────────────── */
        <View style={styles.content}>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={
              <View>
                {/* Delivery Info Card — cam viền theo mockup */}
                <View style={styles.deliveryCard}>
                  <Text style={styles.deliveryRoom}>Giao đến {ROOM_LABEL}</Text>
                  <Text style={styles.deliveryShip}>
                    Phí ship: {formattedShipFee} (công thức {VARIANT.shipFormula})
                  </Text>
                </View>

                {/* Tổng hàng (items subtotal) */}
                <Text style={styles.subtotalText}>
                  Tiền hàng: {formattedItemsTotal}
                </Text>

                {/* Grand total */}
                <Text style={styles.totalText}>
                  Tổng hàng: {formattedGrandTotal}
                </Text>

                {/* Checkout Button */}
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={handleCheckout}
                  activeOpacity={0.85}
                >
                  <Text style={styles.checkoutText}>Xác nhận đặt hàng</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
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
  blueBanner: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  clearAllBtn: {
    position: 'absolute',
    right: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#DC2626',
    borderRadius: 6,
  },
  clearAllText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },

  // ── Item Card ──────────────────────────────────────────────────────────────
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemLeft: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ── Qty +/− buttons ────────────────────────────────────────────────────────
  qtyBtn: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: '#1D4ED8',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
  },
  qtyNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E3A8A',
    minWidth: 24,
    textAlign: 'center',
  },
  deleteBtn: {
    backgroundColor: '#DC2626',
    width: 30,
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  deleteIcon: {
    fontSize: 13,
  },

  // ── Delivery + Totals ──────────────────────────────────────────────────────
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EA580C',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 4,
    marginBottom: 10,
  },
  deliveryRoom: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  deliveryShip: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EA580C',
    marginTop: 3,
  },
  subtotalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'right',
    marginBottom: 4,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D4ED8',
    textAlign: 'center',
    marginBottom: 12,
  },
  checkoutBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 4,
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── Empty Cart ─────────────────────────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  shopNowBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 22,
    marginTop: 16,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CartScreen;
