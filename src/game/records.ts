import { MAX_RECORDS_PER_CONTINENT } from '../constants/config';
import type { ContinentId } from '../data/countries';
import type { RecordEntry, RoundResult } from './types';

/** Only unassisted, completed Timed runs are ranked. */
export function isEligible(result: RoundResult): boolean {
  return (
    result.mode === 'timed' &&
    !result.assisted &&
    result.hints === 0 &&
    result.placed === result.total
  );
}

function compare(a: RecordEntry, b: RecordEntry): number {
  if (a.elapsedMs !== b.elapsedMs) return a.elapsedMs - b.elapsedMs;
  if (a.errors !== b.errors) return a.errors - b.errors;
  return a.completedAt - b.completedAt;
}

export function recordsFor(
  all: RecordEntry[],
  continent: ContinentId,
): RecordEntry[] {
  return all.filter(r => r.continent === continent).sort(compare);
}

export function isNewBest(all: RecordEntry[], result: RoundResult): boolean {
  if (!isEligible(result)) return false;
  const existing = recordsFor(all, result.continent);
  if (existing.length === 0) return true;
  return result.elapsedMs < existing[0].elapsedMs;
}

/** Commits a run once; a repeated runId is ignored. */
export function commitRecord(
  all: RecordEntry[],
  result: RoundResult,
): RecordEntry[] {
  if (!isEligible(result)) return all;
  if (all.some(r => r.runId === result.runId)) return all;

  const entry: RecordEntry = {
    runId: result.runId,
    continent: result.continent,
    elapsedMs: result.elapsedMs,
    errors: result.errors,
    completedAt: result.completedAt,
  };

  const others = all.filter(r => r.continent !== result.continent);
  const mine = recordsFor(all, result.continent)
    .concat(entry)
    .sort(compare)
    .slice(0, MAX_RECORDS_PER_CONTINENT);
  return others.concat(mine);
}
