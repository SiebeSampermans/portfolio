import { useEffect, useRef, useState } from 'react';
import { languages, translations, useLanguage } from '../i18n/LanguageContext';
import { SECTION_IDS } from './useLevelEngine';

const sameText = (a, b) =>
  (a || '').toLowerCase().replace(/[^a-z0-9]/g, '') === (b || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function SpotifyBadge({ spotify }) {
  const { t: translation } = useLanguage();
  const t = translation.layout;
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);
  const track = spotify.track;
  const isPlaying = spotify.status === 'ready' && Boolean(track?.isPlaying);
  const showAlbum = Boolean(track?.album) && !sameText(track.album, track.title);

  useEffect(() => {
    if (!isOpen) return undefined;
    const close = (event) => {
      if (!wrapRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [isOpen]);

  const status =
    spotify.status === 'loading'
      ? t.spotifyLoading
      : spotify.status === 'error'
        ? t.spotifyOffline
        : isPlaying
          ? t.spotifyListening
          : t.spotifyIdle;

  return (
    <div className={`hud-spotify${isOpen ? ' is-open' : ''}`} ref={wrapRef}>
      <button
        type="button"
        className={`hud-spotify-button${isPlaying ? ' is-playing' : ''}`}
        aria-expanded={isOpen}
        aria-label={isPlaying ? t.brandListening : `Spotify: ${status}`}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="eq" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span className="hud-spotify-status">{status}</span>
      </button>

      <div className="hud-spotify-card" role="dialog" aria-live="polite">
        <div className="hud-spotify-card-top">
          <span className="mono-label">Spotify</span>
          <span className={`pill${isPlaying ? ' is-on' : ''}${spotify.status === 'error' ? ' is-error' : ''}`}>
            {status}
          </span>
        </div>
        <div className="hud-spotify-card-body">
          {isPlaying && track.albumImageUrl ? (
            <img className="artwork" src={track.albumImageUrl} alt={t.artworkFor(track.title)} />
          ) : (
            <span className="artwork artwork-empty" aria-hidden="true"></span>
          )}
          <div className="hud-spotify-copy">
            {spotify.status === 'loading' && (
              <>
                <strong>{t.checkingSpotify}</strong>
                <span>{t.loadingPlayback}</span>
              </>
            )}
            {spotify.status === 'error' && (
              <>
                <strong>{t.connectionIssue}</strong>
                <span>{t.unableToLoad}</span>
              </>
            )}
            {spotify.status === 'ready' && !isPlaying && <strong>{t.nothingPlaying}</strong>}
            {isPlaying && (
              <>
                <strong title={track.title}>{track.title}</strong>
                {track.artist && <span title={track.artist}>{track.artist}</span>}
                {showAlbum && <span title={track.album}>{track.album}</span>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hud({ refs, activeSection, onNavigate, spotify, theme }) {
  const { language, setLanguage, t: translation } = useLanguage();
  const t = translation.layout;
  const level = translation.level;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeIndex = SECTION_IDS.indexOf(activeSection);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKey = (event) => event.key === 'Escape' && setIsMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const go = (id) => {
    setIsMenuOpen(false);
    onNavigate(id);
  };

  const controls = (
    <>
      <div className="hud-lang" role="group" aria-label={t.languageSwitch}>
        {languages.map((code) => (
          <button
            key={code}
            type="button"
            className={language === code ? 'is-active' : undefined}
            aria-pressed={language === code}
            aria-label={translations[code].languageName}
            lang={code}
            onClick={() => setLanguage(code)}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="hud-theme"
        role="switch"
        aria-checked={theme.isBlue}
        aria-label={t.themeSwitch}
        title={t.themeSwitch}
        onClick={theme.toggle}
      >
        <span className="hud-theme-dot hud-theme-green"></span>
        <span className="hud-theme-dot hud-theme-blue"></span>
      </button>
    </>
  );

  return (
    <header className={`hud${isMenuOpen ? ' is-menu-open' : ''}`}>
      <div className="hud-row">
        <a
          className="hud-brand"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            go('home');
          }}
        >
          <span className="hud-brand-block" aria-hidden="true">S</span>
          <span className="hud-brand-text">
            <strong>{level.name}</strong>
            <span>
              {level.checkpoint} {String(activeIndex + 1).padStart(2, '0')} · {level.sections[activeSection]}
            </span>
          </span>
        </a>

        <div className="hud-progress" aria-label={level.progress}>
          <div className="hud-progress-bar">
            <span ref={refs.progressRef}></span>
            {SECTION_IDS.map((id, index) => (
              <i
                key={id}
                className={index <= activeIndex ? 'is-reached' : undefined}
                style={{ left: `${(index / (SECTION_IDS.length - 1)) * 100}%` }}
              ></i>
            ))}
          </div>
          <span className="hud-percent" ref={refs.percentRef}>
            0%
          </span>
        </div>

        <SpotifyBadge spotify={spotify} />

        <div className="hud-controls">{controls}</div>

        <button
          type="button"
          className="hud-menu-button"
          aria-expanded={isMenuOpen}
          aria-controls="level-menu"
          aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span></span>
          <span></span>
        </button>
      </div>

      <nav className="hud-nav" aria-label={level.menu}>
        {SECTION_IDS.map((id, index) => (
          <a
            key={id}
            href={id === 'home' ? '/' : `/${id}`}
            className={id === activeSection ? 'is-active' : undefined}
            aria-current={id === activeSection ? 'location' : undefined}
            onClick={(event) => {
              event.preventDefault();
              go(id);
            }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {t.nav[id]}
          </a>
        ))}
      </nav>

      <div className="hud-menu" id="level-menu" hidden={!isMenuOpen}>
        <span className="mono-label">{level.menu}</span>
        <nav>
          {SECTION_IDS.map((id, index) => (
            <a
              key={id}
              href={id === 'home' ? '/' : `/${id}`}
              className={id === activeSection ? 'is-active' : undefined}
              onClick={(event) => {
                event.preventDefault();
                go(id);
              }}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {t.nav[id]}
            </a>
          ))}
        </nav>
        <div className="hud-menu-controls">{controls}</div>
      </div>
    </header>
  );
}

export default Hud;
