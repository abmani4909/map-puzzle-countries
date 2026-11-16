import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import type { IconComponent } from './icon';
import usePressScale from '../hooks/usePressScale';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  disabled?: boolean;
  tone?: 'lime' | 'berry';
  accessibilityLabel?: string;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

/** 56 dp gradient CTA. Pressable owns the touch; the Animated.View is inside. */
export function PrimaryButton({
  label,
  onPress,
  Icon,
  disabled = false,
  tone = 'lime',
  accessibilityLabel,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const lime = tone === 'lime';
  const textColor = lime ? theme.colors.text.primary : theme.colors.text.onDark;

  return (
    <Pressable
      style={styles.press}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel || label}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.shadow,
          { transform: [{ scale }] },
          disabled ? styles.disabled : null,
        ]}>
        <LinearGradient
          colors={lime ? theme.gradients.primary : theme.gradients.berry}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color={textColor} strokeWidth={2.5} /> : null}
            <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 56 },
  shadow: {
    width: '100%',
    height: 56,
    borderRadius: theme.radius.lg,
    ...theme.shadows.cta,
  },
  disabled: { opacity: 0.5 },
  fill: {
    width: '100%',
    height: 56,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: theme.typography.button.fontSize,
    lineHeight: ICON,
    fontWeight: theme.typography.button.fontWeight,
    letterSpacing: theme.typography.button.letterSpacing,
  },
});

export default PrimaryButton;
