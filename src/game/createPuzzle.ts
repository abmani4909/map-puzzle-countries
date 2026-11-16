import { GRID_COLS, GRID_ROWS, PIECES_PER_ROUND } from '../constants/config';
import { continentById, countriesOf } from '../data/countries';
import type { ContinentId } from '../data/countries';
import { buildRegions, landmassPath } from './mapgen';
import type { Piece, PlayMode, Puzzle } from './types';

let runCounter = 0;

function shuffle<T>(items: T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

/** Countries available for one continent (full bundled group). */
export function roundSize(continent: ContinentId): number {
  return Math.min(PIECES_PER_ROUND, countriesOf(continent).length);
}

export function createPuzzle(continent: ContinentId, mode: PlayMode): Puzzle {
  const meta = continentById(continent);
  const regions = buildRegions(meta.seed, GRID_COLS, GRID_ROWS);
  const picked = shuffle(countriesOf(continent)).slice(0, regions.length);
  const slots = shuffle(regions);

  const pieces: Piece[] = picked.map((country, i) => ({
    country,
    region: slots[i],
  }));

  runCounter += 1;
  return {
    runId: 'run-' + Date.now().toString(36) + '-' + runCounter,
    continent,
    mode,
    pieces,
    landmass: landmassPath(regions, GRID_COLS, GRID_ROWS),
  };
}
