import React, { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { fetchProducts, Product } from '@services/productApi';
import ProductCard from '@components/ProductCard';
import Typography from '@components/ui/Typography';
import ShopButton from '@components/ShopButton';
import Watermark from '@components/Watermark';
import useDebouncedValue from '@hooks/useDebouncedValue';
import { useCartStore } from '@stores/cartStore';
import { STUDENT, ROOM_LABEL, STALE_TIME_MS, VARIANT } from '@constants/student';
import { COLORS, SIZES } from '@constants/theme';
import { ShopStackParamList } from '@navigation/ShopStack';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const totalQuantity = useCartStore((state) => state.totalQuantity());

  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText);

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: STALE_TIME_MS,
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!debouncedSearch.trim()) return products;

    const query = debouncedSearch.toLowerCase().trim();
    return products.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [products, debouncedSearch]);

  const handleCardPress = (id: number) => {
    navigation.navigate('Detail', { id });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      {/* Header AppBar */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Typography variant="h1" color={COLORS.primary} style={styles.brandTitle}>
              KTXGo
            </Typography>
            <View style={styles.liveTag}>
              <Typography variant="small" color="#15803D" style={{ fontWeight: '800' }}>
                LIVE
              </Typography>
            </View>
          </View>
          <Typography variant="body2" color={COLORS.secondary} style={{ fontWeight: '700', marginTop: 2 }}>
            Giao tận {ROOM_LABEL} · KTX IUH
          </Typography>
        </View>

        <TouchableOpacity
          style={styles.cartIconBadge}
          onPress={() => (navigation as any).navigate('Cart')}
          activeOpacity={0.8}
          accessibilityLabel="Xem giỏ hàng"
          accessibilityRole="button"
        >
          <Typography variant="h2">🛒</Typography>
          {totalQuantity > 0 && (
            <View style={styles.badgeNumber}>
              <Typography variant="small" color={COLORS.white} style={{ fontWeight: 'bold', fontSize: 10 }}>
                {totalQuantity}
              </Typography>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Input Box with Debounce */}
      <View style={styles.searchContainer}>
        <Typography variant="body1" style={{ marginRight: 8 }}>🔍</Typography>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm món ăn, nước uống, đồ dùng..."
          placeholderTextColor={COLORS.textLight}
          value={searchText}
          onChangeText={setSearchText}
          clearButtonMode="while-editing"
        />
        {!!searchText && (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearBtn}>
            <Typography variant="body2" color={COLORS.textLight}>✕</Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* Body / Network States (Chương 6 & 4) */}
      <View style={styles.body}>
        {isLoading && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Typography variant="body1" color={COLORS.textLight} style={{ marginTop: 12, fontWeight: '600' }}>
              Đang tải danh sách món ({STUDENT.mssv})...
            </Typography>
          </View>
        )}

        {isError && (
          <View style={styles.errorBox}>
            <Typography variant="h1" style={{ marginBottom: 8 }}>⚠️</Typography>
            <Typography variant="h2" color={COLORS.error} style={{ fontWeight: '800' }}>
              Lỗi tải dữ liệu mạng!
            </Typography>
            <Typography variant="body2" color={COLORS.text} style={{ fontWeight: '700', marginTop: 4 }}>
              MSSV: {STUDENT.mssv} - {STUDENT.hoTen}
            </Typography>
            <Typography variant="small" color={COLORS.textLight} style={{ marginTop: 6, textAlign: 'center' }}>
              {(error as any)?.message || 'Không thể kết nối tới máy chủ API'}
            </Typography>
            <ShopButton
              title="🔄 Thử lại ngay"
              onPress={() => refetch()}
              style={{ marginTop: 16, height: 42, paddingHorizontal: 20 }}
            />
          </View>
        )}

        {!isLoading && !isError && products && (
          <FlashList
            data={filteredProducts}
            numColumns={2}
            estimatedItemSize={220}
            keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={() => handleCardPress(item.id)} />
            )}
            contentContainerStyle={styles.listContent}
            refreshing={isRefetching}
            onRefresh={refetch}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Typography variant="h1" style={{ marginBottom: 10 }}>🍽️</Typography>
                <Typography variant="body1" color={COLORS.textLight} style={{ textAlign: 'center', paddingHorizontal: 24 }}>
                  Không tìm thấy món nào khớp với "{debouncedSearch}"
                </Typography>
              </View>
            }
          />
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  liveTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 8,
  },
  cartIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  badgeNumber: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.padding,
    marginVertical: 10,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.body1,
    color: COLORS.text,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  body: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 4,
    paddingBottom: SIZES.padding,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    margin: SIZES.padding,
    backgroundColor: '#FEF2F2',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
});

export default HomeScreen;
