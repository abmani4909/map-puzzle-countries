import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import assets from '../assets';
import theme from '../constants/theme';

export type BackgroundVariant =
  | 'loader'
  | 'menu'
  | 'game'
  | 'result'
  | 'records'
  | 'settings';

type Props = {
  variant: BackgroundVariant;
  children: React.ReactNode;
};

type Recipe = {
  dark: boolean;
  colors: string[];
  imageOpacity: number;
  contour: string;
  contourOpacity: number;
  start: { x: number; y: number };
  end: { x: number; y: number };
};

const RECIPES: Record<BackgroundVariant, Recipe> = {
  loader: {
    dark: true,
    colors: ['rgba(36,24,30,0.96)', 'rgba(94,35,64,0.93)', 'rgba(171,42,102,0.88)'],
    imageOpacity: 1,
    contour: theme.colors.brand.paper,
    contourOpacity: 0.1,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  menu: {
    dark: false,
    colors: theme.gradients.menu,
    imageOpacity: 0.12,
    contour: theme.colors.brand.berry,
    contourOpacity: 0.07,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  game: {
    dark: false,
    colors: theme.gradients.game,
    imageOpacity: 0.08,
    contour: theme.colors.brand.berry,
    contourOpacity: 0.06,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  result: {
    dark: false,
    colors: theme.gradients.result,
    imageOpacity: 0.12,
    contour: theme.colors.brand.berry,
    contourOpacity: 0.08,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  records: {
    dark: false,
    colors: theme.gradients.records,
    imageOpacity: 0.1,
    contour: theme.colors.brand.berry,
    contourOpacity: 0.07,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  settings: {
    dark: false,
    colors: theme.gradients.settings,
    imageOpacity: 0.1,
    contour: theme.colors.brand.berry,
    contourOpacity: 0.07,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
};

/** Quiet latitude curves - decorative only, always behind content. */
function Contours({ color, opacity }: { color: string; opacity: number }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 100 180" preserveAspectRatio="none">
        <Path
          d="M-10 28 C 20 14, 58 42, 110 20"
          stroke={color}
          strokeWidth={1.2}
          strokeOpacity={opacity}
          fill="none"
        />
        <Path
          d="M-10 64 C 26 46, 62 86, 110 58"
          stroke={color}
          strokeWidth={1.2}
          strokeOpacity={opacity}
          fill="none"
        />
        <Path
          d="M-10 112 C 24 94, 64 132, 110 104"
          stroke={color}
          strokeWidth={1.2}
          strokeOpacity={opacity}
          fill="none"
        />
        <Path
          d="M-10 152 C 28 138, 60 170, 110 146"
          stroke={color}
          strokeWidth={1.2}
          strokeOpacity={opacity}
          fill="none"
        />
      </Svg>
    </View>
  );
}

/**
 * Shared screen shell: the single bg_game illustration plus a per-screen
 * gradient. The gradient is what makes Loader / Menu / Game / Results read as
 * different places.
 */
export function AppBackground({ variant, children }: Props) {
  const recipe = RECIPES[variant];
  const image = (
    <Image
      source={assets.bgGame}
      style={[StyleSheet.absoluteFillObject, { opacity: recipe.imageOpacity }]}
      resizeMode="cover"
    />
  );
  const gradient = (
    <LinearGradient
      colors={recipe.colors}
      start={recipe.start}
      end={recipe.end}
      style={StyleSheet.absoluteFillObject}
    />
  );

  return (
    <View style={[styles.root, { backgroundColor: recipe.dark ? theme.colors.brand.ink : theme.colors.bg.primary }]}>
      {recipe.dark ? image : gradient}
      {recipe.dark ? gradient : image}
      <Contours color={recipe.contour} opacity={recipe.contourOpacity} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});

export default AppBackground;
