import React, { memo } from 'react';
import { Text, TextStyle, StyleProp, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@constants/theme';

export type TypographyVariant = keyof typeof FONTS;

interface Props {
  children: React.ReactNode;
  variant?: TypographyVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography = ({
  children,
  variant = 'body1',
  color,
  style,
  numberOfLines,
  textAlign,
}: Props) => {
  const fontConfig = FONTS[variant];

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        fontConfig,
        color ? { color } : null,
        textAlign ? { textAlign } : null,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default memo(Typography);
