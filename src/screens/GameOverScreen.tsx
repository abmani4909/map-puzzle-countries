import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Globe, RotateCcw, Trophy } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import assets from '../assets';
import AppBackground from '../components/AppBackground';
import PrimaryButton from '../components/PrimaryButton';
import ResultSummary from '../components/ResultSummary';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import { BOTTOM_INSET, IS_COMPACT } from '../constants/config';
import theme from '../constants/theme';
import { continentById } from '../data/countries';
import type { RoundResult, Settings } from '../game/types';

type Props = {
  result: RoundResult;
  isNewBest: boolean;
  settings: Settings;
  onPlayAgain: () => void;
  onMenu: () => void;
  onBestTimes: () => void;
};

const PREVIEW = IS_COMPACT ? 72 : 112;

function recordMessage(result: RoundResult, isNewBest: boolean): string {
  if (isNewBest) return 'NEW BEST TIME';
  if (result.assisted) return 'Practice complete - hints used';
  if (result.mode === 'timed') return 'Timed run complete';
  return 'Great exploring';
}

export function GameOverScreen({
  result,
  isNewBest,
  settings,
  onPlayAgain,
  onMenu,
  onBestTimes,
}: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const continent = continentById(result.continent);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: settings.reducedMotion ? theme.animation.reduced : 200,
      useNativeDriver: true,
    }).start();
  }, [fade, settings.reducedMotion]);

  return (
    <AppBackground variant="result">
      <ScreenHeader title="Puzzle complete" align="center" />

      <Animated.View pointerEvents="box-none" style={[styles.body, { opacity: fade }]}>
        <View style={styles.hero}>
          <Svg width={PREVIEW} height={PREVIEW} viewBox="0 0 100 100">
            <Path
              d={continent.silhouette}
              fill={theme.colors.bg.accent}
              stroke={theme.colors.brand.berry}
              strokeWidth={2.4}
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.continentName} numberOfLines={1}>
            {continent.name}
          </Text>
          <Text style={styles.heroLine} numberOfLines={2}>
            All {result.total} countries placed
          </Text>
        </View>

        <View
          style={[
            styles.recordBand,
            isNewBest ? styles.recordBandBest : null,
          ]}>
          <Text style={styles.recordText} numberOfLines={1}>
            {recordMessage(result, isNewBest)}
          </Text>
          <Text style={styles.recordCaption} numberOfLines={1}>
            Every piece is progress
          </Text>
        </View>

        <ResultSummary result={result} />

        {IS_COMPACT ? null : (
          <View style={styles.decorRow}>
            <Image source={assets.sprite1} style={styles.decor} resizeMode="contain" />
            <Image source={assets.sprite2} style={styles.decor} resizeMode="contain" />
            <Image source={assets.sprite5} style={styles.decor} resizeMode="contain" />
          </View>
        )}

        <View style={styles.actions}>
          <SecondaryButton label="Best Times" Icon={Trophy} onPress={onBestTimes} />
          <PrimaryButton
            label="PLAY AGAIN"
            Icon={RotateCcw}
            onPress={onPlayAgain}
            accessibilityLabel="Play this continent again"
          />
          <SecondaryButton
            label="CHOOSE CONTINENT"
            Icon={Globe}
            onPress={onMenu}
            accessibilityLabel="Choose another continent"
          />
        </View>
      </Animated.View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: BOTTOM_INSET,
    justifyContent: 'space-between',
  },
  hero: { alignItems: 'center' },
  continentName: {
    fontSize: theme.typography.title.fontSize,
    lineHeight: theme.typography.title.lineHeight,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  heroLine: {
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
    fontWeight: '400',
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  recordBand: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
  },
  recordBandBest: {
    backgroundColor: theme.colors.ui.limeSoft,
    borderColor: theme.colors.brand.lime,
  },
  recordText: {
    fontSize: theme.typography.section.fontSize,
    lineHeight: theme.typography.section.lineHeight,
    fontWeight: theme.typography.section.fontWeight,
    color: theme.colors.text.primary,
  },
  recordCaption: {
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: theme.typography.caption.fontWeight,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  decorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xl,
  },
  decor: { width: 28, height: 28, opacity: 0.9 },
  actions: { gap: theme.spacing.md },
});

export default GameOverScreen;
