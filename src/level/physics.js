// Play-mode physics, kept free of DOM work so it can be reasoned about (and tested) on its own.

export const RUNNER_SIZE = 52;
export const RUN_SPEED = 520;
export const JUMP_VELOCITY = 880;
export const GRAVITY = 2700;
export const STOMP_BOUNCE = 640;
export const BUG_RANGE = 70;

const isSolid = (part) => part.kind === 'block' || part.kind === 'bonus';
const overlapsX = (x, part, inset = 0) => x + RUNNER_SIZE > part.start + inset && x < part.end - inset;

/** Where a bug is at `time` (ms): it paces back and forth around its spawn point. */
export const bugOffset = (bug, time) => Math.sin(time / 650 + bug.phase) * BUG_RANGE;

/**
 * Advances `play` by `dt` seconds.
 * `input`: { dir: -1 | 0 | 1, jump: boolean }.
 * `state`: { usedBonus: Set, collected: Set, squashed: Set } — what has been taken this attempt.
 * Returns the events of this step: { dead, bonus: [], coins: [], stomped: [] }.
 */
export function stepPhysics(play, input, layout, state, dt, time) {
  const { parts, coins = [], bugs = [], worldWidth } = layout;
  const size = RUNNER_SIZE;
  const events = { dead: false, bonus: [], coins: [], stomped: [] };
  const prevY = play.y;

  // Horizontal movement, blocked by the sides of solid blocks.
  let x = play.x + input.dir * RUN_SPEED * dt;
  x = Math.min(Math.max(x, 0), worldWidth - size);
  for (const part of parts) {
    if (!isSolid(part) || play.y >= part.top - 1 || play.y + size <= part.base + 1) continue;
    if (overlapsX(x, part)) {
      x = input.dir > 0 ? part.start - size : input.dir < 0 ? part.end : x;
    }
  }
  play.x = x;

  // Jumping and gravity.
  if (input.jump && play.grounded) {
    play.vy = JUMP_VELOCITY;
    play.grounded = false;
  }
  play.vy -= GRAVITY * dt;
  play.y += play.vy * dt;

  // Bumping your head on a floating block; bonus blocks give a bit once.
  if (play.vy > 0) {
    for (const part of parts) {
      if (!isSolid(part) || part.base <= 0 || !overlapsX(play.x, part, 4)) continue;
      if (prevY + size <= part.base + 1 && play.y + size > part.base) {
        play.y = part.base - size;
        play.vy = 0;
        if (part.kind === 'bonus' && !state.usedBonus.has(part.id)) {
          state.usedBonus.add(part.id);
          events.bonus.push(part.id);
        }
      }
    }
  }

  // Landing on the ground or on top of a block.
  let floor = 0;
  for (const part of parts) {
    if (isSolid(part) && overlapsX(play.x, part, 2) && prevY >= part.top - 1) {
      floor = Math.max(floor, part.top);
    }
  }
  if (play.y <= floor) {
    play.y = floor;
    play.vy = 0;
    if (!play.grounded) play.rotation = Math.round(play.rotation / 90) * 90;
    play.grounded = true;
  } else {
    play.grounded = false;
    play.rotation += 400 * dt;
  }

  // Bits to collect.
  for (const coin of coins) {
    if (state.collected.has(coin.id)) continue;
    if (overlapsX(play.x, coin, 2) && play.y < coin.top && play.y + size > coin.base) {
      state.collected.add(coin.id);
      events.coins.push(coin.id);
    }
  }

  // Bugs: land on top to squash them, touch them anywhere else and it's over.
  for (const bug of bugs) {
    if (state.squashed.has(bug.id)) continue;
    const offset = bugOffset(bug, time);
    const box = { start: bug.start + offset, end: bug.end + offset };
    if (!overlapsX(play.x, box, 4) || play.y >= bug.top || play.y + size <= bug.base) continue;
    if (play.vy < 0 && prevY >= bug.top - 14) {
      state.squashed.add(bug.id);
      events.stomped.push(bug.id);
      play.vy = STOMP_BOUNCE;
      play.y = bug.top;
      play.grounded = false;
    } else {
      events.dead = true;
    }
  }

  // Spikes: a slightly forgiving hitbox on the inner part of the triangle.
  for (const part of parts) {
    if (part.kind !== 'spike') continue;
    const inset = (part.end - part.start) * 0.22;
    if (overlapsX(play.x, part, inset) && play.y < part.base + part.height * 0.75 && play.y + size > part.base + 4) {
      events.dead = true;
      break;
    }
  }

  return events;
}
