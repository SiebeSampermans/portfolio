import { Link } from 'react-router-dom';
import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';
import { useLanguage } from '../i18n/LanguageContext';

function HomePage() {
  const { t: translation } = useLanguage();
  const t = translation.home;

  usePageTitle(t.title);
  useScrollReveal({ threshold: 0.35, rootMargin: '0px 0px -140px 0px' });

  return (
    <>
      <main>
        <section className="hero page-hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">{t.eyebrow}</span>
              <h1 className="hero-title-slide">
                <span className="hero-title-first">Siebe</span>
                <span className="hero-title-last">Sampermans</span>
              </h1>
              <p className="hero-text">{t.intro1}</p>
              <p className="hero-text">{t.intro2}</p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/about">
                  {t.moreAboutMe}
                </Link>
                <Link className="btn btn-secondary" to="/projects">
                  {t.viewProjects}
                </Link>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-inner">
                <div className="scoreboard-top">
                  <span className="card-label">{t.focusLabel}</span>
                </div>
                <div className="feature-list">
                  {t.focus.map((item) => (
                    <div className="info-item" key={item.title}>
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container">
            <div className="section-header stats-header scroll-reveal">
              <span className="eyebrow">{t.statsEyebrow}</span>
              <h2>{t.statsTitle}</h2>
              <p>{t.statsText}</p>
            </div>
            <div className="stats-grid">
              {t.stats.map((stat, index) => (
                <div className="stat-card scroll-reveal" key={index}>
                  <span className="stat-card-label">{stat.label}</span>
                  <strong>{stat.title}</strong>
                  <p>{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PageFooter text={t.footer} linkTo="/cv" linkLabel={t.footerLink} />
    </>
  );
}

export default HomePage;
