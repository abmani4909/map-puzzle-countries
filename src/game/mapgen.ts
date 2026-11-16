import { GRID_COLS, GRID_ROWS, MAP_UNITS } from '../constants/config';

/**
 * Deterministic board builder.
 *
 * The continent board is a shared lattice: every region is an eight-sided cell
 * whose corners AND edge midpoints are shared with its neighbours, so the
 * regions tile exactly - no gaps, no overlaps - while the outer boundary stays
 * ragged enough to read as a coastline. One seed per continent means the same
 * continent always produces the same board.
 */

export type Point = { x: number; y: number };

export type Region = {
  index: number;
  points: Point[];
  /** Drag anchor: the area centroid of the region, in map units. */
  anchor: Point;
  bbox: { x: number; y: number; w: number; h: number };
  /** Deterministic pastel fill index. */
  tint: number;
};

/** Small, stable hash -> [0, 1). */
function rand(seed: number, a: number, b: number, salt: number): number {
  let h = seed * 374761393 + a * 668265263 + b * 2246822519 + salt * 3266489917;
  h = (h ^ (h >>> 13)) >>> 0;
  h = (h * 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** [-1, 1) */
function jitter(seed: number, a: number, b: number, salt: number): number {
  return rand(seed, a, b, salt) * 2 - 1;
}

function centroidOf(points: Point[]): Point {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const q = points[(i + 1) % points.length];
    const cross = p.x * q.y - q.x * p.y;
    area += cross;
    cx += (p.x + q.x) * cross;
    cy += (p.y + q.y) * cross;
  }
  area *= 0.5;
  if (Math.abs(area) < 0.0001) {
    const mid = points.reduce(
      (acc, p) => ({ x: acc.x + p.x / points.length, y: acc.y + p.y / points.length }),
      { x: 0, y: 0 },
    );
    return mid;
  }
  return { x: cx / (6 * area), y: cy / (6 * area) };
}

function bboxOf(points: Point[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  points.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  });
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

const MARGIN = 12;

export function buildRegions(
  seed: number,
  cols: number = GRID_COLS,
  rows: number = GRID_ROWS,
): Region[] {
  const span = MAP_UNITS - MARGIN * 2;
  const cw = span / cols;
  const ch = span / rows;

  // 1. Lattice corners, jittered. Edge points stay on (or just outside) the rim
  //    so the landmass keeps a ragged but closed coastline.
  const corner: Point[][] = [];
  for (let r = 0; r <= rows; r++) {
    corner[r] = [];
    for (let c = 0; c <= cols; c++) {
      const onLeft = c === 0;
      const onRight = c === cols;
      const onTop = r === 0;
      const onBottom = r === rows;
      const edgeX = onLeft || onRight;
      const edgeY = onTop || onBottom;
      const ax = edgeX ? 0.16 : 0.3;
      const ay = edgeY ? 0.16 : 0.3;
      corner[r][c] = {
        x: MARGIN + c * cw + jitter(seed, r, c, 11) * cw * ax,
        y: MARGIN + r * ch + jitter(seed, r, c, 23) * ch * ay,
      };
    }
  }

  // 2. Shared midpoints, pushed off the straight edge so borders curve.
  const hMid: Point[][] = []; // between corner[r][c] and corner[r][c+1]
  for (let r = 0; r <= rows; r++) {
    hMid[r] = [];
    for (let c = 0; c < cols; c++) {
      const p = corner[r][c];
      const q = corner[r][c + 1];
      hMid[r][c] = {
        x: (p.x + q.x) / 2 + jitter(seed, r, c, 31) * cw * 0.12,
        y: (p.y + q.y) / 2 + jitter(seed, r, c, 37) * ch * 0.22,
      };
    }
  }
  const vMid: Point[][] = []; // between corner[r][c] and corner[r+1][c]
  for (let r = 0; r < rows; r++) {
    vMid[r] = [];
    for (let c = 0; c <= cols; c++) {
      const p = corner[r][c];
      const q = corner[r + 1][c];
      vMid[r][c] = {
        x: (p.x + q.x) / 2 + jitter(seed, r, c, 43) * cw * 0.22,
        y: (p.y + q.y) / 2 + jitter(seed, r, c, 47) * ch * 0.12,
      };
    }
  }

  const regions: Region[] = [];
  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const points: Point[] = [
        corner[r][c],
        hMid[r][c],
        corner[r][c + 1],
        vMid[r][c + 1],
        corner[r + 1][c + 1],
        hMid[r + 1][c],
        corner[r + 1][c],
        vMid[r][c],
      ];
      regions.push({
        index,
        points,
        anchor: centroidOf(points),
        bbox: bboxOf(points),
        tint: index % 4,
      });
      index++;
    }
  }
  return regions;
}

export function toPath(points: Point[]): string {
  if (points.length === 0) return '';
  let d = 'M' + points[0].x.toFixed(2) + ' ' + points[0].y.toFixed(2);
  for (let i = 1; i < points.length; i++) {
    d += ' L' + points[i].x.toFixed(2) + ' ' + points[i].y.toFixed(2);
  }
  return d + ' Z';
}

/** Outer silhouette of the whole board - used as the landmass backdrop. */
export function landmassPath(regions: Region[], cols: number, rows: number): string {
  if (regions.length === 0) return '';
  const at = (r: number, c: number) => regions[r * cols + c];
  const ring: Point[] = [];
  // top edge, left to right
  for (let c = 0; c < cols; c++) {
    const p = at(0, c).points;
    ring.push(p[0], p[1]);
  }
  ring.push(at(0, cols - 1).points[2]);
  // right edge, top to bottom
  for (let r = 0; r < rows; r++) {
    const p = at(r, cols - 1).points;
    ring.push(p[3], p[4]);
  }
  // bottom edge, right to left
  for (let c = cols - 1; c >= 0; c--) {
    const p = at(rows - 1, c).points;
    ring.push(p[5], p[6]);
  }
  // left edge, bottom to top
  for (let r = rows - 1; r >= 0; r--) {
    const p = at(r, 0).points;
    ring.push(p[7], p[0]);
  }
  return toPath(ring);
}

export function pointInPolygon(x: number, y: number, points: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.000001) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
