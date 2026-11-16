import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const SCREEN_WIDTH = SCREEN_W;
export const SCREEN_HEIGHT = SCREEN_H;

/** Compact phones (320x640-class) get a tighter menu + dock. */
export const IS_COMPACT = SCREEN_H < 720;

/** Splash duration. Must stay at 8000 - shorter races the screenshot window. */
export const LOADER_DURATION_MS = 8000;

/** Safe inset reserved above every screen's content. */
export const TOP_INSET = 44;
export const BOTTOM_INSET = 16;

/** Board geometry - parent padding + border are subtracted before fitting. */
export const BOARD_PAD = 6;
export const BOARD_BORDER = 1;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 7
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_MAX_H = 440;

/** Unit coordinate space every generated map region lives in. */
export const MAP_UNITS = 100;

/** Pieces placed in one round (keeps every target well above 48 dp). */
export const PIECES_PER_ROUND = 12;
export const GRID_COLS = 3;
export const GRID_ROWS = 4;

/** Placement tolerances, in screen dp. */
export const SNAP_TOLERANCE_DP = 28;
export const DRAG_THRESHOLD_DP = 6;

/** Timings. */
export const HINT_DURATION_MS = 3000;
export const RETURN_DURATION_MS = 220;
export const SNAP_DURATION_MS = 200;
export const SETTLE_DURATION_MS = 160;
export const TOAST_DURATION_MS = 1400;
export const CLOCK_TICK_MS = 100;

/** Local records kept per continent. */
export const MAX_RECORDS_PER_CONTINENT = 5;

/** Dock sizing. */
export const DOCK_CONTENT_H = IS_COMPACT ? 176 : 200;
export const TRAY_H = IS_COMPACT ? 64 : 88;

export const DATA_REVISION = '2026.11-r1';
