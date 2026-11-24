import { useCallback, useEffect, useRef, useState } from 'react';

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
  const progressRef = useRef(null);
  const percentRef = useRef(null);
  const layoutRef = useRef({ obstacles: [], sections: [], maxScroll: 1, portals: [] });
  const activeSectionRef = useRef(null);
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

    layoutRef.current = { obstacles, sections, maxScroll, portals };
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
      const runnerX = scroll + window.innerWidth * RUNNER_SCREEN_X + RUNNER_SIZE / 2;
      probe = runnerX;

      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(${-scroll}px, 0, 0)`;
      }

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${-scroll * 0.3}px, 0, 0)`;
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

      if (runnerRef.current) {
        runnerRef.current.style.transform = `translate3d(0, ${-lift}px, 0) rotate(${
          completedJumps * 180 + rotation
        }deg)`;
        runnerRef.current.classList.toggle('is-airborne', lift > 2);
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
      measure();
      const section = layoutRef.current.sections.find((item) => item.id === id);

      if (!section) {
        return;
      }

      const top = isVertical
        ? section.start + (worldRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 72
        : section.start;
      window.scrollTo({ top: Math.max(top, 0), behavior });
    },
    [isVertical, measure],
  );

  return {
    isVertical,
    refs: { trackRef, worldRef, parallaxRef, runnerRef, progressRef, percentRef },
    scrollToSection,
  };
}

export default useLevelEngine;
