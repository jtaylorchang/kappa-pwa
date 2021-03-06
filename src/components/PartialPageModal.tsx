import React from 'react';
import { StyleSheet, Animated, Easing, View, TouchableOpacity } from 'react-native';

const PartialPageModal: React.FC<{
  visible: boolean;
  height?: number | string;
  onDoneClosing?(): void;
}> = ({ visible, height = '75%', onDoneClosing = () => {}, children }) => {
  const progress = React.useRef<Animated.Value>(new Animated.Value(1)).current;
  const [doneClosing, setDoneClosing] = React.useState<boolean>(true);

  const backgroundOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  const topOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  const handleClose = React.useCallback(() => {
    Animated.timing(progress, {
      toValue: 1,
      easing: Easing.out(Easing.poly(4)),
      duration: 300,
      useNativeDriver: false
    }).start(() => {
      onDoneClosing();

      setDoneClosing(true);
    });
  }, [onDoneClosing, progress]);

  React.useEffect(() => {
    if (!visible) {
      handleClose();
    }
  }, [handleClose, visible]);

  React.useEffect(() => {
    if (visible) {
      setDoneClosing(false);

      Animated.timing(progress, {
        toValue: 0,
        easing: Easing.out(Easing.poly(4)),
        duration: 300,
        useNativeDriver: false
      }).start();
    }
  }, [progress, visible]);

  if (doneClosing) {
    return <React.Fragment />;
  }

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.background,
        {
          opacity: backgroundOpacity
        }
      ]}
    >
      <Animated.View
        style={[
          styles.foreground,
          {
            top: topOffset
          }
        ]}
      >
        <TouchableOpacity style={styles.touchableBackground} activeOpacity={1} onPress={handleClose} />

        <View style={[styles.container, { height }]}>{children}</View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `rgba(0, 0, 0, 0.5)`
  },
  foreground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  touchableBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
});

export default PartialPageModal;
