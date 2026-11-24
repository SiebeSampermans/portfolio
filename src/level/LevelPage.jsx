import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useSpotifyNowPlaying from '../hooks/useSpotifyNowPlaying';
import useTheme from '../hooks/useTheme';
import { useLanguage } from '../i18n/LanguageContext';
import Garage from './Garage';
import Hud from './Hud';
import { colorValue, RunnerBlock, TRAIL_BITS, useRunnerStyle } from './Runner';
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

const SHAPES = ['square', 'diamond', 'ring', 'tri', 'square', 'ring', 'diamond', 'bar'];

function Backdrop({ parallaxRef }) {
  // A fixed, seeded scatter of outlined shapes that drift slower than the course.
  const shapes = useMemo(
    () =>
      Array.from({ length: 64 }, (_, index) => ({
        kind: SHAPES[index % SHAPES.length],
        left: index * 420 + ((index * 137) % 260),
        top: 8 + ((index * 53) % 52),
        size: 50 + ((index * 71) % 120),
        spin: (index * 29) % 90,
      })),
    [],
  );

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-grid"></div>
      <div className="backdrop-shapes" ref={parallaxRef}>
        {shapes.map((shape, index) => (
          <span
            key={index}
            className={`shape shape-${shape.kind}`}
            style={{
              left: `${shape.left}px`,
              top: `${shape.top}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              '--spin': `${shape.spin}deg`,
            }}
          ></span>
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
  const [runnerStyle, updateRunnerStyle, resetRunnerStyle] = useRunnerStyle();
  const [isGarageOpen, setIsGarageOpen] = useState(false);
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
        runnerStyle={runnerStyle}
        onOpenGarage={isVertical ? null : () => setIsGarageOpen(true)}
      />
      <Garage
        isOpen={isGarageOpen}
        onClose={() => setIsGarageOpen(false)}
        style={runnerStyle}
        update={updateRunnerStyle}
        reset={resetRunnerStyle}
      />

      {playState.isPlaying && (
        <div className="play-banner" role="status">
          <span className="play-banner-dot" aria-hidden="true"></span>
          <strong>{t.level.playing}</strong>
          <span>
            {t.level.attempt} {playState.attempts}
          </span>
          <span className="play-banner-score">
            <span className="mini-coin" aria-hidden="true"></span>
            {t.level.bits} {playState.bits}
          </span>
          <span className="play-banner-score">
            {t.level.bugs} {playState.bugs}
          </span>
          <span className="play-banner-hint">{t.level.exitPlay}</span>
        </div>
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
            className={`runner-wrap trail-${runnerStyle.trail}`}
            style={{ '--runner-color': colorValue(runnerStyle.color) }}
            aria-hidden="true"
          >
            <span className="trail" ref={refs.trailRef}>
              {Array.from({ length: TRAIL_BITS }, (_, index) => (
                <i key={index} style={{ '--i': index }}></i>
              ))}
            </span>
            <RunnerBlock style={runnerStyle} ref={refs.runnerRef} />
          </div>
          <main className="world" id="level-world" ref={refs.worldRef}>
            <HomeZone onNavigate={navigate} canPlay={!isVertical} onOpenGarage={() => setIsGarageOpen(true)} />
            <AboutZone spotify={spotify} />
            <ProjectsZone />
            <CvZone isBlue={theme.isBlue} />
            <ContactZone onReplay={() => navigate('home')} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default LevelPage;
