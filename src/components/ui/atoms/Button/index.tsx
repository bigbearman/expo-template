import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import Text from '../Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  label,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth,
  rounded,
  style,
  textStyle,
  children,
  ...rest
}: ButtonProps) => {
  const { currentTheme, isDark } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      ...styles[size],
      ...(fullWidth && styles.fullWidth),
      ...(rounded && styles.rounded),
    };

    // Apply variant styles
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: currentTheme.colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: currentTheme.colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: currentTheme.colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: currentTheme.colors.error,
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: currentTheme.colors.success,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return currentTheme.colors.primary;
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost'
            ? currentTheme.colors.primary
            : '#FFFFFF'
          }
        />
      ) : (
        <>
          {leftIcon}
          {label && (
            <Text
              variant="button"
              color={getTextColor()}
              style={[styles.text, textStyle]}
            >
              {label}
            </Text>
          )}
          {children}
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  fullWidth: {
    width: '100%',
  },
  rounded: {
    borderRadius: 9999,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
  },
});

export default Button; 