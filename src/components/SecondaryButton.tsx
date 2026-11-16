import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import type { IconComponent } from './icon';
import usePressScale from '../hooks/usePressScale';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconComponent;
  selected?: boolean;
  disabled?: boolean;
  flex?: boolean;
  accessibilityLabel?: string;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

/** 48 dp bordered action. Same icon size and gap as PrimaryButton. */
export function SecondaryButton({
  label,
  onPress,
  Icon,
  selected = false,
  disabled = false,
  flex = false,
  accessibilityLabel,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const color = selected ? theme.colors.text.onDark : theme.colors.text.secondary;

  return (
    <Pressable
      style={[styles.press, flex ? styles.flex : null]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={accessibilityLabel || label}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.inner,
          selected ? styles.selected : null,
          disabled ? styles.disabled : null,
          { transform: [{ scale }] },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={color} strokeWidth={2.2} /> : null}
          <Text style={[styles.label, { color }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { height: 48, minWidth: 48 },
  flex: { flex: 1 },
  inner: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.glass,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.card,
  },
  selected: {
    backgroundColor: theme.colors.brand.berry,
    borderColor: theme.colors.brand.berry,
  },
  disabled: { opacity: 0.45 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: theme.typography.buttonSmall.fontSize,
    lineHeight: ICON,
    fontWeight: theme.typography.buttonSmall.fontWeight,
    letterSpacing: theme.typography.buttonSmall.letterSpacing,
  },
});

export default SecondaryButton;
