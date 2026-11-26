import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useSpotifyNowPlaying from '../hooks/useSpotifyNowPlaying';
import useTheme from '../hooks/useTheme';
import { useLanguage } from '../i18n/LanguageContext';
import Hud from './Hud';
import { useLeaderboard } from './leaderboard';
import { ClearCard } from './Leaderboard';
import { colorValue, RunnerBlock, TRAIL_BITS } from './Runner';
import useLevelEngine, { SECTION_IDS } from './useLevelEngine';
import AboutZone from './zones/AboutZone';
import ContactZone from './zones/ContactZone';
import CvZone from './zones/CvZone';
import HomeZone from './zones/HomeZone';
import ProjectsZone from './zones/ProjectsZone';

const sectionFromPath = (pathname) => {
  const slug = pathname.replace(/^\/+/, '').replace(/\.html$/, '').replace(/\/+$/, '');
  return SECTION_IDS.includes(slug) ? slug : 'home';
};
const pathForSection = (id) => (id === 'home' ? '/' : `/${id}`);

// The player is the pixel hero for now; the garage is switched off.
const RUNNER_STYLE = { body: 'hero', color: 'accent', hat: 'none', trail: 'line' };

const CRITTERS = Array.from({ length: 9 }, (_, index) => ({
  left: `${6 + ((index * 37) % 88)}%`,
  bottom: `calc(var(--ground-h) + ${30 + ((index * 53) % 170)}px)`,
  '--drift': `${9 + ((index * 7) % 8)}s`,
  '--delay': `${-((index * 1.9) % 9).toFixed(1)}s`,
  '--path': `${index % 2 ? -1 : 1}`,
}));

function Backdrop({ parallaxRef }) {
  // Seeded scenery that drifts slower than the course: rolling hills, bushes and clouds.
  const scenery = useMemo(() => {
    const items = [];
    for (let index = 0; index < 48; index += 1) {
      const base = index * 520;
      // Hills of very different heights and shapes: low mounds in front, tall peaks and misty
      // ranges behind, flat-topped plateaus, twin hills and stepped hills.
      const heights = [130, 300, 180, 420, 110, 240, 160, 340];
      const shapes = ['', 'hill-peak', 'hill-twin', 'hill-plateau', '', 'hill-step', 'hill-twin', 'hill-peak'];
      const height = heights[index % heights.length];
      const shape = shapes[(index * 3) % shapes.length];
      const layer = height > 320 ? 'hill-mist' : height > 220 ? 'hill-far' : index % 4 === 1 ? 'hill-dark' : '';
      const widthFactor = shape === 'hill-peak' ? 1.1 : shape === 'hill-plateau' ? 2.4 : shape === 'hill-twin' ? 1.6 : 1.9;
      items.push({
        kind: ['hill', shape, layer].filter(Boolean).join(' '),
        style: {
          left: base + ((index * 137) % 200),
          width: Math.round(height * widthFactor),
          height: shape === 'hill-step' ? Math.round(height * 0.65) : height,
          zIndex: height > 320 ? 0 : height > 220 ? 1 : 2,
        },
      });
      items.push({
        kind: 'cloud',
        style: { left: base + 260 + ((index * 97) % 160), top: `${7 + ((index * 53) % 7)}%`, width: 110 + ((index * 31) % 90) },
      });
      if (index % 2) {
        items.push({
          kind: 'bush',
          style: { left: base + 380 + ((index * 43) % 100), width: 80 + ((index * 23) % 60) },
        });
      }
    }
    return items;
  }, []);

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-grid"></div>
      <div className="sky-body"></div>
      {/* Butterflies by day, fireflies at night. */}
      <div className="critters">
        {CRITTERS.map((style, index) => (
          <span key={index} className="critter" style={style}>
            <i></i>
          </span>
        ))}
      </div>
      <div className="backdrop-shapes scenery" ref={parallaxRef}>
        {scenery.map((item, index) => (
          <span key={index} className={item.kind} style={item.style}></span>
        ))}
      </div>
    </div>
  );
}

