// Play-mode physics, kept free of DOM work so it can be reasoned about (and tested) on its own.
// Platformer rules: run with momentum, hold jump to go higher, bump blocks from below,
// stomp bugs, grab a power chip to survive one hit, and don't fall in a pit.

export const RUNNER_SIZE = 52;
export const RUN_SPEED = 520;
export const GROUND_ACCEL = 3200;
export const AIR_ACCEL = 2200;
export const JUMP_VELOCITY = 880;
export const JUMP_CUT = 0.5;
export const GRAVITY = 2700;
export const STOMP_BOUNCE = 640;
export const BUG_RANGE = 70;
export const PIT_DEPTH = 140;
export const HURT_TIME = 1400;

const overlapsX = (x, part, inset = 0) => x + RUNNER_SIZE > part.start + inset && x < part.end - inset;

/** Where a bug is at `time` (ms): it paces back and forth around its spawn point. */
export const bugOffset = (bug, time) => Math.sin(time / 650 + bug.phase) * BUG_RANGE;

export const newTaken = () => ({
  usedBonus: new Set(),
  collected: new Set(),
  squashed: new Set(),
  broken: new Set(),
});

/**
 * Advances `play` by `dt` seconds.
 * `play`: { x, y, vx, vy, rotation, grounded, powered, hurtUntil, jumpHeld, finished }.
 * `input`: { dir: -1 | 0 | 1, jump: boolean } — `jump` is whether the key is held.
 * `state`: what has been taken this attempt (see newTaken).
 * Returns the events of this step.
 */
export function stepPhysics(play, input, layout, state, dt, time) {
  const { parts, coins = [], bugs = [], pits = [], flag = null, worldWidth } = layout;
  const size = RUNNER_SIZE;
  const events = { dead: false, hurt: false, power: false, bonus: [], coins: [], stomped: [], broken: [], finish: null };
  const isSolid = (part) =>
    (part.kind === 'block' || part.kind === 'bonus' || part.kind === 'brick' || part.kind === 'wall') &&
    !state.broken.has(part.id);
  const prevY = play.y;
  const invulnerable = (play.hurtUntil || 0) > time;

  // Running with a bit of momentum: speed up and slow down instead of snapping.
  const vx = play.vx || 0;
  const targetVx = input.dir * RUN_SPEED;
  const accel = (play.grounded ? GROUND_ACCEL : AIR_ACCEL) * dt;
  play.vx = vx < targetVx ? Math.min(vx + accel, targetVx) : Math.max(vx - accel, targetVx);

  // Horizontal movement, blocked by the sides of solid blocks (and the walls of pits).
  let x = play.x + play.vx * dt;
  x = Math.min(Math.max(x, 0), worldWidth - size);
  for (const part of parts) {
    if (!isSolid(part) || play.y >= part.top - 1 || play.y + size <= part.base + 1) continue;
    if (overlapsX(x, part)) {
      const fromLeft = play.x + size / 2 < (part.start + part.end) / 2;
      x = fromLeft ? part.start - size : part.end;
      play.vx = 0;
    }
  }
  play.x = x;

  // Jumping and gravity. Letting go of jump early cuts the jump short.
  if (input.jump && !play.jumpHeld && play.grounded) {
    play.vy = JUMP_VELOCITY;
    play.grounded = false;
    play.jumpCut = false;
  }
  if (!input.jump && play.vy > 0 && !play.jumpCut) {
    play.vy *= JUMP_CUT;
    play.jumpCut = true;
  }
  play.jumpHeld = input.jump;
  play.vy -= GRAVITY * dt;
  play.y += play.vy * dt;

  // Bumping your head on a floating block. Bonus blocks give a bit (or a power chip) once;
  // bricks break when you are powered up.
  if (play.vy > 0) {
    for (const part of parts) {
      if (!isSolid(part) || part.base <= 0 || !overlapsX(play.x, part, 4)) continue;
      if (prevY + size <= part.base + 1 && play.y + size > part.base) {
        play.y = part.base - size;
        play.vy = 0;
        play.jumpCut = true;
        if (part.kind === 'bonus' && !state.usedBonus.has(part.id)) {
          state.usedBonus.add(part.id);
          events.bonus.push(part.id);
          if (part.power) {
            play.powered = true;
            events.power = true;
          }
        } else if (part.kind === 'brick' && play.powered) {
          state.broken.add(part.id);
          events.broken.push(part.id);
        }
      }
    }
  }

  // Landing on the ground or on top of a block. Over a pit there is no ground.
  const overPit = pits.some((pit) => play.x >= pit.start && play.x + size <= pit.end);
  let floor = overPit ? -Infinity : 0;
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
  if (play.y < -PIT_DEPTH) {
    events.dead = true;
    return events;
  }

  // Getting hit: a power chip absorbs one hit, then you blink for a moment.
  const hit = () => {
    if (invulnerable || events.hurt) return;
    if (play.powered) {
      play.powered = false;
      play.hurtUntil = time + HURT_TIME;
      events.hurt = true;
    } else {
      events.dead = true;
    }
  };

  // Bits to collect.
  for (const coin of coins) {
    if (state.collected.has(coin.id)) continue;
    if (overlapsX(play.x, coin, 2) && play.y < coin.top && play.y + size > coin.base) {
      state.collected.add(coin.id);
      events.coins.push(coin.id);
    }
  }

  // Bugs: land on top to squash them, touch them anywhere else and you are hit.
  for (const bug of bugs) {
    if (state.squashed.has(bug.id)) continue;
    const offset = bugOffset(bug, time);
    const box = { start: bug.start + offset, end: bug.end + offset };
    if (!overlapsX(play.x, box, 4) || play.y >= bug.top || play.y + size <= bug.base) continue;
    if (play.vy < 0 && prevY >= bug.top - 14) {
      state.squashed.add(bug.id);
      events.stomped.push(bug.id);
      // Hold jump while stomping to bounce higher.
      play.vy = input.jump ? STOMP_BOUNCE * 1.3 : STOMP_BOUNCE;
      play.jumpCut = !input.jump;
      play.y = bug.top;
      play.grounded = false;
    } else {
      hit();
    }
  }

  // Spikes: a slightly forgiving hitbox on the inner part of the triangle.
  for (const part of parts) {
    if (part.kind !== 'spike') continue;
    const inset = (part.end - part.start) * 0.22;
    if (overlapsX(play.x, part, inset) && play.y < part.base + part.height * 0.75 && play.y + size > part.base + 4) {
      hit();
      break;
    }
  }

  // The flagpole at the end: the higher you grab it, the more it is worth.
  if (flag && !play.finished && play.x + size >= flag.start) {
    play.finished = true;
    events.finish = { height: Math.max(0, Math.min(1, play.y / flag.height)) };
  }

  return events;
}
