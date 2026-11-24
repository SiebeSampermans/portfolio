import { useCallback, useEffect, useRef, useState } from 'react';
import { bugOffset, stepPhysics } from './physics';

// Below this width, on short screens, or when the visitor asks for less motion,
// the level is laid out vertically and the runner stays still.
const VERTICAL_QUERY = '(max-width: 820px), (max-height: 560px), (prefers-reduced-motion: reduce)';

// Where the runner sits on screen, as a share of the viewport width.
const RUNNER_SCREEN_X = 0.2;
const RUNNER_SIZE = 52;

export const SECTION_IDS = ['home', 'about', 'projects', 'cv', 'contact'];

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
  const layoutRef = useRef({ obstacles: [], sections: [], maxScroll: 1, portals: [] });
  const activeSectionRef = useRef(null);
  const playRef = useRef(null);
  const [playState, setPlayState] = useState({ isPlaying: false, attempts: 1, isDead: false, bits: 0, bugs: 0 });
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
    const kindOf = (element) =>
      element.classList.contains('ob-spike') ? 'spike' : element.classList.contains('ob-bonus') ? 'bonus' : 'block';
    const parts = Array.from(world.querySelectorAll('.obstacle i')).map((element, index) => ({
      ...measureThing(element, index),
      kind: kindOf(element),
    }));
    const coins = Array.from(world.querySelectorAll('.obstacle .coin')).map(measureThing);
    // Bugs are measured from their spawn point, without the patrol offset.
    const bugs = Array.from(world.querySelectorAll('.obstacle .bug')).map((element, index) => {
      // Measure the bug's column: the bug itself may be mid-animation.
      const spawn = measureThing(element.parentElement, index);
      return { ...spawn, element, top: spawn.base + element.offsetHeight, phase: index * 1.7 };
    });

    layoutRef.current = { obstacles, sections, maxScroll, portals, parts, coins, bugs, worldWidth };
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

      if (play && runnerRef.current) {
        const offsetX = play.x - scroll - window.innerWidth * RUNNER_SCREEN_X;
        runnerRef.current.style.transform = `translate3d(${offsetX}px, ${-play.y}px, 0) rotate(${play.rotation}deg)`;
        runnerRef.current.classList.toggle('is-airborne', !play.grounded);
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

      if (!play && runnerRef.current) {
        runnerRef.current.style.transform = `translate3d(0, ${-lift}px, 0) rotate(${
          completedJumps * 180 + rotation
        }deg)`;
        runnerRef.current.classList.toggle('is-airborne', lift > 2);
        drawTrail(anchorX, lift);
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
      return action === 'jump' && (tag === 'BUTTON' || tag === 'A') && !playRef.current;
    };

    // Everything taken during an attempt comes back when you start over.
    const resetTaken = (play) => {
      play.taken = { usedBonus: new Set(), collected: new Set(), squashed: new Set() };
      worldRef.current
        ?.querySelectorAll('.is-used, .is-collected, .is-squashed')
        .forEach((element) => element.classList.remove('is-used', 'is-collected', 'is-squashed'));
    };

    const respawn = () => {
      const play = playRef.current;
      if (!play) return;
      Object.assign(play, { x: startX(), y: 0, vy: 0, rotation: 0, grounded: true, dead: false });
      resetTaken(play);
      window.scrollTo({ top: 0, behavior: 'auto' });
      setPlayState((current) => ({ ...current, isDead: false, bits: 0, bugs: 0 }));
      render();
    };

    const die = () => {
      const play = playRef.current;
      if (!play || play.dead) return;
      play.dead = true;
      runnerRef.current?.classList.add('is-dead');
      setPlayState((current) => ({ ...current, isDead: true, attempts: current.attempts + 1 }));
      window.setTimeout(() => {
        runnerRef.current?.classList.remove('is-dead');
        respawn();
      }, 700);
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
        const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
        const events = stepPhysics(play, { dir, jump: keys.jump }, layout, play.taken, dt, time);

        layout.bugs.forEach((bug) => {
          if (!play.taken.squashed.has(bug.id)) {
            bug.element.style.transform = `translateX(${bugOffset(bug, time)}px)`;
          }
        });
        events.bonus.forEach((id) => layout.parts[id]?.element.classList.add('is-used'));
        events.coins.forEach((id) => layout.coins[id]?.element.classList.add('is-collected'));
        events.stomped.forEach((id) => layout.bugs[id]?.element.classList.add('is-squashed'));
        if (events.bonus.length || events.coins.length || events.stomped.length) {
          const bits = play.taken.usedBonus.size + play.taken.collected.size;
          const bugs = play.taken.squashed.size;
          setPlayState((current) => ({ ...current, bits, bugs }));
        }
        if (events.dead) die();

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
      playRef.current = { x: scroll + startX(), y: 0, vy: 0, rotation: 0, grounded: true, dead: false };
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
      runnerRef.current?.classList.remove('is-dead');
      layoutRef.current.bugs?.forEach((bug) => {
        bug.element.style.transform = '';
      });
      setPlayState((current) => ({ ...current, isPlaying: false, isDead: false }));
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
    // `?levelcheck` exposes the measured course so an automated run can prove it is beatable.
    if (window.location.search.includes('levelcheck')) {
      window.__level = { layout: () => layoutRef.current, stepPhysics };
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onWheel);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('level-exit-play', exitPlay);
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
    refs: { trackRef, worldRef, parallaxRef, runnerRef, trailRef, progressRef, percentRef },
    playState,
    scrollToSection,
  };
}

export default useLevelEngine;
