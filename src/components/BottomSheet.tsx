import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BOTTOM_INSET } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  visible: boolean;
  onScrimPress?: () => void;
  reducedMotion?: boolean;
  children: React.ReactNode;
  minHeight?: number;
};

/**
 * Modal-style bottom sheet drawn inside the owning screen.
 * The animated wrapper is pointerEvents="box-none" so the buttons inside it
 * keep receiving presses on Android release builds.
 */
export function BottomSheet({
  visible,
  onScrimPress,
  reducedMotion = false,
  children,
  minHeight = 264,
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: reducedMotion
        ? theme.animation.reduced
        : visible
        ? theme.animation.sheet
        : 160,
      useNativeDriver: true,
    }).start();
  }, [visible, progress, reducedMotion]);

  if (!visible) return null;

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable
        style={styles.scrim}
        onPress={onScrimPress}
        accessibilityRole="button"
        accessibilityLabel="Close"
      />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.wrap, { opacity: progress, transform: [{ translateY }] }]}>
        <LinearGradient
          colors={theme.gradients.sheet}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.sheet, { minHeight }]}>
          {children}
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.ui.overlay,
  },
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.brand.berry,
    padding: 20,
    paddingBottom: 20 + BOTTOM_INSET,
    ...theme.shadows.dock,
  },
});

export default BottomSheet;
