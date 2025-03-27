import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'body' 
  | 'body-bold'
  | 'body-semibold'
  | 'label' 
  | 'caption' 
  | 'button'
  | 'error'
  | 'success';

type TextAlign = 'auto' | 'left' | 'right' | 'center' | 'justify';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  align?: TextAlign;
  color?: string;
  italic?: boolean;
  underline?: boolean;
  numberOfLines?: number;
  children: React.ReactNode;
}

export const Text = ({
  variant = 'body',
  align = 'left',
  color,
  italic = false,
  underline = false,
  style,
  numberOfLines,
  children,
  ...rest
}: TextProps) => {
  const { currentTheme, isDark } = useTheme();
  
	const getTextStyle = (): TextStyle => {
    const variantStyle = styles[variant] || {};
    
    return {
      ...variantStyle,
      color: color || currentTheme.colors.text,
      textAlign: align,
      fontStyle: italic ? 'italic' : 'normal',
      textDecorationLine: underline ? 'underline' : 'none',
    };
  };

  return (
    <RNText
      style={[getTextStyle(), style]}
      numberOfLines={numberOfLines}
      {...rest}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  'body-bold': {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  'body-semibold': {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  error: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: '#FF3B30',
  },
  success: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: '#34C759',
  },
});

export default Text; 