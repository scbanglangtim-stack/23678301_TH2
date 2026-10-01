import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { fetchProducts, Product } from '@services/productApi';
import ProductCard from '@components/ProductCard';
import Watermark from '@components/Watermark';
import useDebouncedValue from '@hooks/useDebouncedValue';
import { STUDENT, ROOM_LABEL, STALE_TIME_MS, DEBOUNCE_MS } from '@constants/student';
import { ShopStackParamList } from '@navigation/ShopStack';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebouncedValue(searchText, DEBOUNCE_MS);

  const {
    data: products,
    isPending,   // RQ v5: isPending = true khi chưa có data lần đầu
    isError,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: STALE_TIME_MS,
    retry: 2,
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

  const handleCardPress = useCallback((id: number) => {
    navigation.navigate('Detail', { id });
  }, [navigation]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // ─── CẢNH 1: ĐANG TẢI ───────────────────────────────────────────────────────
  if (isPending) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.blueBanner}>
          <View>
            <Text style={styles.bannerTitle}>KTXGO</Text>
            <Text style={styles.bannerSubtitle}>Giao tận {ROOM_LABEL}</Text>
          </View>
          <Text style={styles.badgeA}>(A)</Text>
        </View>

        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#1D4ED8" />
          <Text style={styles.loadingText}>Đang tải món...</Text>
        </View>

        {/* Watermark DƯỚI cho thí sinh số cuối 1 */}
        <Watermark />
      </SafeAreaView>
    );
  }

  // ─── CẢNH 2: LỖI MẠNG ───────────────────────────────────────────────────────
  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.blueBanner}>
          <View>
            <Text style={styles.bannerTitle}>KTXGO</Text>
            <Text style={styles.bannerSubtitle}>Giao tận {ROOM_LABEL}</Text>
          </View>
          <Text style={styles.badgeA}>(A)</Text>
        </View>

        {/* ScrollView với RefreshControl để pull-to-refetch ngay cả khi lỗi */}
        <ScrollView
          contentContainerStyle={styles.centerBox}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              colors={['#1D4ED8']}
              tintColor="#1D4ED8"
            />
          }
        >
          <Text style={styles.errorMssv}>{STUDENT.mssv}</Text>
          <Text style={styles.errorMessage}>Không tải được dữ liệu món.</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={handleRefresh}
            activeOpacity={0.85}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Watermark DƯỚI cho thí sinh số cuối 1 */}
        <Watermark />
      </SafeAreaView>
    );
  }

  // ─── CẢNH 3: CÓ DỮ LIỆU ─────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Blue Header Banner với nhãn (A) */}
      <View style={styles.blueBanner}>
        <View>
          <Text style={styles.bannerTitle}>KTXGO</Text>
          <Text style={styles.bannerSubtitle}>Giao tận {ROOM_LABEL}</Text>
        </View>
        <Text style={styles.badgeA}>(A)</Text>
      </View>

      {/* Ô tìm kiếm debounce DEBOUNCE_MS=400ms với nhãn (B) */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Text style={styles.badgeB}>(B)</Text>
        </View>
      </View>

      {/* Nhãn (C) FlashList × 2 */}
      <Text style={styles.labelFlashList}>(C) FlashList ×2</Text>

      {/* FlashList 2 cột, keyExtractor ghép MSSV, pull-to-refresh = refetch */}
      <View style={styles.body}>
        <FlashList
          data={filteredProducts}
          numColumns={2}
          estimatedItemSize={170}
          keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              index={index}
              onPress={() => handleCardPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={isRefetching}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Không tìm thấy món nào khớp với "{debouncedSearch}"
              </Text>
            </View>
          }
        />
      </View>

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
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#EFF6FF',
    marginTop: 2,
  },
  badgeA: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EA580C',
  },
  searchWrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 2,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    paddingHorizontal: 14,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E3A8A',
    paddingVertical: 0,
  },
  badgeB: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
    marginLeft: 6,
  },
  labelFlashList: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
    textAlign: 'right',
    paddingHorizontal: 14,
    marginTop: 4,
    marginBottom: 2,
  },
  body: {
    flex: 1,
    paddingHorizontal: 6,
  },
  listContent: {
    paddingBottom: 8,
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
    fontSize: 22,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 18,
  },
  retryBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 40,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default HomeScreen;
