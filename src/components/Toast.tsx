import React from 'react';
import { StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';

import { TToast } from '@reducers/ui';
import { theme } from '@constants';
import Block from '@components/Block';
import Text from '@components/Text';

const { width, height } = Dimensions.get('window');

const heightBase = new Animated.Value(height * 0.05);
const opacityBase = new Animated.Value(1);

const Toast: React.FC<{
  toast: TToast;
  shouldClose?: boolean;
  showClose?: boolean;
  onDoneClosing(): void;
  children?: React.ReactNode;
}> = ({ toast, shouldClose = false, showClose = false, onDoneClosing, children }) => {
  const progress = React.useRef<Animated.Value>(new Animated.Value(1)).current;

  const handleClose = React.useCallback(() => {
    Animated.timing(progress, {
      toValue: 1,
      easing: Easing.out(Easing.poly(4)),
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      onDoneClosing();
    });
  }, [onDoneClosing, progress]);

  const onPressBackground = React.useCallback(() => {
    if (toast.allowClose) {
      handleClose();
    }
  }, [handleClose, toast.allowClose]);

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      easing: Easing.out(Easing.poly(4)),
      duration: 400,
      useNativeDriver: true
    }).start();
  }, [progress]);

  React.useEffect(() => {
    if (shouldClose) {
      handleClose();
    }
  }, [handleClose, shouldClose]);

  React.useEffect(() => {
    if (toast.timer > 0) {
      const t = setTimeout(handleClose, toast.timer);
      return () => clearTimeout(t);
    }
  }, [handleClose, toast.timer]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        width,
        height,
        opacity: Animated.subtract(opacityBase, progress),
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          transform: [
            {
              translateY: Animated.multiply(heightBase, progress)
            }
          ],
          width,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity style={styles.background} activeOpacity={1} onPress={onPressBackground} />

        <Block style={styles.wrapper}>
          <Block style={styles.container}>
            <Text
              style={[
                styles.title,
                {
                  color: toast.titleColor
                }
              ]}
            >
              {toast.title}
            </Text>
            <Text style={styles.message}>{toast.message}</Text>
            {children !== null && <Block style={styles.contentWrapper}>{children}</Block>}
          </Block>
        </Block>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    width,
    height
  },
  wrapper: {
    width: width - 40,
    borderRadius: 8,
    backgroundColor: theme.COLORS.WHITE
  },
  container: {
    marginTop: 20,
    marginHorizontal: 20
  },
  title: {
    overflow: 'visible',
    marginBottom: 5,
    fontFamily: 'OpenSans-Bold',
    fontSize: 18
  },
  message: {
    fontFamily: 'OpenSans',
    fontSize: 13
  },
  contentWrapper: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  }
});

export default Toast;