function LevelPage() {
  const location = useLocation();
  const { t } = useLanguage();
  const theme = useTheme();
  const spotify = useSpotifyNowPlaying();
  const board = useLeaderboard();
  const [activeSection, setActiveSection] = useState(() => sectionFromPath(location.pathname));
  const hasArrivedRef = useRef(false);
  const isPlaying = spotify.status === 'ready' && Boolean(spotify.track?.isPlaying);

  const handleSectionChange = useCallback((id) => {
    setActiveSection(id);
    // Keep the address bar in step with the checkpoint, without a router navigation.
    if (hasArrivedRef.current && window.location.pathname !== pathForSection(id)) {
      window.history.replaceState(window.history.state, '', pathForSection(id));
    }
  }, []);

  const { isVertical, refs, playState, scrollToSection } = useLevelEngine({ onSectionChange: handleSectionChange });

  // Deep links (/about, /projects, ...) start the run at that checkpoint.
  useEffect(() => {
    const target = sectionFromPath(location.pathname);
    const frame = window.requestAnimationFrame(() => {
      scrollToSection(target, 'auto');
      hasArrivedRef.current = true;
    });
    return () => window.cancelAnimationFrame(frame);
    // Only on first arrival; later moves go through navigate().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onPopState = () => scrollToSection(sectionFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [scrollToSection]);

  useEffect(() => {
    document.title = t[activeSection]?.title ?? 'Siebe | Portfolio';
  }, [activeSection, t]);

  const navigate = useCallback(
    (id) => {
      window.history.pushState(null, '', pathForSection(id));
      scrollToSection(id);
    },
    [scrollToSection],
  );

  return (
    <div
      className={`level${isVertical ? ' is-vertical' : ' is-horizontal'}${isPlaying ? ' is-beat' : ''}`}
      data-section={activeSection}
    >
      <a className="skip-link" href="#level-world">
        {t.level.runHint}
      </a>
      <Backdrop parallaxRef={refs.parallaxRef} />
      {theme.transition && <div className={`theme-flash theme-flash-${theme.transition}`} aria-hidden="true"></div>}

      <Hud
        refs={refs}
        activeSection={activeSection}
        onNavigate={navigate}
        spotify={spotify}
        theme={theme}
      />

      {playState.isPlaying && (
        <div className="play-banner" role="status">
          <span className="play-banner-dot" aria-hidden="true"></span>
          <strong>{t.level.playing}</strong>
          <span>
            {t.level.attempt} {playState.attempts}
          </span>
          <span className="play-banner-score">
            {t.level.score} {String(playState.score).padStart(6, '0')}
          </span>
          <span className="play-banner-score">
            <span className="mini-coin" aria-hidden="true"></span>× {playState.bits}
          </span>
          <span className="play-banner-time" ref={refs.timerRef}>
            0:00
          </span>
          {playState.isPowered && <span className="play-banner-power">◆ {t.level.powered}</span>}
          <span className="play-banner-hint">{t.level.exitPlay}</span>
        </div>
      )}
      {playState.finish && (
        <ClearCard
          finish={playState.finish}
          stats={playState}
          board={board}
          text={t.level}
          onAgain={() => window.dispatchEvent(new Event('level-respawn'))}
          onHome={() => {
            window.dispatchEvent(new Event('level-exit-play'));
            navigate('home');
          }}
        />
      )}
      {playState.isDead && (
        <div className="death-flash" aria-live="assertive">
          <strong>
            {t.level.attempt} {playState.attempts}
          </strong>
          <span>{t.level.died}</span>
        </div>
      )}

      <div className="track" ref={refs.trackRef}>
        <div className="viewport">
          <div
            className={`runner-wrap trail-${RUNNER_STYLE.trail}`}
            style={{ '--runner-color': colorValue(RUNNER_STYLE.color) }}
            aria-hidden="true"
          >
            <span className="trail" ref={refs.trailRef}>
              {Array.from({ length: TRAIL_BITS }, (_, index) => (
                <i key={index} style={{ '--i': index }}></i>
              ))}
            </span>
            <RunnerBlock style={RUNNER_STYLE} ref={refs.runnerRef} />
          </div>
          <main className="world" id="level-world" ref={refs.worldRef}>
            <HomeZone onNavigate={navigate} canPlay={!isVertical} />
            <AboutZone spotify={spotify} />
            <ProjectsZone />
            <CvZone isBlue={theme.isBlue} />
            <ContactZone onReplay={() => navigate('home')} board={board} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default LevelPage;
