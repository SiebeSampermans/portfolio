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
                I am Siebe, a motivated Applied Computer Science student with a passion for
                technology, creativity, and teamwork.
              </p>
              <p className="hero-text">
                On this website, I show who I am, what I do, and which projects and skills I want
                to keep developing toward internships and professional work.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/about">
                  More about me
                </Link>
                <Link className="btn btn-secondary" to="/projects">
                  View projects
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
                    <strong>Who am I?</strong>
                    <span>
                      A social, curious, and sporty student with a solid technical foundation.
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>What do I do?</strong>
                    <span>
                      I study Applied Computer Science and work on projects where technology and
                      creativity come together, while also helping communication between clients and
                      project teams.
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Why this portfolio?</strong>
                    <span>
                      To build a first professional showcase that is ready for internships and
                      future growth.
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
              <h2>At a glance</h2>
              <p>Four keywords that summarize how I work, learn, and where I want to go.</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Personal</span>
                <strong>Social</strong>
                <p>I enjoy working with others, thinking along, and gaining energy from human connection.</p>
              </div>
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Mindset</span>
                <strong>Curious</strong>
                <p>I want to understand how systems work and I enjoy constantly learning new things.</p>
              </div>
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Interest</span>
                <strong>Technology</strong>
                <p>Building PCs, development, and AI are the areas that excite me most.</p>
              </div>
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Goal</span>
                <strong>Internship-ready</strong>
                <p>
                  This portfolio is my first step toward a strong professional showcase for 3ITF.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageFooter text="&copy; 2026 Siebe - Showcase portfolio" linkTo="/cv" linkLabel="Go to my CV" />
    </>
  );
}

export default HomePage;
