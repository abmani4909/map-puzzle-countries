import type { ContinentId, Country } from '../data/countries';
import type { Region } from './mapgen';

export type PlayMode = 'relaxed' | 'timed';
export type PlacementStyle = 'drag' | 'tap';

export type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'besttimes'
  | 'settings';

export type Settings = {
  mode: PlayMode;
  sound: boolean;
  reducedMotion: boolean;
  placement: PlacementStyle;
};

/** One country bound to one board region. */
export type Piece = {
  country: Country;
  region: Region;
};

export type Puzzle = {
  runId: string;
  continent: ContinentId;
  mode: PlayMode;
  pieces: Piece[];
  landmass: string;
};

export type RoundResult = {
  runId: string;
  continent: ContinentId;
  continentName: string;
  mode: PlayMode;
  elapsedMs: number;
  errors: number;
  hints: number;
  placed: number;
  total: number;
  assisted: boolean;
  completedAt: number;
};

export type RecordEntry = {
  runId: string;
  continent: ContinentId;
  elapsedMs: number;
  errors: number;
  completedAt: number;
};

export type Selection = {
  continent: ContinentId;
  mode: PlayMode;
};
