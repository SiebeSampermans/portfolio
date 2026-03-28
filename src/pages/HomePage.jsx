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
                I&apos;m Siebe, a motivated Applied Computer Science student with a strong passion
                for technology, creativity, and teamwork.
              </p>
              <p className="hero-text">
                This website shows who I am, what I do, and which projects and skills I want to
                keep developing as I work toward internships and future opportunities.
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
                      creativity come together, along with communication between the client and the
                      project team.
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Why this portfolio?</strong>
                    <span>
                      To build a first professional showcase that is ready for internships and
                      further growth.
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
              <p>Four key traits that summarize how I work, learn, and where I want to go.</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Personal</span>
                <strong>Social</strong>
                <p>I enjoy collaborating, thinking along, and gaining energy from working with others.</p>
              </div>
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Mindset</span>
                <strong>Curious</strong>
                <p>I want to understand how systems work and I enjoy continuously learning new things.</p>
              </div>
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Interest</span>
                <strong>Technology</strong>
                <p>Building PCs, development, and AI are the areas that interest me most.</p>
              </div>
              <div className="stat-card scroll-reveal">
                <span className="stat-card-label">Goal</span>
                <strong>Internship-ready</strong>
                <p>This portfolio is my first step toward a strong professional showcase.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageFooter
        text="(c) 2026 Siebe - Showcase Portfolio"
        linkTo="/cv"
        linkLabel="Go to my CV page"
      />
    </>
  );
}

export default HomePage;
