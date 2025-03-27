import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StyleProp,
  ViewStyle,
  BackHandler,
  StatusBar,
  Platform,
} from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '@/theme/ThemeContext';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  height?: number | string;
  snapPoints?: (number | string)[];
  initialSnapIndex?: number;
  rounded?: boolean;
  avoidKeyboard?: boolean;
  closeOnBackdropPress?: boolean;
  backdropOpacity?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  handleIndicator?: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  height = '50%',
  snapPoints,
  initialSnapIndex = 0,
  rounded = true,
  avoidKeyboard = true,
  closeOnBackdropPress = true,
  backdropOpacity = 0.5,
  style,
  children,
  handleIndicator = true,
}) => {
  const { currentTheme, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  // Convert height/snapPoints to actual pixel values
  const getPixelHeight = (value: number | string): number => {
    if (typeof value === 'number') return value;
    const percentage = parseInt(value.replace('%', ''), 10);
    return (SCREEN_HEIGHT * percentage) / 100;
  };

  const actualHeight = getPixelHeight(height);
  const actualSnapPoints = snapPoints?.map(getPixelHeight) || [actualHeight];
  const currentSnapPoint = useRef(
    actualSnapPoints[initialSnapIndex < actualSnapPoints.length
      ? initialSnapIndex
      : 0
    ]
  );

  // Handle animations
  const slideIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: backdropOpacity,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, backdropAnim, backdropOpacity]);

  const slideOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [slideAnim, backdropAnim, onClose]);

  // Handle gestures
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: panY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY } = event.nativeEvent;
      
      // Snap to closest point or dismiss
      if (translationY > actualHeight * 0.2) {
        slideOut();
      } else {
        let closestSnapPoint = actualSnapPoints[0];
        let minDistance = Math.abs(translationY - actualSnapPoints[0]);
        
        actualSnapPoints.forEach((point) => {
          const distance = Math.abs(translationY - point);
          if (distance < minDistance) {
            minDistance = distance;
            closestSnapPoint = point;
          }
        });
        
        currentSnapPoint.current = closestSnapPoint;
        Animated.spring(panY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  // Handle back button on Android
  useEffect(() => {
    const handleBackPress = () => {
      if (visible) {
        slideOut();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [visible, slideOut]);

  // Slide in when visible changes
  useEffect(() => {
    if (visible) {
      slideIn();
    }
  }, [visible, slideIn]);

  const translateY = Animated.add(
    panY,
    slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [actualHeight, 0],
    })
  );

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={slideOut}
    >
      <GestureHandlerRootView style={styles.gestureRoot}>
        <TouchableWithoutFeedback
          onPress={closeOnBackdropPress ? slideOut : undefined}
        >
          <Animated.View
            style={[
              styles.backdrop,
              {
                backgroundColor: isDark ? '#000' : '#000',
                opacity: backdropAnim,
              },
            ]}
          />
        </TouchableWithoutFeedback>
        
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.container,
              {
                backgroundColor: currentTheme.colors.background,
                height: actualHeight,
                borderTopLeftRadius: rounded ? 16 : 0,
                borderTopRightRadius: rounded ? 16 : 0,
                transform: [{ translateY }],
              },
              style,
            ]}
          >
            {handleIndicator && (
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handle,
                    { backgroundColor: currentTheme.colors.border },
                  ]}
                />
              </View>
            )}
            <View style={styles.content}>{children}</View>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default BottomSheet; 