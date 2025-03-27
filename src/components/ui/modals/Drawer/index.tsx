import React, { useEffect, useRef } from 'react';
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
} from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '@/theme/ThemeContext';

export type DrawerPosition = 'left' | 'right';

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  position?: DrawerPosition;
  width?: number | string;
  dragEnabled?: boolean;
  closeOnBackdropPress?: boolean;
  backdropOpacity?: number;
  drawerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const Drawer: React.FC<DrawerProps> = ({
  visible,
  onClose,
  position = 'left',
  width = '80%',
  dragEnabled = true,
  closeOnBackdropPress = true,
  backdropOpacity = 0.5,
  drawerStyle,
  contentStyle,
  children,
}) => {
  const { currentTheme, isDark } = useTheme();
  const drawerAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const panX = useRef(new Animated.Value(0)).current;

  const drawerWidth = typeof width === 'string'
    ? (parseInt(width.replace('%', ''), 10) / 100) * SCREEN_WIDTH
    : width;

  const slideIn = () => {
    Animated.parallel([
      Animated.timing(drawerAnim, {
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
  };

  const slideOut = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const handleClose = () => {
    slideOut(onClose);
  };

  const getTranslateX = () => {
    const multiplier = position === 'left' ? -1 : 1;
    return Animated.add(
      panX,
      drawerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [multiplier * drawerWidth, 0],
      })
    );
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: panX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      const threshold = drawerWidth * 0.3;
      
      if ((position === 'left' && translationX < -threshold) ||
          (position === 'right' && translationX > threshold)) {
        handleClose();
      } else {
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handleBackPress = () => {
    if (visible) {
      handleClose();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (visible) {
      slideIn();
    }
  }, [visible]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [visible]);

  const translateX = getTranslateX();

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent
      animationType="none"
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={styles.gestureRoot}>
        <TouchableWithoutFeedback onPress={closeOnBackdropPress ? handleClose : undefined}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                backgroundColor: '#000',
                opacity: backdropAnim,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <PanGestureHandler
          enabled={dragEnabled}
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.drawer,
              {
                width: drawerWidth,
                [position]: 0,
                backgroundColor: currentTheme.colors.background,
                transform: [{ translateX }],
              },
              drawerStyle,
            ]}
          >
            <View style={[styles.content, contentStyle]}>
              {children}
            </View>
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
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default Drawer; 