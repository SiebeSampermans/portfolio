import { useState } from 'react';
import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';
import aboutPhoto from '../assets/about-photo.jpg';

function AboutPage() {
  const [cursorState, setCursorState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
  });

  usePageTitle('Siebe | About me');
  useScrollReveal();

  const handlePhotoPointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    setCursorState({
      isVisible: true,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  };

  const handlePhotoPointerLeave = () => {
    setCursorState((current) => ({ ...current, isVisible: false }));
  };

  return (
    <>
      <main>
        <section className="page-intro">
          <div className="container">
            <span className="eyebrow scroll-reveal">About me</span>
            <h1 className="page-title scroll-reveal">Who I am</h1>
            <p className="page-text scroll-reveal">
              On this page, I briefly explain who I am, what motivates me, and where I want to
              keep growing.
            </p>
          </div>
        </section>

        <section>
          <div className="container about-grid">
            <div className="about-photo scroll-reveal">
              <div
                className="photo-placeholder photo-cursor-zone scroll-reveal"
                onMouseMove={handlePhotoPointerMove}
                onMouseLeave={handlePhotoPointerLeave}
              >
                <div className="scan-frame"></div>
                <img className="about-photo-image" src={aboutPhoto} alt="Portrait photo of Siebe" />
                <div
                  className={`photo-cursor-follow${cursorState.isVisible ? ' is-visible' : ''}`}
                  style={{
                    left: `${cursorState.x}px`,
                    top: `${cursorState.y}px`,
                  }}
                  aria-hidden="true"
                >
                  <span>Siebe Sampermans</span>
                </div>
              </div>
            </div>

            <div className="about-content scroll-reveal">
              <h2 className="section-title scroll-reveal">A short introduction</h2>
              <p className="scroll-reveal">
                My name is Siebe and I am a motivated Applied Computer Science student. I am
                socially minded, naturally curious, and I enjoy working together with others to
                create strong solutions.
              </p>
              <p className="scroll-reveal">
                Outside school, I spend time on football, beatboxing, gaming, building PCs, and
                social activities with friends. These hobbies not only show what I enjoy, but also
                say something about my discipline, creativity, and sense of teamwork.
              </p>
              <p className="scroll-reveal">
                I chose Applied Computer Science because I enjoy working with computers and because
                this program fits perfectly with the IT and development direction I followed in
                secondary school. From the moment I noticed I could quickly spot bugs in code, I
                knew IT was truly the right fit for me.
              </p>
            </div>
          </div>
        </section>

        <section className="future-section">
          <div className="container">
            <div className="section-header scroll-reveal">
              <span className="eyebrow">Future</span>
              <h2>My dreams and ambitions</h2>
              <p>
                In the long term, I want to use technology in a way that is clear and useful for
                other people. AI interests me the most right now, but application development is
                definitely still a direction in which I see myself growing.
              </p>
            </div>

            <div className="future-panel scroll-reveal">
              <div className="future-lead scroll-reveal">
                <span className="card-label">Vision</span>
                <h3>I want to make technology human and practical.</h3>
                <p>
                  For me, a strong IT career is not only technical. I want to build solutions that
                  are clear, impactful, and socially meaningful as well.
                </p>
              </div>

              <div className="future-grid-alt">
                <div className="info-item future-card scroll-reveal">
                  <strong>Short term</strong>
                  <span>Keep growing in AI, application development, and project-based work.</span>
                </div>
                <div className="info-item future-card scroll-reveal">
                  <strong>Long term</strong>
                  <span>
                    Become an IT professional who contributes to society in a clear and human way.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="skills-section">
          <div className="container">
            <div className="stack-showcase">
              <div className="stack-intro scroll-reveal">
                <span className="card-label">Tech stack</span>
                <h3>Tools and technologies I have already worked with</h3>
                <p>
                  Throughout my education and projects, I have already built experience with
                  different languages, frameworks, tools, and platforms. That broad foundation
                  helps me switch flexibly between front-end, back-end, and technical
                  infrastructure.
                </p>
              </div>

              <div className="stack-groups">
                <div className="stack-card scroll-reveal">
                  <strong>Programming languages</strong>
                  <div className="stack-tags">
                    <span>Python</span>
                    <span>C#</span>
                    <span>Java</span>
                    <span>JavaScript</span>
                    <span>.NET</span>
                    <span>React</span>
                    <span>Alpine</span>
                  </div>
                </div>

                <div className="stack-card scroll-reveal">
                  <strong>Back-end</strong>
                  <div className="stack-tags">
                    <span>PHP</span>
                    <span>MongoDB</span>
                    <span>FastAPI</span>
                    <span>SQL</span>
                    <span>SQLite</span>
                  </div>
                </div>

                <div className="stack-card scroll-reveal">
                  <strong>Front-end</strong>
                  <div className="stack-tags">
                    <span>HTML</span>
                    <span>CSS</span>
                    <span>Bootstrap</span>
                    <span>Tailwind</span>
                    <span>Livewire</span>
                    <span>Laravel</span>
                  </div>
                </div>

                <div className="stack-card scroll-reveal">
                  <strong>Cloud and deployment</strong>
                  <div className="stack-tags">
                    <span>Docker</span>
                    <span>Azure</span>
                  </div>
                </div>

                <div className="stack-card scroll-reveal">
                  <strong>Networking</strong>
                  <div className="stack-tags">
                    <span>Cisco</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="soft-skills-intro scroll-reveal">
              <span className="card-label">Soft skills</span>
              <h3>My soft skills make the difference</h3>
              <p>
                Besides technical knowledge, it is especially my soft skills that help me stand
                out. They allow me not only to build a project, but also to present it clearly,
                think in a human-centered way, and collaborate effectively.
              </p>
            </div>

            <div className="pillars-grid soft-skills-grid">
              <div className="pillar-card scroll-reveal">
                <span className="card-label">Soft skills</span>
                <h3>Presenting</h3>
                <p>
                  I can communicate information in a structured way and present a project clearly
                  to others.
                </p>
              </div>
              <div className="pillar-card pillar-card-accent scroll-reveal">
                <span className="card-label">Soft skills</span>
                <h3>Empathy and client focus</h3>
                <p>
                  I show empathy, think along with people, and can clearly inform a non-technical
                  client about a project.
                </p>
              </div>
              <div className="pillar-card scroll-reveal">
                <span className="card-label">Soft skills</span>
                <h3>Initiative and teamwork</h3>
                <p>
                  I take initiative when needed and enjoy working in a team to build a strong
                  result step by step.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageFooter text="&copy; 2026 Siebe - About me" linkTo="/cv" linkLabel="Go to my CV" />
    </>
  );
}

export default AboutPage;
