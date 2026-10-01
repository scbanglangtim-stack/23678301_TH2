import React, { memo } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import Typography from '@components/ui/Typography';
import { COLORS, SIZES } from '@constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ShopButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

export const ShopButton: React.FC<ShopButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const variantStyle = styles[variant];
  let textColor: string = COLORS.white;

  if (variant === 'outline') {
    textColor = COLORS.primary;
  } else if (variant === 'secondary') {
    textColor = COLORS.white;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyle,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Typography
          variant="body1"
          color={textColor}
          style={[{ fontWeight: '700' }, textStyle]}
        >
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: SIZES.radiusSm,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    shadowOpacity: 0,
    elevation: 1,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  danger: {
    backgroundColor: COLORS.error,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
    shadowOpacity: 0,
    elevation: 0,
    borderColor: COLORS.disabled,
  },
});

export default memo(ShopButton);
