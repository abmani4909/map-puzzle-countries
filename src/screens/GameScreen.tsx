import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  Vibration,
  View,
  Animated,
} from 'react-native';
import assets from '../assets';
import AppBackground from '../components/AppBackground';
import CountryFactSheet from '../components/CountryFactSheet';
import DragOverlay from '../components/DragOverlay';
import GameDock from '../components/GameDock';
import IconButton from '../components/IconButton';
import MapBoard from '../components/MapBoard';
import PauseSheet from '../components/PauseSheet';
import ProgressReadout from '../components/ProgressReadout';
import ScreenHeader from '../components/ScreenHeader';
import {
  BOARD_MAX_H,
  BOARD_MAX_W,
  DRAG_THRESHOLD_DP,
  SETTLE_DURATION_MS,
  RETURN_DURATION_MS,
} from '../constants/config';
import theme from '../constants/theme';
import { continentById } from '../data/countries';
import { pointInPolygon } from '../game/mapgen';
import { evaluateDrop, unitToScreen } from '../game/placement';
import type { BoardFrame } from '../game/placement';
import type {
  PlacementStyle,
  Puzzle,
  RoundResult,
  Settings,
} from '../game/types';
import usePuzzle from '../hooks/usePuzzle';

type Props = {
  puzzle: Puzzle;
  settings: Settings;
  onSaveExit: () => void;
  onPlacementChange: (style: PlacementStyle) => void;
  onGameOver: (result: RoundResult) => void;
};

/** Stroke padding baked into every CountryShape viewBox. */
const SHAPE_PAD = 1.4;

