import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
  tone?: 'light' | 'berry' | 'dark';
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** 48 x 48 navigation control. Explicit width + height, never intrinsic. */
export function IconButton({ onPress, accessibilityLabel, children, tone = 'light' }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  return (
    <Pressable
      style={styles.press}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.inner,
          tone === 'berry' ? styles.berry : null,
          tone === 'dark' ? styles.dark : null,
          { transform: [{ scale }] },
        ]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: 48, height: 48 },
  inner: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  berry: {
    backgroundColor: theme.colors.bg.accent,
    borderColor: theme.colors.brand.berry,
  },
  dark: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.28)',
  },
});

export default IconButton;
