import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { GestureResponderHandlers } from 'react-native';
import theme from '../constants/theme';
import { TRAY_H } from '../constants/config';
import type { Piece, PlacementStyle } from '../game/types';
import CountryShape from './CountryShape';

type Props = {
  piece: Piece | null;
  placement: PlacementStyle;
  selected: boolean;
  hidden: boolean;
  panHandlers: GestureResponderHandlers;
  onPress: () => void;
};

const PREVIEW_W = 96;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * The single unsolved country waiting to be placed. The whole container is the
 * touch surface; the country name is never revealed here.
 *
 * Drag mode arms the pan responder (6 dp threshold); Tap mode turns the same
 * container into a 96 x 88 Pressable.
 */
export function PieceTray({
  piece,
  placement,
  selected,
  hidden,
  panHandlers,
  onPress,
}: Props) {
  const previewH = TRAY_H - 12;
  const shape = piece ? (
    <CountryShape
      region={piece.region}
      width={PREVIEW_W}
      height={previewH}
      fill={theme.colors.bg.accent}
      stroke={theme.colors.brand.berry}
      strokeWidth={1.6}
      opacity={hidden ? 0.25 : 1}
    />
  ) : (
    <Text style={styles.done}>All placed</Text>
  );

  const slotStyle = [
    styles.slot,
    { height: TRAY_H, width: PREVIEW_W + 24 },
    selected ? styles.slotSelected : null,
  ];

  return (
    <View style={[styles.root, { height: TRAY_H }]}>
      {placement === 'tap' ? (
        <Pressable
          style={slotStyle}
          onPress={onPress}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityState={{ selected }}
          accessibilityLabel="Country piece. Tap to select it, then tap its place on the map.">
          {shape}
        </Pressable>
      ) : (
        <View
          {...panHandlers}
          style={slotStyle}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Country piece. Drag it onto its place on the map.">
          {shape}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderSoft,
    backgroundColor: theme.colors.bg.secondary,
  },
  slotSelected: {
    borderWidth: 2,
    borderColor: theme.colors.brand.berry,
    backgroundColor: theme.colors.bg.accent,
  },
  done: {
    fontSize: theme.typography.instruction.fontSize,
    lineHeight: theme.typography.instruction.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
});

export default PieceTray;
