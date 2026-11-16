import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { HINT_DURATION_MS, TOAST_DURATION_MS } from '../constants/config';
import { continentById } from '../data/countries';
import {
  initialSession,
  sessionReducer,
} from '../game/sessionReducer';
import type { Puzzle, RoundResult, Settings } from '../game/types';
import useActiveTimer from './useActiveTimer';

/**
 * Round orchestration: reducer state + the active clock + the single
 * completion callback. Drag maths lives in the screen, geometry in the board.
 */
export function usePuzzle(
  puzzle: Puzzle,
  settings: Settings,
  onGameOver: (result: RoundResult) => void,
) {
  const [state, dispatch] = useReducer(sessionReducer, initialSession);
  const timer = useActiveTimer(puzzle.mode === 'timed');
  const startedRef = useRef(false);
  const committedRef = useRef(false);

  const total = puzzle.pieces.length;
  const currentPiece = state.index < total ? puzzle.pieces[state.index] : null;

  const placedSet = useMemo(() => {
    const map: Record<string, true> = {};
    state.placed.forEach(code => {
      map[code] = true;
    });
    return map;
  }, [state.placed]);

  // --- clock segments -------------------------------------------------
  const running =
    startedRef.current &&
    (state.phase === 'ready' ||
      state.phase === 'dragging' ||
      state.phase === 'returning');

  useEffect(() => {
    if (running) {
      timer.start();
    } else {
      timer.pause();
    }
  }, [running, timer, state.phase]);

  const markStarted = useCallback(() => {
    startedRef.current = true;
  }, []);

  // --- transient feedback ---------------------------------------------
  useEffect(() => {
    if (!state.hintActive) return undefined;
    const id = setTimeout(() => dispatch({ type: 'hintEnd' }), HINT_DURATION_MS);
    return () => clearTimeout(id);
  }, [state.hintActive]);

  useEffect(() => {
    if (state.toast === null) return undefined;
    const id = setTimeout(() => dispatch({ type: 'toastEnd' }), TOAST_DURATION_MS);
    return () => clearTimeout(id);
  }, [state.toast]);

  // --- completion, delivered exactly once ------------------------------
  useEffect(() => {
    if (state.phase !== 'completed' || committedRef.current) return;
    committedRef.current = true;
    const result: RoundResult = {
      runId: puzzle.runId,
      continent: puzzle.continent,
      continentName: continentById(puzzle.continent).name,
      mode: puzzle.mode,
      elapsedMs: timer.read(),
      errors: state.errors,
      hints: state.hints,
      placed: state.placed.length,
      total,
      assisted: state.assisted,
      completedAt: Date.now(),
    };
    onGameOver(result);
  }, [
    state.phase,
    state.errors,
    state.hints,
    state.placed.length,
    state.assisted,
    puzzle,
    total,
    timer,
    onGameOver,
  ]);

  const restart = useCallback(() => {
    startedRef.current = false;
    committedRef.current = false;
    timer.reset();
    dispatch({ type: 'reset' });
  }, [timer]);

  return {
    state,
    dispatch,
    timer,
    total,
    currentPiece,
    placedSet,
    settings,
    markStarted,
    restart,
  };
}

export default usePuzzle;
