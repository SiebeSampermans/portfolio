import { useCallback, useEffect, useRef, useState } from 'react';
import { buildAutoPath, sampleAutoPath } from './autoPath';
import { sfx } from './audio';
import { bugOffset, HURT_TIME, newTaken, RUNNER_SIZE, stepPhysics } from './physics';

// Below this width, on short screens, or when the visitor asks for less motion,
// the level is laid out vertically and the runner stays still.
const VERTICAL_QUERY = '(max-width: 820px), (max-height: 560px), (prefers-reduced-motion: reduce)';

// Where the runner sits on screen, as a share of the viewport width.
const RUNNER_SCREEN_X = 0.2;

// Flowers, grass tufts, rocks and bits of fence along the ground. Seeded, so they stay put between
// visits, and kept away from pits and from anything standing on the ground.
const DECOR = ['flower', 'flower-b', 'flower-c', 'tuft', 'tuft', 'tuft-b', 'rock', 'fence', 'tuft', 'flower'];
const DECOR_WIDTH = { fence: 96, rock: 34 };
function placeGroundDecor(world, worldWidth, pits, parts) {
  let layer = world.querySelector(':scope > .ground-decor');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'ground-decor';
    layer.setAttribute('aria-hidden', 'true');
    world.prepend(layer);
  }
  const grounded = parts.filter((part) => part.kind !== 'wall' && part.base <= 1);
  const blocked = (start, end) =>
    pits.some((pit) => end > pit.start - 70 && start < pit.end + 70) ||
    grounded.some((part) => end > part.start - 8 && start < part.end + 8);
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const fragment = document.createDocumentFragment();
  for (let x = 120; x < worldWidth - 200; x += 70 + random() * 190) {
    const kind = DECOR[Math.floor(random() * DECOR.length)];
    const width = DECOR_WIDTH[kind] || 22;
    if (blocked(x, x + width)) continue;
    const item = document.createElement('i');
    item.className = `decor decor-${kind}`;
    item.style.left = `${Math.round(x)}px`;
    if (kind.startsWith('flower')) item.style.animationDelay = `${(-random() * 3).toFixed(2)}s`;
    fragment.append(item);
  }
  layer.replaceChildren(fragment);
}

export const SECTION_IDS = ['home', 'about', 'projects', 'cv', 'contact'];

const EMPTY_PLAY = { isPlaying: false, attempts: 1, isDead: false, bits: 0, bugs: 0, score: 0, isPowered: false, finish: null };
const SCORE = { bit: 100, bug: 200, brick: 50, flag: 5000 };
const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

