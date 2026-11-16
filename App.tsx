import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import theme from './src/constants/theme';
import type { ContinentId } from './src/data/countries';
import { createPuzzle } from './src/game/createPuzzle';
import { commitRecord, isNewBest as computeNewBest } from './src/game/records';
import type {
  PlacementStyle,
  Puzzle,
  RecordEntry,
  RoundResult,
  Screen,
  Selection,
  Settings,
} from './src/game/types';
import * as storage from './src/services/storage';
import BestTimesScreen from './src/screens/BestTimesScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import GameScreen from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import SettingsScreen from './src/screens/SettingsScreen';

/**
 * App-level state machine only: screen routing, settings, immutable results.
 * All gameplay, hit testing and drag maths live in the game modules.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [settings, setSettings] = useState<Settings>(storage.loadSettings);
  const [records, setRecords] = useState<RecordEntry[]>(storage.loadRecords);
  const [completed, setCompleted] = useState<ContinentId[]>(storage.loadCompleted);
  const [selection, setSelection] = useState<Selection>({
    continent: 'south_america',
    mode: 'relaxed',
  });
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [newBest, setNewBest] = useState(false);
  const [recordsContinent, setRecordsContinent] =
    useState<ContinentId>('south_america');

  // --- settings --------------------------------------------------------
  const handleSettings = useCallback((next: Settings) => {
    setSettings(next);
    storage.saveSettings(next);
  }, []);

  const handlePlacementChange = useCallback(
    (placement: PlacementStyle) => {
      const next = { ...settings, placement };
      setSettings(next);
      storage.saveSettings(next);
    },
    [settings],
  );

  const handleSelectionChange = useCallback((next: Selection) => {
    setSelection(next);
  }, []);

  // --- routing ---------------------------------------------------------
  const goMenu = useCallback(() => setScreen('menu'), []);

  const startPuzzle = useCallback((continent: ContinentId, mode: Selection['mode']) => {
    setPuzzle(createPuzzle(continent, mode));
    setResult(null);
    setNewBest(false);
    setScreen('game');
  }, []);

  const handlePlay = useCallback(() => {
    startPuzzle(selection.continent, selection.mode);
  }, [startPuzzle, selection]);

  const handlePlayAgain = useCallback(() => {
    if (result) startPuzzle(result.continent, result.mode);
  }, [startPuzzle, result]);

  const handleStartFromRecords = useCallback(() => {
    const next: Selection = { continent: recordsContinent, mode: 'timed' };
    setSelection(next);
    startPuzzle(next.continent, next.mode);
  }, [recordsContinent, startPuzzle]);

  const handleGameOver = useCallback(
    (round: RoundResult) => {
      setResult(round);
      setNewBest(computeNewBest(records, round));
      const nextRecords = commitRecord(records, round);
      setRecords(nextRecords);
      storage.saveRecords(nextRecords);
      if (completed.indexOf(round.continent) === -1) {
        const nextCompleted = completed.concat(round.continent);
        setCompleted(nextCompleted);
        storage.saveCompleted(nextCompleted);
      }
      setScreen('gameover');
    },
    [records, completed],
  );

  const handleResetProgress = useCallback(() => {
    storage.resetProgress();
    setRecords([]);
    setCompleted([]);
  }, []);

  const openBestTimes = useCallback(() => {
    setRecordsContinent(selection.continent);
    setScreen('besttimes');
  }, [selection.continent]);

  const openBestTimesFromResult = useCallback(() => {
    if (result) setRecordsContinent(result.continent);
    setScreen('besttimes');
  }, [result]);

  const openSettings = useCallback(() => setScreen('settings'), []);

  // --- Android back (the Game screen handles its own) -------------------
  useEffect(() => {
    if (screen === 'game' || screen === 'loader') return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'menu') return false;
      setScreen('menu');
      return true;
    });
    return () => sub.remove();
  }, [screen]);

  let content: React.ReactNode = null;
  if (screen === 'loader') {
    content = <LoaderScreen onReady={goMenu} />;
  } else if (screen === 'menu') {
    content = (
      <MenuScreen
        selection={selection}
        completedContinents={completed}
        settings={settings}
        onSelectionChange={handleSelectionChange}
        onPlay={handlePlay}
        onSettings={openSettings}
        onBestTimes={openBestTimes}
      />
    );
  } else if (screen === 'game' && puzzle) {
    content = (
      <GameScreen
        key={puzzle.runId}
        puzzle={puzzle}
        settings={settings}
        onSaveExit={goMenu}
        onPlacementChange={handlePlacementChange}
        onGameOver={handleGameOver}
      />
    );
  } else if (screen === 'gameover' && result) {
    content = (
      <GameOverScreen
        result={result}
        isNewBest={newBest}
        settings={settings}
        onPlayAgain={handlePlayAgain}
        onMenu={goMenu}
        onBestTimes={openBestTimesFromResult}
      />
    );
  } else if (screen === 'besttimes') {
    content = (
      <BestTimesScreen
        records={records}
        selectedContinent={recordsContinent}
        onSelectContinent={setRecordsContinent}
        onStart={handleStartFromRecords}
        onBack={goMenu}
      />
    );
  } else if (screen === 'settings') {
    content = (
      <SettingsScreen
        settings={settings}
        onUpdate={handleSettings}
        onResetProgress={handleResetProgress}
        onBack={goMenu}
      />
    );
  } else {
    content = (
      <MenuScreen
        selection={selection}
        completedContinents={completed}
        settings={settings}
        onSelectionChange={handleSelectionChange}
        onPlay={handlePlay}
        onSettings={openSettings}
        onBestTimes={openBestTimes}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={screen === 'loader' ? 'light-content' : 'dark-content'}
      />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
});
