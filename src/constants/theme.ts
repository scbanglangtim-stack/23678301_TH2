export const COLORS = {
  primary: '#1D4ED8',      // Nút, tab chọn, giá
  secondary: '#F97316',    // Badge giỏ, phí ship
  background: '#EFF6FF',   // Nền sáng KTXGo
  surface: '#FFFFFF',      // Card, container
  text: '#1E3A8A',         // Text chính
  textLight: '#64748B',    // Text phụ
  border: '#BFDBFE',       // Viền
  error: '#DC2626',        // Lỗi
  success: '#16A34A',      // Thành công
  cardShadow: '#1E293B',
  disabled: '#94A3B8',
  white: '#FFFFFF',
} as const;

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  radiusSm: 8,
  radiusLg: 16,
  padding: 16,
  paddingSm: 10,
  paddingLg: 20,
  margin: 16,
  h1: 24,
  h2: 20,
  h3: 16,
  body1: 14,
  body2: 12,
  small: 11,
} as const;

/** Map variant chữ → fontSize / fontWeight (dùng cho Atom Typography) */
export const FONTS = {
  h1: { fontSize: SIZES.h1, fontWeight: '800' as const, color: COLORS.text },
  h2: { fontSize: SIZES.h2, fontWeight: '700' as const, color: COLORS.text },
  h3: { fontSize: SIZES.h3, fontWeight: '600' as const, color: COLORS.text },
  body1: { fontSize: SIZES.body1, fontWeight: '400' as const, color: COLORS.text },
  body2: { fontSize: SIZES.body2, fontWeight: '400' as const, color: COLORS.textLight },
  small: { fontSize: SIZES.small, fontWeight: '400' as const, color: COLORS.textLight },
};
