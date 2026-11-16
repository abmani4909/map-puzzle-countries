import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import type { Region } from '../game/mapgen';
import theme from '../constants/theme';
import CountryShape from './CountryShape';

type Props = {
  region: Region | null;
  width: number;
  height: number;
  pos: Animated.ValueXY;
  visible: boolean;
};

/**
 * Finger-following copy of the piece, drawn at the board's own scale.
 * Non-interactive by construction - it must never swallow a press.
 */
export function DragOverlay({ region, width, height, pos, visible }: Props) {
  if (!region || !visible || width <= 0 || height <= 0) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.layer,
        {
          width,
          height,
          transform: [{ translateX: pos.x }, { translateY: pos.y }],
        },
      ]}>
      <CountryShape
        region={region}
        width={width}
        height={height}
        stretch
        fill={theme.colors.bg.accent}
        stroke={theme.colors.brand.berry}
        strokeWidth={1.4}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    left: 0,
    top: 0,
    shadowColor: '#24181E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default DragOverlay;
