import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import HexGridBackground from '../components/HexGridBackground';
import greenFavicon from '../assets/favicons/favicon-green.png';
import blueFavicon from '../assets/favicons/favicon-blue.png';
import useSpotifyNowPlaying from '../hooks/useSpotifyNowPlaying';
import { languages, translations, useLanguage } from '../i18n/LanguageContext';

const links = [
  { to: '/', key: 'home', end: true },
  { to: '/about', key: 'about' },
  { to: '/projects', key: 'projects' },
  { to: '/cv', key: 'cv' },
  { to: '/contact', key: 'contact' },
];

// On small or touch screens the brand opens the Spotify card instead of linking home.
const compactBrandQuery = '(max-width: 640px), (hover: none)';

function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSpotifyCardOpen, setIsSpotifyCardOpen] = useState(false);
  const [isCompactBrand, setIsCompactBrand] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(compactBrandQuery).matches,
  );
  const [themeTransition, setThemeTransition] = useState(null);
  const [preferredBlueTheme, setPreferredBlueTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    const savedTheme = window.localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'blue' : true;
  });
  const location = useLocation();
  const { language, setLanguage, t: translation } = useLanguage();
  const t = translation.layout;
  const hasMountedThemeRef = useRef(false);
  const brandSpotifyRef = useRef(null);
  const isBlueTheme = preferredBlueTheme;
  const spotifyNowPlaying = useSpotifyNowPlaying();
  const navbarTrack = spotifyNowPlaying.track;
  const isListeningNow = Boolean(navbarTrack?.isPlaying);

  useEffect(() => {
    const mediaQuery = window.matchMedia(compactBrandQuery);
    const handleChange = (event) => {
      setIsCompactBrand(event.matches);
      setIsSpotifyCardOpen(false);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (!isSpotifyCardOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!brandSpotifyRef.current?.contains(event.target)) {
        setIsSpotifyCardOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isSpotifyCardOpen]);

  const handleBrandClick = (event) => {
    if (!isCompactBrand) {
      return;
    }

    event.preventDefault();
    setIsMenuOpen(false);
    setIsSpotifyCardOpen((current) => !current);
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSpotifyCardOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    const handleThemeRequest = (event) => {
      const requestedTheme = event.detail?.theme;

      if (requestedTheme === 'blue') {
        setPreferredBlueTheme(true);
      }

      if (requestedTheme === 'green') {
        setPreferredBlueTheme(false);
      }
    };

    window.addEventListener('app-theme-request', handleThemeRequest);

    return () => {
      window.removeEventListener('app-theme-request', handleThemeRequest);
    };
  }, []);

  useEffect(() => {
    if (!hasMountedThemeRef.current) {
      hasMountedThemeRef.current = true;
      return;
    }

    setThemeTransition(isBlueTheme ? 'blue' : 'green');
    const timeoutId = window.setTimeout(() => {
      setThemeTransition(null);
    }, 1100);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isBlueTheme]);

  useEffect(() => {
    document.body.dataset.theme = isBlueTheme ? 'blue' : 'green';

    let favicon = document.querySelector("link[rel='icon']");

    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      document.head.appendChild(favicon);
    }

    favicon.setAttribute('type', 'image/png');
    favicon.setAttribute('href', isBlueTheme ? blueFavicon : greenFavicon);
  }, [isBlueTheme]);

  useEffect(() => {
    window.localStorage.setItem('theme', preferredBlueTheme ? 'blue' : 'green');
  }, [preferredBlueTheme]);

  return (
    <div className="app-shell">
      <HexGridBackground />
      <div className="page-glow page-glow-left"></div>
      <div className="page-glow page-glow-right"></div>
      {themeTransition && (
        <div
          className={`theme-transition-overlay theme-transition-overlay-${themeTransition}`}
          aria-hidden="true"
        ></div>
      )}
      <div className="floating-controls">
        <div
          className="language-switch theme-switch-floating"
          role="group"
          aria-label={t.languageSwitch}
        >
          <span className="theme-switch-label">{t.languageLabel}</span>
          <div className="language-switch-options">
            {languages.map((code) => (
              <button
                key={code}
                type="button"
                className={`language-switch-option${language === code ? ' is-active' : ''}`}
                aria-pressed={language === code}
                aria-label={translations[code].languageName}
                lang={code}
                onClick={() => setLanguage(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <label className="theme-switch theme-switch-floating" aria-label={t.themeSwitch}>
          <span className="theme-switch-label">{t.themeLabel}</span>
          <button
            type="button"
            className={`theme-switch-track${isBlueTheme ? ' is-active' : ''}`}
            role="switch"
            aria-checked={isBlueTheme}
            onClick={() => setPreferredBlueTheme((current) => !current)}
          >
            <span className="theme-switch-thumb"></span>
          </button>
        </label>
      </div>

      <header className={`site-header${isSpotifyCardOpen ? ' is-spotify-open' : ''}`}>
        <nav className="nav">
          <div className="container nav-inner">
            <div
              className={`brand-spotify${isSpotifyCardOpen ? ' is-open' : ''}`}
              ref={brandSpotifyRef}
            >
              <Link
                className={`brand${isListeningNow ? ' is-listening' : ''}`}
                to="/"
                onClick={handleBrandClick}
                aria-expanded={isCompactBrand ? isSpotifyCardOpen : undefined}
                aria-label={isListeningNow ? t.brandListening : 'Siebe'}
              >
                <span
                  className={`brand-indicator${isListeningNow ? ' is-listening' : ''}`}
                  aria-hidden="true"
                >
                  <span className="brand-indicator-core"></span>
                  <span className="brand-indicator-wave"></span>
                </span>
                <span className="brand-label">Siebe</span>
              </Link>

              <div className="brand-hover-card" role="dialog" aria-live="polite">
                <div className="brand-hover-card-top">
                  <span className="card-label">Spotify API</span>
                  <span
                    className={`brand-hover-status${
                      spotifyNowPlaying.status === 'error' ? ' is-error' : ''
                    }${isListeningNow ? ' is-active' : ''}`}
                  >
                    {spotifyNowPlaying.status === 'loading'
                      ? t.spotifyLoading
                      : spotifyNowPlaying.status === 'error'
                        ? t.spotifyOffline
                        : isListeningNow
                          ? t.spotifyListening
                          : t.spotifyIdle}
                  </span>
                </div>

                {spotifyNowPlaying.status === 'ready' && navbarTrack?.isPlaying && (
                  <div className="brand-hover-card-body">
                    {navbarTrack.albumImageUrl ? (
                      <img
                        className="brand-hover-artwork"
                        src={navbarTrack.albumImageUrl}
                        alt={t.artworkFor(navbarTrack.title)}
                      />
                    ) : (
                      <div className="brand-hover-artwork brand-hover-artwork-placeholder"></div>
                    )}
                    <div className="brand-hover-copy">
                      <strong>{navbarTrack.title}</strong>
                      <span>{navbarTrack.artist}</span>
                      <span>{navbarTrack.album}</span>
                    </div>
                  </div>
                )}

                {spotifyNowPlaying.status === 'loading' && (
                  <div className="brand-hover-card-body">
                    <div className="brand-hover-artwork brand-hover-artwork-placeholder"></div>
                    <div className="brand-hover-copy">
                      <strong>{t.checkingSpotify}</strong>
                      <span>{t.loadingPlayback}</span>
                    </div>
                  </div>
                )}

                {spotifyNowPlaying.status === 'error' && (
                  <div className="brand-hover-card-body">
                    <div className="brand-hover-artwork brand-hover-artwork-placeholder"></div>
                    <div className="brand-hover-copy">
                      <strong>{t.connectionIssue}</strong>
                      <span>{spotifyNowPlaying.errorMessage || t.unableToLoad}</span>
                    </div>
                  </div>
                )}

                {spotifyNowPlaying.status === 'ready' && !navbarTrack?.isPlaying && (
                  <div className="brand-hover-card-body">
                    <div className="brand-hover-artwork brand-hover-artwork-placeholder"></div>
                    <div className="brand-hover-copy">
                      <strong>{t.nothingPlaying}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              className={`nav-toggle${isMenuOpen ? ' is-open' : ''}`}
              aria-expanded={isMenuOpen}
              aria-controls="primary-navigation"
              aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div className={`nav-links${isMenuOpen ? ' is-open' : ''}`} id="primary-navigation">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                >
                  {t.nav[link.key]}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <Outlet context={{ spotifyNowPlaying }} />
    </div>
  );
}

export default MainLayout;
