import React from 'react';
import { View as RNView, ViewProps as RNViewProps, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export interface ViewProps extends RNViewProps {
  flex?: number;
  row?: boolean;
  center?: boolean;
  middle?: boolean;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
  radius?: number;
  shadow?: boolean;
  elevation?: number;
  wrap?: boolean;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  safeArea?: boolean;
}

export const View = ({
  flex,
  row,
  center,
  middle,
  backgroundColor,
  padding,
  margin,
  radius,
  shadow,
  elevation = 0,
  wrap,
  justifyContent,
  alignItems,
  style,
  children,
  ...rest
}: ViewProps) => {
  const { currentTheme } = useTheme();

  const getViewStyle = (): ViewStyle => {
    return {
      flex: flex === undefined ? undefined : flex,
      flexDirection: row ? 'row' : 'column',
      flexWrap: wrap ? 'wrap' : 'nowrap',
      justifyContent: justifyContent || (middle ? 'center' : undefined),
      alignItems: alignItems || (center ? 'center' : undefined),
      backgroundColor: backgroundColor || currentTheme.colors.background,
      padding: padding,
      margin: margin,
      borderRadius: radius,
      ...(shadow ? styles.shadow : {}),
      elevation: shadow ? elevation || 3 : 0,
    };
  };

  return (
    <RNView style={[getViewStyle(), style]} {...rest}>
      {children}
    </RNView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
});

export default View; 