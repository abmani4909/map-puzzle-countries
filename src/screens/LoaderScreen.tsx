import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import AppBackground from '../components/AppBackground';
import { LOADER_DURATION_MS } from '../constants/config';
import theme from '../constants/theme';

type Props = {
  onReady: () => void;
};

const TRACK_W = 192;

/**
 * Branded splash. Dark berry overlay, centred brand group, one continuous
 * progress bar. Deliberately shares nothing with the light Menu palette.
 */
export function LoaderScreen({ onReady }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    // Width is a layout property: JS driver only.
    Animated.timing(fill, {
      toValue: TRACK_W,
      duration: LOADER_DURATION_MS,
      useNativeDriver: false,
    }).start();

    const id = setTimeout(onReady, LOADER_DURATION_MS);
    return () => clearTimeout(id);
  }, [enter, fill, onReady]);

  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] });

  return (
    <AppBackground variant="loader">
      <View style={styles.root}>
        <Animated.View
          pointerEvents="none"
          style={[styles.brand, { opacity: enter, transform: [{ scale }] }]}>
          <View style={styles.logoCard}>
            <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title}>MAP PUZZLE</Text>
          <Text style={styles.title}>COUNTRIES</Text>
          <Text style={styles.subtitle}>One country at a time</Text>
        </Animated.View>

        <View style={styles.progressBlock}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: fill }]} />
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  brand: { alignItems: 'center' },
  logoCard: {
    width: 152,
    height: 152,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  logo: { width: 128, height: 128 },
  title: {
    fontSize: theme.typography.hero.fontSize,
    lineHeight: theme.typography.hero.lineHeight,
    fontWeight: theme.typography.hero.fontWeight,
    letterSpacing: theme.typography.hero.letterSpacing,
    color: theme.colors.text.onDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '400',
    color: theme.colors.text.onPaper,
    marginTop: theme.spacing.md,
  },
  progressBlock: {
    position: 'absolute',
    bottom: 96,
    alignItems: 'center',
  },
  track: {
    width: TRACK_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(221,177,176,0.35)',
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.brand.lime,
  },
  loading: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.onPaper,
    marginTop: theme.spacing.md,
  },
});

export default LoaderScreen;
