import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import HexGridBackground from '../components/HexGridBackground';
import greenFavicon from '../assets/favicons/favicon-green.png';
import blueFavicon from '../assets/favicons/favicon-blue.png';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About me' },
  { to: '/projects', label: 'Projects / Achievements' },
  { to: '/cv', label: 'CV' },
  { to: '/contact', label: 'Contact' },
];

function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlueTheme, setIsBlueTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem('theme') === 'blue';
  });
  const [themeTransitionTheme, setThemeTransitionTheme] = useState(null);
  const location = useLocation();
  const hideThemeSwitch = location.pathname === '/cv' || location.pathname === '/cv.html';

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    document.body.dataset.theme = isBlueTheme ? 'blue' : 'green';
    window.localStorage.setItem('theme', isBlueTheme ? 'blue' : 'green');

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
    const syncThemeFromStorage = () => {
      const nextIsBlueTheme = window.localStorage.getItem('theme') === 'blue';
      setIsBlueTheme(nextIsBlueTheme);
    };

    const requestThemeChange = (event) => {
      const requestedTheme = event.detail?.theme;

      if (requestedTheme !== 'blue' && requestedTheme !== 'green') {
        return;
      }

      const nextIsBlueTheme = requestedTheme === 'blue';

      if (nextIsBlueTheme === isBlueTheme) {
        return;
      }

      setThemeTransitionTheme(requestedTheme);

      window.setTimeout(() => {
        setIsBlueTheme(nextIsBlueTheme);
      }, 420);

      window.setTimeout(() => {
        setThemeTransitionTheme(null);
      }, 1100);
    };

    window.addEventListener('storage', syncThemeFromStorage);
    window.addEventListener('app-theme-sync', syncThemeFromStorage);
    window.addEventListener('app-theme-request', requestThemeChange);

    return () => {
      window.removeEventListener('storage', syncThemeFromStorage);
      window.removeEventListener('app-theme-sync', syncThemeFromStorage);
      window.removeEventListener('app-theme-request', requestThemeChange);
    };
  }, [isBlueTheme]);

  const handleThemeToggle = () => {
    const nextIsBlueTheme = !isBlueTheme;
    const nextTheme = nextIsBlueTheme ? 'blue' : 'green';

    setThemeTransitionTheme(nextTheme);

    window.setTimeout(() => {
      setIsBlueTheme(nextIsBlueTheme);
    }, 420);

    window.setTimeout(() => {
      setThemeTransitionTheme(null);
    }, 1100);
  };

  return (
    <div className="app-shell">
      <HexGridBackground />
      <div className="page-glow page-glow-left"></div>
      <div className="page-glow page-glow-right"></div>
      {themeTransitionTheme && (
        <div
          className={`theme-transition-overlay theme-transition-overlay-${themeTransitionTheme}`}
          aria-hidden="true"
        ></div>
      )}
      {!hideThemeSwitch && (
        <label className="theme-switch theme-switch-floating" aria-label="Toggle color theme">
          <span className="theme-switch-label">Theme</span>
          <button
            type="button"
            className={`theme-switch-track${isBlueTheme ? ' is-active' : ''}`}
            role="switch"
            aria-checked={isBlueTheme}
            onClick={handleThemeToggle}
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
