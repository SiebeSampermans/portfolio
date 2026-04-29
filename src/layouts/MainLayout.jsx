import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import HexGridBackground from '../components/HexGridBackground';
import greenFavicon from '../assets/favicons/favicon-green.png';
import blueFavicon from '../assets/favicons/favicon-blue.png';
import useSpotifyNowPlaying from '../hooks/useSpotifyNowPlaying';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/cv', label: 'CV' },
  { to: '/contact', label: 'Contact' },

];

function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [themeTransition, setThemeTransition] = useState(null);
  const [preferredBlueTheme, setPreferredBlueTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    const savedTheme = window.localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'blue' : true;
  });
  const location = useLocation();
  const hasMountedThemeRef = useRef(false);
  const isBlueTheme = preferredBlueTheme;
  const spotifyNowPlaying = useSpotifyNowPlaying();
  const navbarTrack = spotifyNowPlaying.track;
  const isListeningNow = Boolean(navbarTrack?.isPlaying);

  useEffect(() => {
    setIsMenuOpen(false);
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
      <label className="theme-switch theme-switch-floating" aria-label="Switch color theme">
        <span className="theme-switch-label">Theme</span>
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

      <header className="site-header">
        <nav className="nav">
          <div className="container nav-inner">
            <div className="brand-spotify">
              <Link
                className={`brand${isListeningNow ? ' is-listening' : ''}`}
                to="/"
                aria-label={isListeningNow ? 'Siebe, currently listening on Spotify' : 'Siebe'}
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
                      ? 'Loading'
                      : spotifyNowPlaying.status === 'error'
                        ? 'Offline'
                        : isListeningNow
                          ? 'Listening now'
                          : 'Idle'}
                  </span>
                </div>

                {spotifyNowPlaying.status === 'ready' && navbarTrack?.isPlaying && (
                  <div className="brand-hover-card-body">
                    {navbarTrack.albumImageUrl ? (
                      <img
                        className="brand-hover-artwork"
                        src={navbarTrack.albumImageUrl}
                        alt={`Artwork for ${navbarTrack.title}`}
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
                      <strong>Checking Spotify...</strong>
                      <span>Loading current playback.</span>
                    </div>
                  </div>
                )}

                {spotifyNowPlaying.status === 'error' && (
                  <div className="brand-hover-card-body">
                    <div className="brand-hover-artwork brand-hover-artwork-placeholder"></div>
                    <div className="brand-hover-copy">
                      <strong>Spotify connection issue</strong>
                      <span>{spotifyNowPlaying.errorMessage || 'Unable to load current playback.'}</span>
                    </div>
                  </div>
                )}

                {spotifyNowPlaying.status === 'ready' && !navbarTrack?.isPlaying && (
                  <div className="brand-hover-card-body">
                    <div className="brand-hover-artwork brand-hover-artwork-placeholder"></div>
                    <div className="brand-hover-copy">
                      <strong>Nothing playing right now</strong>
                      <span>The Spotify API is connected and waiting for the next track.</span>
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
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
                  {link.label}
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
