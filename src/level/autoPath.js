// The path the runner follows while you scroll (not in play mode): it walks over the terrain,
// steps down off ledges and jumps up hills, over pits and over bugs.

import { BUG_RANGE, RUNNER_SIZE } from './physics';

export const PATH_STEP = 4;
const CLEARANCE = 10;
const MIN_ARC = 50;
const MAX_ARC = 420;
const TAKE_OFF = 18; // samples (72px) before an obstacle
const LANDING_RUN = 12; // samples of flat ground needed to land on
const FALL_PER_STEP = 14;

/** Solid parts you can stand on: anything resting on the ground (or on such a part), plus mushroom caps. */
function floorParts(parts) {
  const solid = parts
    .filter((part) => part.kind === 'block' && part.element)
    .sort((a, b) => a.base - b.base);
  const floors = [];
  for (const part of solid) {
    const resting =
      part.base <= 1 ||
      part.element.classList.contains('ob-mushroom') ||
      floors.some(
        (below) => Math.abs(below.top - part.base) < 3 && below.start < part.end - 2 && part.start < below.end - 2,
      );
    if (resting) floors.push(part);
  }
  return floors;
}

/**
 * Returns { y, air }: for every PATH_STEP pixels of runner position (its left edge),
 * the height to draw the runner at and whether it is in the air.
 */
export function buildAutoPath({ parts = [], pits = [], bugs = [], worldWidth = 0 }) {
  const count = Math.ceil(worldWidth / PATH_STEP) + 1;
  const floors = floorParts(parts);
  const surface = new Float32Array(count);
  const needAir = new Float32Array(count); // height that must be cleared in the air, or 0

  for (let i = 0; i < count; i += 1) {
    const x = i * PATH_STEP;
    const center = x + RUNNER_SIZE / 2;
    let height = pits.some((pit) => center >= pit.start && center <= pit.end) ? -Infinity : 0;
    for (const part of floors) {
      if (x + RUNNER_SIZE - 6 > part.start && x + 6 < part.end) height = Math.max(height, part.top);
    }
    surface[i] = height;
    for (const bug of bugs) {
      if (x + RUNNER_SIZE > bug.start - BUG_RANGE - 8 && x < bug.end + BUG_RANGE + 8) {
        needAir[i] = Math.max(needAir[i], bug.top + 12);
      }
    }
  }

  const y = new Float32Array(count);
  const air = new Uint8Array(count);
  const blocked = (k, level) =>
    !Number.isFinite(surface[k]) || surface[k] > level + 1 || needAir[k] > 0;

  let i = 0;
  let lastLanding = 0;
  let level = Number.isFinite(surface[0]) ? surface[0] : 0;
  y[0] = level;

  while (i < count - 1) {
    const next = i + 1;
    if (!blocked(next, level)) {
      // Walk on, or drop down a ledge with a quick fall.
      if (surface[next] < level - 1) {
        level = Math.max(surface[next], level - FALL_PER_STEP);
        air[next] = level > surface[next] + 1 ? 1 : 0;
      } else {
        level = surface[next];
      }
      y[next] = level;
      i = next;
      continue;
    }

    // Something in the way: find where to land, then jump in an arc that clears everything between.
    let land = -1;
    for (let j = next + 1; j < count - LANDING_RUN; j += 1) {
      let flat = true;
      for (let k = j; k < j + LANDING_RUN; k += 1) {
        if (!Number.isFinite(surface[k]) || Math.abs(surface[k] - surface[j]) > 1 || needAir[k] > 0) {
          flat = false;
          break;
        }
      }
      if (flat) {
        land = j;
        break;
      }
    }
    if (land < 0) {
      for (let k = next; k < count; k += 1) y[k] = level;
      break;
    }

    const start = Math.max(i - TAKE_OFF, lastLanding);
    const y0 = y[start];
    const y1 = surface[land];
    let arc = MIN_ARC;
    for (let k = start + 1; k < land; k += 1) {
      const t = (k - start) / (land - start);
      if (t < 0.04 || t > 0.96) continue;
      const need = Math.max(Number.isFinite(surface[k]) ? surface[k] : 0, needAir[k]) + CLEARANCE;
      const line = y0 + (y1 - y0) * t;
      arc = Math.max(arc, (need - line) / (4 * t * (1 - t)));
    }
    arc = Math.min(arc, MAX_ARC);
    for (let k = start; k <= land; k += 1) {
      const t = (k - start) / (land - start);
      y[k] = y0 + (y1 - y0) * t + 4 * arc * t * (1 - t);
      air[k] = k > start && k < land ? 1 : 0;
    }
    level = y1;
    lastLanding = land;
    i = land;
  }

  return { y, air };
}

/** Height and airborne state at a runner position, interpolated between samples. */
export function sampleAutoPath(path, x) {
  if (!path || !path.y.length) return { y: 0, air: false };
  const f = Math.min(Math.max(x / PATH_STEP, 0), path.y.length - 1);
  const k = Math.floor(f);
  const t = f - k;
  const a = path.y[k];
  const b = path.y[Math.min(k + 1, path.y.length - 1)];
  return { y: a + (b - a) * t, air: Boolean(path.air[k]) };
}
