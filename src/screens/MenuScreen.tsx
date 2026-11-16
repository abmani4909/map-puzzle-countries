import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { HelpCircle, Play, Settings, Trophy } from 'lucide-react-native';
import assets from '../assets';
import AppBackground from '../components/AppBackground';
import ContinentCard from '../components/ContinentCard';
import HowToPlaySheet from '../components/HowToPlaySheet';
import IconButton from '../components/IconButton';
import ModeSelector from '../components/ModeSelector';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import { BOTTOM_INSET, IS_COMPACT } from '../constants/config';
import theme from '../constants/theme';
import { CONTINENTS, continentById, countriesOf } from '../data/countries';
import type { ContinentId } from '../data/countries';
import { roundSize } from '../game/createPuzzle';
import type { PlayMode, Selection, Settings as GameSettings } from '../game/types';

type Props = {
  selection: Selection;
  completedContinents: ContinentId[];
  settings: GameSettings;
  onSelectionChange: (selection: Selection) => void;
  onPlay: () => void;
  onSettings: () => void;
  onBestTimes: () => void;
};

export function MenuScreen({
  selection,
  completedContinents,
  settings,
  onSelectionChange,
  onPlay,
  onSettings,
  onBestTimes,
}: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const [howTo, setHowTo] = useState(false);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: settings.reducedMotion ? theme.animation.reduced : 200,
      useNativeDriver: true,
    }).start();
  }, [fade, settings.reducedMotion]);

  const handleSelectContinent = useCallback(
    (continent: ContinentId) => {
      onSelectionChange({ continent, mode: selection.mode });
    },
    [onSelectionChange, selection.mode],
  );

  const handleSelectMode = useCallback(
    (mode: PlayMode) => {
      onSelectionChange({ continent: selection.continent, mode });
    },
    [onSelectionChange, selection.continent],
  );

  const openHowTo = useCallback(() => setHowTo(true), []);
  const closeHowTo = useCallback(() => setHowTo(false), []);

  const chosen = continentById(selection.continent);
  const chosenCount = roundSize(selection.continent);

  return (
    <AppBackground variant="menu">
      <ScreenHeader
        title="Continents"
        rightSlot={
          <IconButton accessibilityLabel="Settings" onPress={onSettings}>
            <Settings size={24} color={theme.colors.brand.berry} strokeWidth={2} />
          </IconButton>
        }
      />

      <Animated.View pointerEvents="box-none" style={[styles.body, { opacity: fade }]}>
        <View style={styles.hero}>
          <View style={styles.logoWrap}>
            <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle} numberOfLines={1}>
              Build your world
            </Text>
            {IS_COMPACT ? null : (
              <Text style={styles.heroBody} numberOfLines={2}>
                Choose a continent. Place every country.
              </Text>
            )}
          </View>
          <View style={styles.heroDecor}>
            <Image source={assets.sprite3} style={styles.decor} resizeMode="contain" />
            <Image source={assets.sprite4} style={styles.decor} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.grid}>
          {[0, 1, 2].map(row => (
            <View key={'row-' + row} style={styles.gridRow}>
              {CONTINENTS.slice(row * 2, row * 2 + 2).map(continent => (
                <ContinentCard
                  key={continent.id}
                  continent={continent}
                  count={countriesOf(continent.id).length}
                  selected={selection.continent === continent.id}
                  completed={completedContinents.indexOf(continent.id) !== -1}
                  compact={IS_COMPACT}
                  onSelect={handleSelectContinent}
                />
              ))}
            </View>
          ))}
        </View>

        <ModeSelector value={selection.mode} onChange={handleSelectMode} />

        <View style={styles.ctaBlock}>
          <Text style={styles.chosen} numberOfLines={1}>
            {chosen.name} - {chosenCount} countries this round
          </Text>
          <PrimaryButton
            label="PLAY"
            Icon={Play}
            onPress={onPlay}
            accessibilityLabel={'Play ' + chosen.name + ' in ' + selection.mode + ' mode'}
          />
        </View>

        <View style={styles.utility}>
          <SecondaryButton
            label="Best Times"
            Icon={Trophy}
            onPress={onBestTimes}
            flex
          />
          <SecondaryButton
            label="How to play"
            Icon={HelpCircle}
            onPress={openHowTo}
            flex
          />
        </View>
      </Animated.View>

      <HowToPlaySheet
        visible={howTo}
        reducedMotion={settings.reducedMotion}
        onClose={closeHowTo}
      />
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
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: IS_COMPACT ? 56 : 72,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.ui.glass,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderSoft,
    ...theme.shadows.card,
  },
  logoWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 44, height: 44 },
  heroText: { flex: 1, marginLeft: theme.spacing.md },
  heroTitle: {
    fontSize: IS_COMPACT ? 22 : 24,
    lineHeight: IS_COMPACT ? 26 : 30,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  heroBody: {
    fontSize: theme.typography.instruction.fontSize,
    lineHeight: theme.typography.instruction.lineHeight,
    fontWeight: theme.typography.instruction.fontWeight,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  heroDecor: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  decor: { width: 24, height: 24, opacity: 0.85 },
  grid: { gap: IS_COMPACT ? 8 : 8 },
  gridRow: { flexDirection: 'row', gap: theme.spacing.md },
  ctaBlock: { gap: theme.spacing.sm },
  chosen: {
    fontSize: theme.typography.instruction.fontSize,
    lineHeight: theme.typography.instruction.lineHeight,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  utility: { flexDirection: 'row', gap: theme.spacing.sm },
});

export default MenuScreen;
