import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CLOCK_TICK_MS } from '../constants/config';

/**
 * Accumulates active milliseconds from a monotonic clock.
 * Interval ticks only repaint; they never add elapsed time, so a missed tick
 * can't drift the stopwatch.
 */
export function useActiveTimer(visible: boolean) {
  const accumulatedRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);
  const [display, setDisplay] = useState(0);

  const read = useCallback(() => {
    const base = accumulatedRef.current;
    if (startedAtRef.current === null) return base;
    return base + (Date.now() - startedAtRef.current);
  }, []);

  const start = useCallback(() => {
    if (startedAtRef.current === null) startedAtRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    if (startedAtRef.current !== null) {
      accumulatedRef.current += Date.now() - startedAtRef.current;
      startedAtRef.current = null;
    }
    setDisplay(accumulatedRef.current);
  }, []);

  const reset = useCallback(() => {
    accumulatedRef.current = 0;
    startedAtRef.current = null;
    setDisplay(0);
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const id = setInterval(() => {
      if (startedAtRef.current !== null) setDisplay(read());
    }, CLOCK_TICK_MS);
    return () => clearInterval(id);
  }, [visible, read]);

  return useMemo(
    () => ({ display, read, start, pause, reset }),
    [display, read, start, pause, reset],
  );
}

export default useActiveTimer;