function useIsVertical() {
  const [isVertical, setIsVertical] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(VERTICAL_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(VERTICAL_QUERY);
    const sync = () => setIsVertical(query.matches);
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return isVertical;
}

/**
 * Turns vertical page scroll into a side-scrolling level.
 * The world moves left 1px for every 1px scrolled, so a section's scroll position equals
 * its horizontal offset. The runner jumps over every `.obstacle` it reaches.
 */
function useLevelEngine({ onSectionChange }) {
  const isVertical = useIsVertical();
  const trackRef = useRef(null);
  const worldRef = useRef(null);
  const parallaxRef = useRef(null);
  const runnerRef = useRef(null);
  const trailRef = useRef(null);
  const trailHistoryRef = useRef([]);
  const trailFadeRef = useRef(0);
  const trailFadedRef = useRef(false);
  const progressRef = useRef(null);
  const percentRef = useRef(null);
  const timerRef = useRef(null);
  const lastScrollRef = useRef(0);
  const idleTimerRef = useRef(0);
  const layoutRef = useRef({ obstacles: [], sections: [], maxScroll: 1, portals: [] });
  const activeSectionRef = useRef(null);
  const playRef = useRef(null);
  const [playState, setPlayState] = useState(EMPTY_PLAY);
  const onSectionChangeRef = useRef(onSectionChange);
  onSectionChangeRef.current = onSectionChange;

  const measure = useCallback(() => {
    const world = worldRef.current;
    const track = trackRef.current;

    if (!world || !track) {
      return;
    }

    const worldRect = world.getBoundingClientRect();
    const relative = (element) => {
      const rect = element.getBoundingClientRect();
      return isVertical
        ? { start: rect.top - worldRect.top, end: rect.bottom - worldRect.top }
        : { start: rect.left - worldRect.left, end: rect.right - worldRect.left, height: rect.height };
    };

    const sections = SECTION_IDS.map((id) => {
      const element = world.querySelector(`[data-section="${id}"]`);
      return { id, ...(element ? relative(element) : { start: 0, end: 0 }) };
    });

    if (isVertical) {
      world.querySelector(':scope > .ground-decor')?.remove();
      track.style.height = '';
      layoutRef.current = {
        obstacles: [],
        portals: [],
        sections,
        maxScroll: Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
      };
      return;
    }

    const worldWidth = world.scrollWidth;
    const maxScroll = Math.max(worldWidth - window.innerWidth, 1);
    track.style.height = `${maxScroll + window.innerHeight}px`;

    const obstacles = Array.from(world.querySelectorAll('.obstacle')).map((element) => {
      const box = relative(element);
      return { start: box.start, end: box.end, height: box.height };
    });
    obstacles.sort((a, b) => a.start - b.start);

    const portals = Array.from(world.querySelectorAll('.portal')).map((element) => ({
      element,
      ...relative(element),
    }));

    // Individual spikes and blocks, for play mode collisions.
    const measureThing = (element, index) => {
      const box = relative(element);
      const groundLine = element.closest('.obstacle').getBoundingClientRect().bottom;
      const base = groundLine - element.getBoundingClientRect().bottom;
      return { id: index, element, start: box.start, end: box.end, base, top: base + box.height, height: box.height };
    };
    const kindOf = (element) => {
      const list = element.classList;
      if (list.contains('ob-spike')) return 'spike';
      if (list.contains('ob-bonus')) return 'bonus';
      if (list.contains('ob-brick')) return 'brick';
      if (list.contains('ob-pit')) return 'pit';
      return 'block';
    };
    const measured = Array.from(world.querySelectorAll('.obstacle i')).map((element) => ({
      ...measureThing(element, 0),
      kind: kindOf(element),
      power: element.classList.contains('ob-power'),
    }));
    const pits = measured.filter((part) => part.kind === 'pit').map(({ start, end }) => ({ start, end }));
    // The ground on either side of a pit acts as a wall once you have dropped below it.
    const walls = pits.flatMap((pit) => [
      { kind: 'wall', start: pit.start - 60, end: pit.start, base: -1000, top: 0, height: 1000 },
      { kind: 'wall', start: pit.end, end: pit.end + 60, base: -1000, top: 0, height: 1000 },
    ]);
    const parts = [...measured.filter((part) => part.kind !== 'pit'), ...walls].map((part, index) => ({
      ...part,
      id: index,
    }));
    // Checkpoint flags: in play mode you have to run past every one of them for your time to count.
    const checkpoints = Array.from(world.querySelectorAll('.checkpoint')).map((element) => {
      const pole = element.querySelector('.checkpoint-flag');
      return { id: element.dataset.section, element, x: relative(pole || element).start };
    });
    const flagElement = world.querySelector('.flagpole');
    const flag = flagElement ? { element: flagElement, ...relative(flagElement) } : null;
    const coins = Array.from(world.querySelectorAll('.obstacle .coin')).map(measureThing);
    // Bugs are measured from their spawn point, without the patrol offset.
    const bugs = Array.from(world.querySelectorAll('.obstacle .bug')).map((element, index) => {
      // Measure the bug's column: the bug itself may be mid-animation.
      const spawn = measureThing(element.parentElement, index);
      return { ...spawn, element, top: spawn.base + element.offsetHeight, phase: index * 1.7 };
    });

    layoutRef.current = { obstacles, sections, maxScroll, portals, parts, coins, bugs, pits, flag, checkpoints, worldWidth };
    placeGroundDecor(world, worldWidth, pits, parts);
    layoutRef.current.autoPath = buildAutoPath(layoutRef.current);
  }, [isVertical]);

  const render = useCallback(() => {
    const { obstacles, sections, maxScroll, portals } = layoutRef.current;
    const scroll = Math.min(Math.max(window.scrollY, 0), maxScroll);
    const progress = scroll / maxScroll;

    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${progress})`;
      progressRef.current.parentElement?.style.setProperty('--p', progress.toFixed(4));
    }

    if (percentRef.current) {
      percentRef.current.textContent = `${Math.round(progress * 100)}%`;
    }

    let probe;

    if (isVertical) {
      probe = scroll + window.innerHeight * 0.35;
    } else {
      const play = playRef.current;
      const runnerX = play
        ? play.x + RUNNER_SIZE / 2
        : scroll + window.innerWidth * RUNNER_SCREEN_X + RUNNER_SIZE / 2;
      probe = runnerX;

      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(${-scroll}px, 0, 0)`;
      }

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${-scroll * 0.3}px, 0, 0)`;
      }

      const anchorX = scroll + window.innerWidth * RUNNER_SCREEN_X;

      // Flags go up once the runner is past them. In play mode only the ones you actually ran past this attempt.
      (layoutRef.current.checkpoints || []).forEach((checkpoint) => {
        const raised = play ? play.checkpoints?.has(checkpoint.id) : anchorX + RUNNER_SIZE >= checkpoint.x;
        if (checkpoint.element.classList.contains('is-raised') !== Boolean(raised)) {
          checkpoint.element.classList.toggle('is-raised', Boolean(raised));
        }
      });

      const drawTrail = (worldX, height) => {
        const trail = trailRef.current;
        if (!trail) return;
        const history = trailHistoryRef.current;
        const lastPoint = history[history.length - 1];
        const moved = !lastPoint || Math.hypot(worldX - lastPoint.x, height - lastPoint.y) > 5;
        if (moved) {
          history.push({ x: worldX, y: height });
          if (history.length > 80) history.shift();
        }
        if (!moved && trailFadedRef.current) return;
        trailFadedRef.current = false;
        const bits = trail.children;
        // Walk back along the recorded path and drop a bit every `spacing` pixels,
        // so the trail looks the same whether you scroll fast or slow.
        const spacing = 14;
        let bitIndex = 0;
        let walked = 0;
        let target = spacing;
        for (let k = history.length - 1; k > 0 && bitIndex < bits.length; k -= 1) {
          const a = history[k];
          const b = history[k - 1];
          const length = Math.hypot(a.x - b.x, a.y - b.y);
          while (bitIndex < bits.length && walked + length >= target) {
            const t = length ? (target - walked) / length : 0;
            const x = a.x + (b.x - a.x) * t;
            const y = a.y + (b.y - a.y) * t;
            const bit = bits[bitIndex];
            bit.style.opacity = String(1 - bitIndex / bits.length);
            bit.style.transform = `translate3d(${x - anchorX}px, ${-y}px, 0)`;
            bitIndex += 1;
            target += spacing;
          }
          walked += length;
        }
        for (; bitIndex < bits.length; bitIndex += 1) {
          bits[bitIndex].style.opacity = '0';
        }
        // Once the block stops moving, let the trail catch up and fade away.
        if (!moved) return;
        window.clearTimeout(trailFadeRef.current);
        trailFadeRef.current = window.setTimeout(() => {
          trailHistoryRef.current = trailHistoryRef.current.slice(-1);
          trailFadedRef.current = true;
          Array.from(bits).forEach((bit) => {
            bit.style.opacity = '0';
          });
        }, 220);
      };

      const runner = runnerRef.current;
      const isSprite = runner?.classList.contains('is-sprite');

      if (play && runner) {
        const offsetX = play.x - scroll - window.innerWidth * RUNNER_SCREEN_X;
        if (isSprite) {
          // The pixel hero doesn't spin: it faces where it runs and picks a pose.
          if (play.vx > 20) play.facing = 1;
          if (play.vx < -20) play.facing = -1;
          const pose = !play.grounded
            ? 'jump'
            : Math.abs(play.vx) > 30
              ? Math.floor(play.x / 26) % 2
                ? 'run-a'
                : 'run-b'
              : 'idle';
          runner.dataset.pose = pose;
          runner.style.transform = `translate3d(${offsetX}px, ${-play.y}px, 0) scaleX(${play.facing || 1})`;
        } else {
          runner.style.transform = `translate3d(${offsetX}px, ${-play.y}px, 0) rotate(${play.rotation}deg)`;
        }
        runnerRef.current.classList.toggle('is-airborne', !play.grounded);
        runnerRef.current.classList.toggle('is-powered', Boolean(play.powered));
        runnerRef.current.classList.toggle('is-hurt', (play.hurtUntil || 0) > performance.now());
        drawTrail(play.x, play.y);
      }

      // Each obstacle gets one jump: it takes off a little before and lands a little after.
      let lift = 0;
      let rotation = 0;
      let completedJumps = 0;

      for (const obstacle of obstacles) {
        const takeOff = obstacle.start - 70;
        const landing = obstacle.end + 70;

        if (runnerX >= landing) {
          completedJumps += 1;
        } else if (runnerX > takeOff) {
          const t = (runnerX - takeOff) / (landing - takeOff);
          const height = Math.max(obstacle.height + 46, 110);
          lift = height * 4 * t * (1 - t);
          rotation = t * 180;
          break;
        } else {
          break;
        }
      }

      if (!play && runner && isSprite) {
        // The hero follows the terrain: walks up hills, drops off ledges, jumps pits and bugs.
        const spot = sampleAutoPath(layoutRef.current.autoPath, anchorX);
        lift = spot.y;
        if (spot.air) lift = Math.max(lift, 0.01);
        runner.dataset.air = spot.air ? '1' : '';
      }

      if (!play && runner) {
        if (isSprite) {
          runner.style.transform = `translate3d(0, ${-lift}px, 0)`;
          const moved = Math.abs(scroll - lastScrollRef.current) > 0.5;
          lastScrollRef.current = scroll;
          if (runner.dataset.air) {
            runner.dataset.pose = 'jump';
          } else if (moved) {
            runner.dataset.pose = Math.floor(scroll / 26) % 2 ? 'run-a' : 'run-b';
          }
          // Stand still once the scrolling stops.
          window.clearTimeout(idleTimerRef.current);
          idleTimerRef.current = window.setTimeout(() => {
            if (!playRef.current && runnerRef.current) runnerRef.current.dataset.pose = 'idle';
          }, 160);
        } else {
          runner.style.transform = `translate3d(0, ${-lift}px, 0) rotate(${completedJumps * 180 + rotation}deg)`;
        }
        runner.classList.toggle('is-airborne', isSprite ? Boolean(runner.dataset.air) : lift > 2);
        drawTrail(anchorX, lift);
      }

      // Running past the flagpole without playing still pulls the flag down.
      const { flag } = layoutRef.current;
      if (flag && !play) {
        flag.element.classList.toggle('is-grabbed', runnerX > flag.start);
      }

      portals.forEach((portal) => {
        portal.element.classList.toggle(
          'is-active',
          runnerX > portal.start - 40 && runnerX < portal.end + 40,
        );
      });
    }

    let active = sections[0]?.id;
    sections.forEach((section) => {
      if (probe >= section.start - 1) {
        active = section.id;
      }
    });

    if (progress > 0.995) {
      active = sections[sections.length - 1]?.id;
    }

    if (active && active !== activeSectionRef.current) {
      activeSectionRef.current = active;
      onSectionChangeRef.current?.(active);
    }
  }, [isVertical]);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          render();
        });
      }
    };
    const remeasure = () => {
      measure();
      render();
    };

    remeasure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure);

    const resizeObserver = new ResizeObserver(remeasure);
    if (worldRef.current) {
      resizeObserver.observe(worldRef.current);
    }
    document.fonts?.ready.then(remeasure);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
      resizeObserver.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      if (worldRef.current) {
        worldRef.current.style.transform = '';
      }
    };
  }, [measure, render]);

  // Play mode: arrows, WASD or ZQSD steer the block. Spikes kill and send you back to the start.
  // Scrolling (wheel or touch) hands control back to the automatic runner.
  useEffect(() => {
    if (isVertical) {
      playRef.current = null;
      setPlayState((current) => ({ ...current, isPlaying: false }));
      return undefined;
    }

    const keys = { left: false, right: false, jump: false };
    let frame = 0;
    let last = 0;

    const startX = () => window.innerWidth * RUNNER_SCREEN_X;
    const freshRunner = (x) => ({
      x, y: 0, vx: 0, vy: 0, rotation: 0, grounded: true, dead: false,
      powered: false, hurtUntil: 0, jumpHeld: false, jumpCut: true, finished: false, finishedAt: 0, facing: 1,
    });
    const scoreOf = (taken, flagBonus = 0) =>
      (taken.usedBonus.size + taken.collected.size) * SCORE.bit +
      taken.squashed.size * SCORE.bug +
      taken.broken.size * SCORE.brick +
      flagBonus;

    const keyAction = (key) => {
      const k = key.toLowerCase();
      if (k === 'arrowleft' || k === 'a' || k === 'q') return 'left';
      if (k === 'arrowright' || k === 'd') return 'right';
      if (k === 'arrowup' || k === 'w' || k === 'z' || k === ' ') return 'jump';
      return null;
    };

    const ignoreTarget = (target, action) => {
      if (document.documentElement.classList.contains('has-modal')) return true;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return true;
      // Space on a focused button or link should still press it.
      if (target?.closest?.('.clear-card')) return true;
      return action === 'jump' && (tag === 'BUTTON' || tag === 'A') && !playRef.current;
    };

    // Everything taken during an attempt comes back when you start over.
    const resetTaken = (play) => {
      play.taken = newTaken();
      // Spawning right at a flag (like the start flag) counts as passing it; flags further back don't.
      play.checkpoints = new Set(
        (layoutRef.current.checkpoints || [])
          .filter((checkpoint) => checkpoint.x <= play.x + RUNNER_SIZE && checkpoint.x >= play.x - 80)
          .map((checkpoint) => checkpoint.id),
      );
      play.startedAt = performance.now();
      worldRef.current
        ?.querySelectorAll('.is-used, .is-collected, .is-squashed, .is-broken, .is-grabbed')
        .forEach((element) => element.classList.remove('is-used', 'is-collected', 'is-squashed', 'is-broken', 'is-grabbed'));
    };

    const respawn = () => {
      const play = playRef.current;
      if (!play) return;
      Object.assign(play, freshRunner(startX()));
      resetTaken(play);
      window.scrollTo({ top: 0, behavior: 'auto' });
      setPlayState((current) => ({ ...current, isDead: false, bits: 0, bugs: 0, score: 0, isPowered: false, finish: null }));
      render();
    };

    const die = () => {
      const play = playRef.current;
      if (!play || play.dead) return;
      play.dead = true;
      sfx('die');
      runnerRef.current?.classList.add('is-dead');
      setPlayState((current) => ({ ...current, isDead: true, attempts: current.attempts + 1 }));
      window.setTimeout(() => {
        runnerRef.current?.classList.remove('is-dead');
        respawn();
      }, 700);
    };

    // Short-lived effects drawn in world coordinates: a dust puff on landing, "+100" when you score.
    const fxLayer = () => {
      const world = worldRef.current;
      if (!world) return null;
      let layer = world.querySelector(':scope > .fx-layer');
      if (!layer) {
        layer = document.createElement('div');
        layer.className = 'fx-layer';
        layer.setAttribute('aria-hidden', 'true');
        world.append(layer);
      }
      return layer;
    };
    const spawn = (className, x, y, text = '') => {
      const layer = fxLayer();
      if (!layer) return;
      const element = document.createElement('span');
      element.className = className;
      element.textContent = text;
      element.style.left = `${Math.round(x)}px`;
      element.style.setProperty('--y', `${Math.round(y)}px`);
      element.addEventListener('animationend', () => element.remove(), { once: true });
      window.setTimeout(() => element.remove(), 1500);
      layer.append(element);
    };
    const puff = (x, y) => spawn('fx-dust', x, y);
    const popup = (item, points, fromBelow = false, shift = 0) => {
      if (!item) return;
      const x = (item.start + item.end) / 2 + shift;
      const y = fromBelow ? (item.top ?? 0) : (item.top ?? item.base ?? 0);
      spawn('fx-score', x, y + 6, `+${points}`);
    };

    const step = (time) => {
      frame = 0;
      const play = playRef.current;
      if (!play) return;
      const dt = Math.min((time - (last || time)) / 1000, 1 / 30);
      last = time;

      if (!play.dead) {
        const layout = layoutRef.current;
        const { maxScroll } = layout;
        const dir = play.finished ? 0 : (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
        const jump = play.finished ? false : keys.jump;
        const prevRight = play.x + RUNNER_SIZE;
        const wasGrounded = play.grounded;
        const fallSpeed = play.vy;
        const events = stepPhysics(play, { dir, jump }, layout, play.taken, dt, time);

        // Checkpoints you run past this attempt (crossing the pole, not just being somewhere after it).
        (layout.checkpoints || []).forEach((checkpoint) => {
          if (!play.checkpoints.has(checkpoint.id) && prevRight < checkpoint.x && play.x + RUNNER_SIZE >= checkpoint.x) {
            play.checkpoints.add(checkpoint.id);
            if (play.checkpoints.size > 1) {
              sfx('checkpoint');
              spawn('fx-score fx-checkpoint', checkpoint.x + 30, 230, `${play.checkpoints.size}/${layout.checkpoints.length}`);
            }
          }
        });

        // Sounds and little effects for what just happened.
        if (wasGrounded && !play.grounded && play.vy > 0) sfx('jump');
        if (!wasGrounded && play.grounded && fallSpeed < -500) puff(play.x + RUNNER_SIZE / 2, play.y);
        if (events.bump && !events.bonus.length && !events.broken.length) sfx('bump');
        if (events.coins.length || (events.bonus.length && !events.power)) sfx('coin');
        if (events.power) sfx('power');
        if (events.stomped.length) sfx('stomp');
        if (events.broken.length) sfx('brick');
        if (events.hurt) sfx('hurt');
        events.coins.forEach((id) => popup(layout.coins[id], SCORE.bit));
        events.bonus.forEach((id) => popup(layout.parts[id], SCORE.bit, true));
        events.stomped.forEach((id) => popup(layout.bugs[id], SCORE.bug, false, bugOffset(layout.bugs[id], time)));
        events.broken.forEach((id) => popup(layout.parts[id], SCORE.brick));

        layout.bugs.forEach((bug) => {
          if (!play.taken.squashed.has(bug.id)) {
            bug.element.style.transform = `translateX(${bugOffset(bug, time)}px)`;
          }
        });
        events.bonus.forEach((id) => layout.parts[id]?.element.classList.add('is-used'));
        events.coins.forEach((id) => layout.coins[id]?.element.classList.add('is-collected'));
        events.stomped.forEach((id) => layout.bugs[id]?.element.classList.add('is-squashed'));
        events.broken.forEach((id) => layout.parts[id]?.element?.classList.add('is-broken'));
        if (events.power) {
          events.bonus.forEach((id) => layout.parts[id]?.element.classList.add('is-grabbed'));
        }
        if (events.finish) {
          sfx('flag');
          play.finishedAt = time;
          const flagBonus = Math.round((100 + events.finish.height * (SCORE.flag - 100)) / 100) * 100;
          worldRef.current?.querySelector('.flagpole')?.classList.add('is-grabbed');
          const finish = {
            ms: Math.round(performance.now() - play.startedAt),
            checkpoints: play.checkpoints.size,
            totalCheckpoints: layout.checkpoints?.length || 0,
            flagBonus,
            time: formatTime(performance.now() - play.startedAt),
            score: scoreOf(play.taken, flagBonus),
          };
          setPlayState((current) => ({ ...current, finish, score: finish.score }));
        }
        if (
          events.bonus.length || events.coins.length || events.stomped.length || events.broken.length ||
          events.power || events.hurt
        ) {
          const bits = play.taken.usedBonus.size + play.taken.collected.size;
          const bugs = play.taken.squashed.size;
          setPlayState((current) => ({
            ...current, bits, bugs, score: current.finish ? current.score : scoreOf(play.taken), isPowered: play.powered,
          }));
        }
        if (events.hurt) {
          window.setTimeout(() => render(), HURT_TIME + 20);
        }
        if (events.dead) die();
        if (timerRef.current && !play.finished) {
          timerRef.current.textContent = formatTime(performance.now() - play.startedAt);
        }

        const target = Math.min(Math.max(play.x - startX(), 0), maxScroll);
        if (Math.abs(target - window.scrollY) > 0.5) {
          window.scrollTo({ top: target, behavior: 'auto' });
        }
      }

      render();
      frame = window.requestAnimationFrame(step);
    };

    const enterPlay = () => {
      if (playRef.current) return;
      const { maxScroll } = layoutRef.current;
      const scroll = Math.min(Math.max(window.scrollY, 0), maxScroll);
      playRef.current = freshRunner(scroll + startX());
      resetTaken(playRef.current);
      document.documentElement.classList.add('is-play-mode');
      setPlayState((current) => ({ ...current, isPlaying: true }));
      last = 0;
      frame = window.requestAnimationFrame(step);
    };

    const exitPlay = () => {
      if (!playRef.current) return;
      playRef.current = null;
      keys.left = keys.right = keys.jump = false;
      document.documentElement.classList.remove('is-play-mode');
      runnerRef.current?.classList.remove('is-dead', 'is-powered', 'is-hurt');
      layoutRef.current.bugs?.forEach((bug) => {
        bug.element.style.transform = '';
      });
      setPlayState((current) => ({ ...current, isPlaying: false, isDead: false, finish: null }));
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      render();
    };

    const onKeyDown = (event) => {
      const action = keyAction(event.key);
      if (!action || event.ctrlKey || event.metaKey || event.altKey) return;
      if (ignoreTarget(event.target, action)) return;
      event.preventDefault();
      keys[action] = true;
      const play = playRef.current;
      // After the flag, any key (after a short pause) starts a new run.
      if (play?.finished && performance.now() - play.finishedAt > 900) {
        respawn();
        return;
      }
      enterPlay();
    };

    const onKeyUp = (event) => {
      const action = keyAction(event.key);
      if (action) keys[action] = false;
    };

    const onWheel = () => exitPlay();
    const onBlur = () => {
      keys.left = keys.right = keys.jump = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onWheel, { passive: true });
    window.addEventListener('blur', onBlur);
    window.addEventListener('level-exit-play', exitPlay);
    window.addEventListener('level-respawn', respawn);
    // `?levelcheck` exposes the measured course so an automated run can prove it is beatable.
    if (window.location.search.includes('levelcheck')) {
      window.__level = { layout: () => layoutRef.current, stepPhysics, newTaken, runner: () => playRef.current };
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onWheel);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('level-exit-play', exitPlay);
      window.removeEventListener('level-respawn', respawn);
      if (frame) window.cancelAnimationFrame(frame);
      playRef.current = null;
      document.documentElement.classList.remove('is-play-mode');
    };
  }, [isVertical, render]);

  // Keyboard users: when focus lands on something off-screen, run the course to it
  // instead of letting the browser shift the clipped viewport sideways.
  useEffect(() => {
    if (isVertical) return undefined;
    const world = worldRef.current;
    const viewport = world?.parentElement;
    const onFocusIn = (event) => {
      if (!world?.contains(event.target)) return;
      if (viewport) viewport.scrollLeft = 0;
      const rect = event.target.getBoundingClientRect();
      if (rect.left < 0 || rect.right > window.innerWidth) {
        const worldX = rect.left - world.getBoundingClientRect().left;
        window.scrollTo({ top: Math.max(worldX - window.innerWidth * 0.3, 0), behavior: 'auto' });
      }
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, [isVertical]);

  const scrollToSection = useCallback(
    (id, behavior = 'smooth') => {
      window.dispatchEvent(new Event('level-exit-play'));
      measure();
      const section = layoutRef.current.sections.find((item) => item.id === id);

      if (!section) {
        return;
      }

      const top = isVertical
        ? section.start + (worldRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 72
        : section.start;
      window.scrollTo({ top: id === SECTION_IDS[0] ? 0 : Math.max(top, 0), behavior });
    },
    [isVertical, measure],
  );

  return {
    isVertical,
    refs: { trackRef, worldRef, parallaxRef, runnerRef, trailRef, progressRef, percentRef, timerRef },
    playState,
    scrollToSection,
  };
}

export default useLevelEngine;
