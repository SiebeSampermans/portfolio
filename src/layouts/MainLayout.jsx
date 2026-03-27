import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import HexGridBackground from '../components/HexGridBackground';
import greenFavicon from '../assets/favicons/favicon-green.png';
import blueFavicon from '../assets/favicons/favicon-blue.png';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About me' },
  { to: '/projects', label: 'Projects / Achievements' },
  { to: '/contact', label: 'Contact' },
  { to: '/cv', label: 'CV' },
];

function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlueTheme, setIsBlueTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem('theme') === 'blue';
  });
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
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

  return (
    <div className="app-shell">
      <HexGridBackground />
      <div className="page-glow page-glow-left"></div>
      <div className="page-glow page-glow-right"></div>
      <label className="theme-switch theme-switch-floating" aria-label="Wissel kleurthema">
        <span className="theme-switch-label">Thema</span>
        <button
          type="button"
          className={`theme-switch-track${isBlueTheme ? ' is-active' : ''}`}
          role="switch"
          aria-checked={isBlueTheme}
          onClick={() => setIsBlueTheme((current) => !current)}
        >
          <span className="theme-switch-thumb"></span>
        </button>
      </label>

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
              aria-label={isMenuOpen ? 'Sluit navigatiemenu' : 'Open navigatiemenu'}
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
