import React, { memo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Vibration, Text, Image, ActivityIndicator } from 'react-native';
import { Product } from '@services/productApi';
import { PRICE_MULTIPLIER, VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

const PASTEL_COLORS = ['#FEF3C7', '#DBEAFE', '#DCFCE7', '#FCE7F3', '#EDE9FE', '#FFEDD5'];

interface Props {
  product: Product;
  index?: number;
  onPress: () => void;
}

export const ProductCard = ({ product, index = 0, onPress }: Props) => {
  const addItem = useCartStore((state) => state.addItem);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formattedPrice = Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';
  const bgColor = PASTEL_COLORS[index % PASTEL_COLORS.length];

  const handleAddToCart = () => {
    // Haptic selection (20ms) cho thí sinh số cuối 1
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
    <TouchableOpacity activeOpacity={0.88} style={styles.card} onPress={onPress}>
      {/* Image Container with pastel background and clean food thumbnail */}
      <View style={[styles.imageContainer, { backgroundColor: bgColor }]}>
        {!imageError && product.image ? (
          <>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
            {imageLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color="#1D4ED8" />
              </View>
            )}
          </>
        ) : (
          <View style={styles.fallbackBlock}>
            <Text style={styles.fallbackEmoji}>🍲</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formattedPrice}</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={`Thêm ${product.title} vào giỏ`}
            accessibilityRole="button"
          >
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    margin: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    overflow: 'hidden',
    padding: 8,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1.5,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  fallbackBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackEmoji: {
    fontSize: 34,
  },
  content: {
    marginTop: 6,
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  price: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  addButton: {
    backgroundColor: '#1D4ED8',
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 16,
  },
});

export default memo(ProductCard);
