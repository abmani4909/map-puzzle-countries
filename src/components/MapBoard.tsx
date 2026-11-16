import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { BOARD_BORDER, BOARD_PAD, MAP_UNITS } from '../constants/config';
import theme from '../constants/theme';
import { toPath } from '../game/mapgen';
import type { BoardFrame } from '../game/placement';
import type { Piece } from '../game/types';

type Props = {
  pieces: Piece[];
  landmass: string;
  placedSet: Record<string, true>;
  /** Region index outlined by an active hint, -1 when none. */
  hintIndex: number;
  /** Region index flashing lime right after a correct placement, -1 when none. */
  settledIndex: number;
  boardWidth: number;
  boardHeight: number;
  onFrame: (frame: BoardFrame) => void;
  onBoardPress: (unitX: number, unitY: number) => void;
};

const TINTS = [
  theme.colors.bg.accent,
  theme.colors.brand.paper,
  theme.colors.bg.tertiary,
  theme.colors.bg.primary,
];

/** The paper board: landmass backdrop, blank outlines, placed countries. */
export function MapBoard({
  pieces,
  landmass,
  placedSet,
  hintIndex,
  settledIndex,
  boardWidth,
  boardHeight,
  onFrame,
  onBoardPress,
}: Props) {
  const contentRef = useRef<View>(null);
  const contentW = boardWidth - 2 * (BOARD_PAD + BOARD_BORDER);
  const contentH = boardHeight - 2 * (BOARD_PAD + BOARD_BORDER);

  const paths = useMemo(
    () => pieces.map(p => ({ code: p.country.code, region: p.region, d: toPath(p.region.points) })),
    [pieces],
  );

  const measure = useCallback(() => {
    const node = contentRef.current;
    if (!node) return;
    node.measureInWindow((x, y, w, h) => {
      if (!w || !h) return;
      onFrame({
        pageX: x,
        pageY: y,
        width: w,
        height: h,
        scaleX: w / MAP_UNITS,
        scaleY: h / MAP_UNITS,
      });
    });
  }, [onFrame]);

  const handleLayout = useCallback(() => {
    requestAnimationFrame(measure);
  }, [measure]);

  const handlePress = useCallback(
    (event: { nativeEvent: { locationX: number; locationY: number } }) => {
      const { locationX, locationY } = event.nativeEvent;
      onBoardPress((locationX / contentW) * MAP_UNITS, (locationY / contentH) * MAP_UNITS);
    },
    [contentW, contentH, onBoardPress],
  );

  return (
    <LinearGradient
      colors={theme.gradients.board}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={[styles.board, { width: boardWidth, height: boardHeight }]}>
      <View
        ref={contentRef}
        onLayout={handleLayout}
        collapsable={false}
        style={{ width: contentW, height: contentH }}>
        <Svg
          width={contentW}
          height={contentH}
          viewBox={'0 0 ' + MAP_UNITS + ' ' + MAP_UNITS}
          preserveAspectRatio="none">
          <Path
            d={landmass}
            fill={theme.colors.bg.primary}
            fillOpacity={0.7}
            stroke={theme.colors.ui.border}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
          {paths.map(item => {
            const placed = placedSet[item.code] === true;
            return (
              <Path
                key={item.code}
                d={item.d}
                fill={placed ? TINTS[item.region.tint] : theme.colors.bg.tertiary}
                fillOpacity={placed ? 1 : 0.55}
                stroke={placed ? theme.colors.brand.berry : theme.colors.ui.border}
                strokeWidth={placed ? 1 : 1.25}
                strokeLinejoin="round"
              />
            );
          })}
          {paths.map(item => {
            const lit =
              item.region.index === hintIndex || item.region.index === settledIndex;
            if (!lit) return null;
            return (
              <Path
                key={'lit-' + item.code}
                d={item.d}
                fill="none"
                stroke={theme.colors.brand.lime}
                strokeWidth={2.6}
                strokeLinejoin="round"
              />
            );
          })}
        </Svg>
        <Pressable
          style={[styles.tapLayer, { width: contentW, height: contentH }]}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel="Map board. Tap a location to place the selected country."
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  board: {
    borderRadius: theme.radius.lg,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.ui.border,
    padding: BOARD_PAD,
    ...theme.shadows.card,
  },
  tapLayer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default MapBoard;
