import { SNAP_TOLERANCE_DP } from '../constants/config';
import { pointInPolygon } from './mapgen';
import type { Region } from './mapgen';

export type BoardFrame = {
  /** Page coordinates of the SVG content box. */
  pageX: number;
  pageY: number;
  width: number;
  height: number;
  /** Map-unit -> dp scale on each axis. */
  scaleX: number;
  scaleY: number;
};

export type DropOutcome = 'correct' | 'miss' | 'outside';

export function unitToScreen(frame: BoardFrame, ux: number, uy: number) {
  return { x: frame.pageX + ux * frame.scaleX, y: frame.pageY + uy * frame.scaleY };
}

export function screenToUnit(frame: BoardFrame, px: number, py: number) {
  return {
    x: (px - frame.pageX) / frame.scaleX,
    y: (py - frame.pageY) / frame.scaleY,
  };
}

export function isInsideBoard(frame: BoardFrame, px: number, py: number): boolean {
  return (
    px >= frame.pageX &&
    px <= frame.pageX + frame.width &&
    py >= frame.pageY &&
    py <= frame.pageY + frame.height
  );
}

/**
 * A drop is correct when the dragged piece's anchor lands inside the target
 * region, or within the snap tolerance of that region's canonical anchor.
 * Nothing else is ever accepted.
 */
export function evaluateDrop(
  frame: BoardFrame,
  region: Region,
  px: number,
  py: number,
): DropOutcome {
  if (!isInsideBoard(frame, px, py)) return 'outside';
  const unit = screenToUnit(frame, px, py);
  if (pointInPolygon(unit.x, unit.y, region.points)) return 'correct';
  const anchor = unitToScreen(frame, region.anchor.x, region.anchor.y);
  const dx = anchor.x - px;
  const dy = anchor.y - py;
  if (Math.sqrt(dx * dx + dy * dy) <= SNAP_TOLERANCE_DP) return 'correct';
  return 'miss';
}
