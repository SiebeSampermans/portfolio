import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import HexGridBackground from '../components/HexGridBackground';
import greenFavicon from '../assets/favicons/favicon-green.png';
import blueFavicon from '../assets/favicons/favicon-blue.png';

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
      return false;
    }

    return window.localStorage.getItem('theme') === 'blue';
  });
  const location = useLocation();
  const hasMountedThemeRef = useRef(false);
  const isCvRoute = location.pathname === '/cv' || location.pathname === '/cv.html';
  const hideThemeSwitch = isCvRoute;
  const isBlueTheme = isCvRoute || preferredBlueTheme;

  useEffect(() => {
    setIsMenuOpen(false);
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
      {!hideThemeSwitch && (
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
      )}

      <header className="site-header">
        <nav className="nav">
          <div className="container nav-inner">
            <Link className="brand" to="/">
              Siebe
            </Link>
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

      <Outlet />
    </div>
  );
}

export default MainLayout;