export function GameScreen({
  puzzle,
  settings,
  onSaveExit,
  onPlacementChange,
  onGameOver,
}: Props) {
  const { state, dispatch, timer, total, currentPiece, placedSet, markStarted, restart } =
    usePuzzle(puzzle, settings, onGameOver);

  const [mapAreaH, setMapAreaH] = useState(0);
  const [dragSize, setDragSize] = useState({ w: 0, h: 0 });
  const [settledIndex, setSettledIndex] = useState(-1);
  const [tapSelected, setTapSelected] = useState(false);

  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const frameRef = useRef<BoardFrame | null>(null);
  const pieceRef = useRef(currentPiece);
  const phaseRef = useRef(state.phase);
  const placementRef = useRef(settings.placement);
  const soundRef = useRef(settings.sound);
  const offsetRef = useRef({ x: 0, y: 0 });

  pieceRef.current = currentPiece;
  phaseRef.current = state.phase;
  placementRef.current = settings.placement;
  soundRef.current = settings.sound;

  const continent = continentById(puzzle.continent);
  const boardHeight = Math.max(
    180,
    Math.min(mapAreaH - 2 * theme.spacing.sm, BOARD_MAX_H),
  );

  // --- board frame ------------------------------------------------------
  const handleFrame = useCallback((frame: BoardFrame) => {
    frameRef.current = frame;
  }, []);

  const handleMapLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      setMapAreaH(event.nativeEvent.layout.height);
    },
    [],
  );

  // --- success / failure ------------------------------------------------
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
      if (returnTimer.current) clearTimeout(returnTimer.current);
    },
    [],
  );

  const commitPlacement = useCallback(() => {
    const piece = pieceRef.current;
    if (!piece) return;
    if (soundRef.current) Vibration.vibrate(12);
    setSettledIndex(piece.region.index);
    setTapSelected(false);
    dispatch({ type: 'place', code: piece.country.code });
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(
      () => setSettledIndex(-1),
      SETTLE_DURATION_MS + 240,
    );
  }, [dispatch]);

  const commitMiss = useCallback(() => {
    dispatch({ type: 'miss' });
    if (returnTimer.current) clearTimeout(returnTimer.current);
    returnTimer.current = setTimeout(
      () => dispatch({ type: 'cancel' }),
      RETURN_DURATION_MS,
    );
  }, [dispatch]);

  // --- drag -------------------------------------------------------------
  const beginDrag = useCallback(
    (x: number, y: number) => {
      const frame = frameRef.current;
      const piece = pieceRef.current;
      if (!frame || !piece) return;
      const box = piece.region.bbox;
      const offX = (piece.region.anchor.x - (box.x - SHAPE_PAD)) * frame.scaleX;
      const offY = (piece.region.anchor.y - (box.y - SHAPE_PAD)) * frame.scaleY;
      offsetRef.current = { x: offX, y: offY };
      setDragSize({
        w: (box.w + SHAPE_PAD * 2) * frame.scaleX,
        h: (box.h + SHAPE_PAD * 2) * frame.scaleY,
      });
      pos.setValue({ x: x - offX, y: y - offY });
      markStarted();
      dispatch({ type: 'pickup' });
    },
    [pos, markStarted, dispatch],
  );

  const moveDrag = useCallback(
    (x: number, y: number) => {
      pos.setValue({
        x: x - offsetRef.current.x,
        y: y - offsetRef.current.y,
      });
    },
    [pos],
  );

  const endDrag = useCallback(
    (x: number, y: number) => {
      const frame = frameRef.current;
      const piece = pieceRef.current;
      if (!frame || !piece) {
        dispatch({ type: 'cancel' });
        return;
      }
      const outcome = evaluateDrop(frame, piece.region, x, y);
      if (outcome === 'correct') {
        commitPlacement();
      } else if (outcome === 'miss') {
        commitMiss();
      } else {
        dispatch({ type: 'cancel' });
      }
    },
    [dispatch, commitPlacement, commitMiss],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_event, gesture) => {
          if (phaseRef.current !== 'ready') return false;
          if (placementRef.current !== 'drag') return false;
          if (!frameRef.current || !pieceRef.current) return false;
          return (
            Math.abs(gesture.dx) > DRAG_THRESHOLD_DP ||
            Math.abs(gesture.dy) > DRAG_THRESHOLD_DP
          );
        },
        onPanResponderGrant: (_event, gesture) => {
          beginDrag(gesture.moveX || gesture.x0, gesture.moveY || gesture.y0);
        },
        onPanResponderMove: (_event, gesture) => {
          moveDrag(gesture.moveX, gesture.moveY);
        },
        onPanResponderRelease: (_event, gesture) => {
          endDrag(gesture.moveX, gesture.moveY);
        },
        onPanResponderTerminate: () => {
          dispatch({ type: 'cancel' });
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [beginDrag, moveDrag, endDrag, dispatch],
  );

  // --- tap placement + review ------------------------------------------
  const handleSelectPiece = useCallback(() => {
    if (phaseRef.current !== 'ready') return;
    markStarted();
    setTapSelected(prev => !prev);
  }, [markStarted]);

  const handleBoardPress = useCallback(
    (unitX: number, unitY: number) => {
      if (phaseRef.current !== 'ready') return;
      const frame = frameRef.current;
      const piece = pieceRef.current;

      if (placementRef.current === 'tap' && tapSelected && frame && piece) {
        const screen = unitToScreen(frame, unitX, unitY);
        const outcome = evaluateDrop(frame, piece.region, screen.x, screen.y);
        dispatch({ type: 'pickup' });
        if (outcome === 'correct') {
          commitPlacement();
        } else {
          commitMiss();
        }
        return;
      }

      const hit = puzzle.pieces.find(
        p =>
          placedSet[p.country.code] === true &&
          pointInPolygon(unitX, unitY, p.region.points),
      );
      if (hit) dispatch({ type: 'review', code: hit.country.code });
    },
    [tapSelected, dispatch, commitPlacement, commitMiss, puzzle.pieces, placedSet],
  );

  // --- sheets -----------------------------------------------------------
  const factPiece = useMemo(() => {
    if (state.phase === 'fact' && state.factIndex >= 0) {
      return puzzle.pieces[state.factIndex] || null;
    }
    if (state.phase === 'reviewing' && state.reviewCode) {
      return puzzle.pieces.find(p => p.country.code === state.reviewCode) || null;
    }
    return null;
  }, [state.phase, state.factIndex, state.reviewCode, puzzle.pieces]);

  const handleContinue = useCallback(() => {
    if (phaseRef.current === 'reviewing') {
      dispatch({ type: 'closeReview' });
    } else {
      dispatch({ type: 'next', total });
    }
  }, [dispatch, total]);

  const handlePause = useCallback(() => dispatch({ type: 'pause' }), [dispatch]);
  const handleResume = useCallback(() => dispatch({ type: 'resume' }), [dispatch]);

  const handleRestart = useCallback(() => {
    setTapSelected(false);
    setSettledIndex(-1);
    restart();
  }, [restart]);

  const handleHint = useCallback(() => {
    markStarted();
    dispatch({ type: 'hint' });
  }, [dispatch, markStarted]);

  // --- Android back -----------------------------------------------------
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (phaseRef.current === 'paused') {
        dispatch({ type: 'resume' });
        return true;
      }
      if (phaseRef.current === 'reviewing') {
        dispatch({ type: 'closeReview' });
        return true;
      }
      if (phaseRef.current === 'fact') return true;
      dispatch({ type: 'pause' });
      return true;
    });
    return () => sub.remove();
  }, [dispatch]);

  const placedCount = state.placed.length;
  const hintIndex = state.hintActive && currentPiece ? currentPiece.region.index : -1;
  const summary =
    'Placed ' + placedCount + ' of ' + total + ' - ' + (puzzle.mode === 'timed' ? 'Timed' : 'Relaxed');

  return (
    <AppBackground variant="game">
      <ScreenHeader
        variant="band"
        align="center"
        title={continent.name}
        subtitle={puzzle.mode === 'timed' ? 'Timed' : 'Relaxed'}
        leftSlot={
          <IconButton accessibilityLabel="Home and pause" onPress={handlePause}>
            <Image source={assets.iconHome} style={styles.navIcon} resizeMode="contain" />
          </IconButton>
        }
        rightSlot={
          <IconButton accessibilityLabel="Pause the puzzle" onPress={handlePause}>
            <Image source={assets.iconPause} style={styles.navIcon} resizeMode="contain" />
          </IconButton>
        }
      />

      <ProgressReadout
        placed={placedCount}
        total={total}
        errors={state.errors}
        mode={puzzle.mode}
        elapsedMs={timer.display}
        assisted={state.assisted}
      />

      <View style={styles.mapArea} onLayout={handleMapLayout}>
        {mapAreaH > 0 ? (
          <MapBoard
            pieces={puzzle.pieces}
            landmass={puzzle.landmass}
            placedSet={placedSet}
            hintIndex={hintIndex}
            settledIndex={settledIndex}
            boardWidth={BOARD_MAX_W}
            boardHeight={boardHeight}
            onFrame={handleFrame}
            onBoardPress={handleBoardPress}
          />
        ) : null}
      </View>

      {state.toast ? (
        <View style={styles.toastWrap} pointerEvents="none">
          <View style={styles.toast}>
            <Text style={styles.toastText}>{state.toast}</Text>
          </View>
        </View>
      ) : null}

      <GameDock
        piece={currentPiece}
        placement={settings.placement}
        selected={tapSelected}
        dragging={state.phase === 'dragging'}
        disabled={state.phase !== 'ready'}
        panHandlers={panResponder.panHandlers}
        onHint={handleHint}
        onSelectPiece={handleSelectPiece}
        onPlacementChange={onPlacementChange}
      />

      <DragOverlay
        region={currentPiece ? currentPiece.region : null}
        width={dragSize.w}
        height={dragSize.h}
        pos={pos}
        visible={state.phase === 'dragging'}
      />

      <CountryFactSheet
        piece={factPiece}
        lastPiece={state.factIndex === total - 1}
        reviewOnly={state.phase === 'reviewing'}
        reducedMotion={settings.reducedMotion}
        onContinue={handleContinue}
      />

      <PauseSheet
        visible={state.phase === 'paused'}
        summary={summary}
        reducedMotion={settings.reducedMotion}
        onResume={handleResume}
        onRestart={handleRestart}
        onSaveExit={onSaveExit}
      />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  navIcon: { width: 24, height: 24 },
  mapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  toastWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 260,
    alignItems: 'center',
  },
  toast: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.brand.berry,
    ...theme.shadows.raised,
  },
  toastText: {
    fontSize: theme.typography.instruction.fontSize,
    lineHeight: theme.typography.instruction.lineHeight,
    fontWeight: '700',
    color: theme.colors.text.onDark,
  },
});

export default GameScreen;
