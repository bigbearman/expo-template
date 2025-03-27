import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import Text from '../Text';

export type InputVariant = 'outline' | 'filled' | 'underline';
export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps extends TextInputProps {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  required?: boolean;
  fullWidth?: boolean;
  onTogglePassword?: () => void;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(({
  variant = 'outline',
  size = 'medium',
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  startAdornment,
  endAdornment,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  required,
  fullWidth,
  onTogglePassword,
  isPassword,
  secureTextEntry,
  onFocus,
  onBlur,
  ...rest
}, ref) => {
  const { currentTheme, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    onTogglePassword && onTogglePassword();
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.container,
      ...(fullWidth && styles.fullWidth),
    };
    
    return baseStyle;
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.inputContainer,
      ...styles[size],
    };

    // Apply variant styles
    switch (variant) {
      case 'outline':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: error 
            ? currentTheme.colors.error 
            : isFocused 
              ? currentTheme.colors.primary 
              : currentTheme.colors.border,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: error 
            ? `${currentTheme.colors.error}20` 
            : isFocused 
              ? `${currentTheme.colors.primary}10` 
              : isDark ? '#333' : '#f5f5f5',
        };
      case 'underline':
        return {
          ...baseStyle,
          borderBottomWidth: 1,
          borderRadius: 0,
          paddingHorizontal: 0,
          borderColor: error 
            ? currentTheme.colors.error 
            : isFocused 
              ? currentTheme.colors.primary 
              : currentTheme.colors.border,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}{required && <Text variant="error"> *</Text>}
        </Text>
      )}
      
      <View style={[getInputContainerStyle(), inputContainerStyle]}>
        {startAdornment}
        {leftIcon}
        
        <TextInput
          ref={ref}
          placeholderTextColor={currentTheme.colors.textSecondary}
          style={[
            styles.input,
            {
              color: currentTheme.colors.text,
            },
            inputStyle,
          ]}
          secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle}>
            <Text>
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
        
        {rightIcon}
        {endAdornment}
      </View>
      
      {(error || helper) && (
        <Text
          variant={error ? 'error' : 'caption'}
          style={styles.helperText}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  small: {
    minHeight: 36,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  medium: {
    minHeight: 48,
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  large: {
    minHeight: 56,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  helperText: {
    marginTop: 4,
  },
  passwordToggle: {
    paddingHorizontal: 8,
  },
});

Input.displayName = 'Input';
export default Input; 