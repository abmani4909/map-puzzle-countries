import React, { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';
import theme from '../constants/theme';
import { toPath } from '../game/mapgen';
import type { Region } from '../game/mapgen';

type Props = {
  region: Region;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  /** true keeps the board's non-uniform scale, false fits uniformly. */
  stretch?: boolean;
  opacity?: number;
};

const PAD = 1.4;

/** The same region outline, reused in the tray, the drag layer and the sheet. */
export function CountryShape({
  region,
  width,
  height,
  fill = theme.colors.bg.accent,
  stroke = theme.colors.brand.berry,
  strokeWidth = 1.25,
  stretch = false,
  opacity = 1,
}: Props) {
  const d = useMemo(() => toPath(region.points), [region]);
  const box = region.bbox;
  const viewBox =
    (box.x - PAD).toFixed(2) +
    ' ' +
    (box.y - PAD).toFixed(2) +
    ' ' +
    (box.w + PAD * 2).toFixed(2) +
    ' ' +
    (box.h + PAD * 2).toFixed(2);

  return (
    <Svg
      width={width}
      height={height}
      viewBox={viewBox}
      opacity={opacity}
      preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}>
      <Path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default React.memo(CountryShape);
