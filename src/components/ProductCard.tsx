import React, { memo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, Vibration } from 'react-native';
import { Product } from '@services/productApi';
import { PRICE_MULTIPLIER, VARIANT } from '@constants/student';
import { COLORS, SIZES } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';
import Typography from '@components/ui/Typography';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SIZES.padding * 2 - SIZES.paddingSm) / 2;

interface Props {
  product: Product;
  onPress: () => void;
}

export const ProductCard = ({ product, onPress }: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const formattedPrice = Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';

  const handleAddToCart = () => {
    // Kích hoạt haptic feedback theo đúng VARIANT.hapticOnAdd ('selection' cho số cuối 1)
    if (VARIANT.hapticOnAdd === 'impact') {
      Vibration.vibrate(40);
    } else {
      Vibration.vibrate(20);
    }

    addItem({
      id: product.id,
      title: product.title,
      price: Math.round(product.price * PRICE_MULTIPLIER),
      image: product.image,
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        <View style={styles.categoryBadge}>
          <Typography variant="small" color={COLORS.primary} style={styles.categoryText} numberOfLines={1}>
            {product.category}
          </Typography>
        </View>
      </View>

      <View style={styles.content}>
        <Typography variant="body2" color={COLORS.text} style={styles.title} numberOfLines={2}>
          {product.title}
        </Typography>

        <View style={styles.priceRow}>
          <View style={{ flex: 1 }}>
            <Typography variant="body1" color={COLORS.primary} style={styles.price}>
              {formattedPrice}
            </Typography>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={`Thêm ${product.title} vào giỏ`}
            accessibilityRole="button"
          >
            <Typography variant="h3" color={COLORS.white} style={styles.addIcon}>
              +
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.paddingSm,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#FFFFFF',
    padding: 8,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  content: {
    padding: 10,
    backgroundColor: COLORS.surface,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '700',
    lineHeight: 16,
    height: 32,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontWeight: '900',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    lineHeight: 20,
    fontWeight: '800',
  },
});

export default memo(ProductCard);
