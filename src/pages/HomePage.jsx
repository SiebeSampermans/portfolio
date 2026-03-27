import { Link } from 'react-router-dom';
import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';

function HomePage() {
  usePageTitle('Siebe | Home');
  useScrollReveal({ threshold: 0.35, rootMargin: '0px 0px -140px 0px' });

  return (
    <>
      <main>
        <section className="hero page-hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Showcase Portfolio</span>
              <h1 className="hero-title-slide">
                <span className="hero-title-first">Siebe</span>
                <span className="hero-title-last">Sampermans</span>
              </h1>
              <p className="hero-text">
                Ik ben Siebe, een gemotiveerde student Toegepaste Informatica met een passie voor
                technologie, creativiteit en teamwork.
              </p>
              <p className="hero-text">
                Op deze website toon ik wie ik ben, wat ik doe en welke projecten en vaardigheden
                ik verder wil uitbouwen richting stage en werk.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/about">
                  Meer over mij
                </Link>
                <Link className="btn btn-secondary" to="/projects">
                  Bekijk projecten
                </Link>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-inner">
                <div className="scoreboard-top">
                  <span className="card-label">Professional Focus</span>
                </div>
                <div className="feature-list">
                  <div className="info-item">
                    <strong>Wie ben ik?</strong>
                    <span>
                      Een sociale, nieuwsgierige en sportieve student met een technische basis.
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Wat doe ik?</strong>
                    <span>
                      Ik studeer Toegepaste Informatica en werk aan projecten waarin techniek en
                      creativiteit samenkomen.
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Waarom dit portfolio?</strong>
                    <span>
                      Om een professionele eerste showcase op te bouwen die klaar is voor stage en
                      verdere groei.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container">
            <div className="section-header stats-header scroll-reveal">
              <span className="eyebrow">Snapshot</span>
              <h2>In een oogopslag</h2>
              <p>Vier kernwoorden die samenvatten hoe ik werk, leer en waar ik naartoe wil.</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Persoonlijk</span>
                <strong>Sociaal</strong>
                <p>Ik werk graag samen, denk mee en haal energie uit contact met andere mensen.</p>
              </div>
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Mindset</span>
                <strong>Nieuwsgierig</strong>
                <p>Ik wil begrijpen hoe systemen werken en blijf graag nieuwe dingen bijleren.</p>
              </div>
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Interesse</span>
                <strong>Technologie</strong>
                <p>Pc&apos;s bouwen, development en AI spreken mij het sterkst aan.</p>
              </div>
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Doel</span>
                <strong>Stageklaar</strong>
                <p>
                  Dit portfolio is mijn eerste stap naar een sterke professionele showcase voor
                  3ITF.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageFooter
        text="© 2026 Siebe - Showcase portfolio"
        linkTo="/cv"
        linkLabel="Ga naar mijn CV-pagina"
      />
    </>
  );
}

export default HomePage;
