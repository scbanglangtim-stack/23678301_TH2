export const COLORS = {
  primary: '#1D4ED8',       // Xanh dương chủ đạo KTXGo
  primaryLight: '#3B82F6',
  primaryDark: '#1E40AF',
  secondary: '#F97316',     // Màu cam cho badge giỏ & phí ship (#F97316)
  background: '#EFF6FF',    // Nền pastel xanh sáng
  surface: '#FFFFFF',       // Nền card trắng
  text: '#1E3A8A',          // Text xanh đen đậm
  textLight: '#64748B',     // Text phụ xám xanh
  border: '#BFDBFE',        // Viền xanh nhạt
  watermarkBg: '#D8E8FC',   // Nền thanh watermark
  watermarkBorder: '#BFDBFE',
  error: '#DC2626',         // Màu đỏ lỗi
  success: '#16A34A',       // Màu xanh lá thành công
  cardShadow: '#1E293B',
  disabled: '#94A3B8',
  white: '#FFFFFF',
} as const;

export const SIZES = {
  base: 8,
  font: 14,
  radius: 16,
  radiusSm: 8,
  radiusLg: 20,
  padding: 16,
  paddingSm: 10,
  paddingLg: 20,
  margin: 16,
  h1: 24,
  h2: 20,
  h3: 16,
  body1: 14,
  body2: 13,
  small: 11,
} as const;

export const FONTS = {
  h1: { fontSize: SIZES.h1, fontWeight: '800' as const, color: COLORS.text },
  h2: { fontSize: SIZES.h2, fontWeight: '700' as const, color: COLORS.text },
  h3: { fontSize: SIZES.h3, fontWeight: '600' as const, color: COLORS.text },
  body1: { fontSize: SIZES.body1, fontWeight: '500' as const, color: COLORS.text },
  body2: { fontSize: SIZES.body2, fontWeight: '400' as const, color: COLORS.textLight },
  small: { fontSize: SIZES.small, fontWeight: '400' as const, color: COLORS.textLight },
};
