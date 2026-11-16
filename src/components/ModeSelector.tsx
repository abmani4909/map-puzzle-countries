import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Leaf, Timer } from 'lucide-react-native';
import theme from '../constants/theme';
import type { IconComponent } from './icon';
import type { PlayMode } from '../game/types';

type Props = {
  value: PlayMode;
  onChange: (mode: PlayMode) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function Segment({
  mode,
  label,
  active,
  onChange,
  Icon,
}: {
  mode: PlayMode;
  label: string;
  active: boolean;
  onChange: (mode: PlayMode) => void;
  Icon: IconComponent;
}) {
  const handlePress = useCallback(() => onChange(mode), [onChange, mode]);
  const color = active ? theme.colors.brand.berry : theme.colors.text.muted;
  return (
    <Pressable
      style={[styles.segment, active ? styles.segmentActive : null]}
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label + ' mode'}>
      <View style={styles.row}>
        <View style={[styles.dot, active ? styles.dotActive : null]} />
        <Icon size={18} color={color} strokeWidth={2.4} />
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

/** Relaxed / Timed. Selection is shown by outline, fill AND a filled dot. */
export function ModeSelector({ value, onChange }: Props) {
  return (
    <View style={styles.root} accessibilityRole="radiogroup">
      <Segment
        mode="relaxed"
        label="Relaxed"
        Icon={Leaf}
        active={value === 'relaxed'}
        onChange={onChange}
      />
      <Segment
        mode="timed"
        label="Timed"
        Icon={Timer}
        active={value === 'timed'}
        onChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    height: 48,
  },
  segment: {
    flex: 1,
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    borderWidth: 2,
    borderColor: theme.colors.brand.berry,
    backgroundColor: theme.colors.bg.accent,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'transparent',
  },
  dotActive: {
    borderColor: theme.colors.brand.berry,
    backgroundColor: theme.colors.brand.berry,
  },
  label: {
    fontSize: theme.typography.cardLabel.fontSize,
    lineHeight: 18,
    fontWeight: theme.typography.cardLabel.fontWeight,
  },
});

export default ModeSelector;
