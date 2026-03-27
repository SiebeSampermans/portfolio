import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import HexGridBackground from '../components/HexGridBackground';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About me' },
  { to: '/projects', label: 'Projects / Achievements' },
  { to: '/cv', label: 'CV' },
];

function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <HexGridBackground />
      <div className="page-glow page-glow-left"></div>
      <div className="page-glow page-glow-right"></div>

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
