import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  StyleProp,
  ViewStyle,
  BackHandler,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import Text from '../../atoms/Text';
import Button from '../../atoms/Button';

interface DialogAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  onPress: () => void;
}

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actions?: DialogAction[];
  cancelable?: boolean;
  centered?: boolean;
  width?: number | string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  actionContainerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const Dialog: React.FC<DialogProps> = ({
  visible,
  onClose,
  title,
  message,
  actions = [],
  cancelable = true,
  centered = true,
  width = '80%',
  style,
  contentStyle,
  actionContainerStyle,
  children,
}) => {
  const { currentTheme, isDark } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const dialogWidth = typeof width === 'string' 
    ? (parseInt(width.replace('%', ''), 10) / 100) * SCREEN_WIDTH
    : width;

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.5,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  const handleClose = () => {
    if (cancelable) {
      animateOut(onClose);
    }
  };

  const handleBackPress = () => {
    if (visible && cancelable) {
      handleClose();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (visible) {
      animateIn();
    }
  }, [visible]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [visible, cancelable]);

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={cancelable ? handleClose : undefined}>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: '#000',
                opacity: opacityAnim,
              },
            ]}
          />

          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.dialogContainer,
                centered && styles.centered,
                {
                  backgroundColor: currentTheme.colors.background,
                  width: dialogWidth,
                  transform: [{ scale: scaleAnim }],
                },
                style,
              ]}
            >
              {title && (
                <View style={styles.titleContainer}>
                  <Text variant="h3" align="center">
                    {title}
                  </Text>
                </View>
              )}

              <View style={[styles.contentContainer, contentStyle]}>
                {message && (
                  <Text align="center" style={styles.message}>
                    {message}
                  </Text>
                )}
                {children}
              </View>

              {actions.length > 0 && (
                <View
                  style={[
                    styles.actionsContainer,
                    actions.length > 2 && styles.actionsStacked,
                    actionContainerStyle,
                  ]}
                >
                  {actions.map((action, index) => (
                    <Button
                      key={`action-${index}`}
                      variant={action.variant || 'primary'}
                      label={action.label}
                      style={[
                        actions.length <= 2 
                          ? styles.actionButton 
                          : styles.actionButtonStacked,
                        index === actions.length - 1 && styles.lastActionButton,
                      ]}
                      onPress={() => {
                        action.onPress();
                        if (action.variant !== 'ghost') {
                          animateOut();
                        }
                      }}
                    />
                  ))}
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    alignSelf: 'center',
  },
  dialogContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: actions => (actions && actions.length > 0 ? 8 : 24),
  },
  message: {
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'flex-end',
  },
  actionsStacked: {
    flexDirection: 'column',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonStacked: {
    marginVertical: 4,
  },
  lastActionButton: {
    marginRight: 0,
  },
});

export default Dialog; 