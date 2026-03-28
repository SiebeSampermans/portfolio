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
            <h1 className="page-title scroll-reveal">Wie ik ben</h1>
            <p className="page-text scroll-reveal">
              Op deze pagina vertel ik kort wie ik ben, wat mij motiveert en waarin ik verder wil
              groeien.
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
                <img className="about-photo-image" src={aboutPhoto} alt="Portretfoto van Siebe" />
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
              <h2 className="section-title scroll-reveal">Intro over mezelf</h2>
              <p className="scroll-reveal">
                Mijn naam is Siebe en ik ben een gemotiveerde student Toegepaste Informatica. Ik
                ben sociaal ingesteld, nieuwsgierig van aard en ik werk graag samen met anderen om
                tot sterke oplossingen te komen.
              </p>
              <p className="scroll-reveal">
                Buiten school ben ik bezig met voetbal, beatbox, gamen, pc&apos;s bouwen en sociale
                activiteiten met vrienden. Dat zijn hobbies die niet alleen tonen wat ik leuk
                vind, maar ook iets zeggen over mijn discipline, creativiteit en teamgevoel.
              </p>
              <p className="scroll-reveal">
                Ik heb voor Toegepaste Informatica gekozen omdat ik graag met computers bezig ben
                en omdat deze richting perfect aansluit bij de IT- en ontwikkelingsrichting die ik
                in het middelbaar volgde. Vanaf het moment dat ik merkte dat ik bugs in code snel
                kon herkennen, wist ik dat IT echt bij mij paste.
              </p>
            </div>
          </div>
        </section>

        <section className="future-section">
          <div className="container">
            <div className="section-header scroll-reveal">
              <span className="eyebrow">Future</span>
              <h2>Mijn dromen en ambities</h2>
              <p>
                Op langere termijn wil ik technologie inzetten op een manier die duidelijk en
                nuttig is voor andere mensen. AI spreekt mij vandaag het meest aan, maar
                application development blijft zeker ook een richting waarin ik mezelf zie groeien.
              </p>
            </div>

            <div className="future-panel scroll-reveal">
              <div className="future-lead scroll-reveal">
                <span className="card-label">Vision</span>
                <h3>Ik wil technologie menselijk en bruikbaar maken.</h3>
                <p>
                  Voor mij is een sterke IT-carriere niet alleen technisch. Ik wil bouwen aan
                  oplossingen die duidelijk zijn, impact hebben en ook sociaal iets betekenen.
                </p>
              </div>

              <div className="future-grid-alt">
                <div className="info-item future-card scroll-reveal">
                  <strong>Korte termijn</strong>
                  <span>Verder groeien in AI, application development en projectmatig werken.</span>
                </div>
                <div className="info-item future-card scroll-reveal">
                  <strong>Lange termijn</strong>
                  <span>
                    Een IT-professional worden die een sociale en duidelijke bijdrage levert aan de
                    maatschappij.
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
                <h3>Tools en technologieen waar ik al mee gewerkt heb</h3>
                <p>
                  Doorheen mijn opleiding en projecten heb ik al ervaring opgebouwd met
                  verschillende talen, frameworks, tools en platformen. Die brede basis helpt me
                  om flexibel te schakelen tussen front-end, back-end en technische infrastructuur.
                </p>
              </div>

              <div className="stack-groups">
                <div className="stack-card scroll-reveal">
                  <strong>Programmeertalen</strong>
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
                  <strong>Cloud en deployment</strong>
                  <div className="stack-tags">
                    <span>Docker</span>
                    <span>Azure</span>
                  </div>
                </div>

                <div className="stack-card scroll-reveal">
                  <strong>Netwerk</strong>
                  <div className="stack-tags">
                    <span>Cisco</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="soft-skills-intro scroll-reveal">
              <span className="card-label">Soft skills</span>
              <h3>Mijn soft skills maken het verschil</h3>
              <p>
                Naast technische kennis zijn het vooral mijn soft skills die mij helpen
                uitblinken. Ze zorgen ervoor dat ik niet alleen een project kan bouwen, maar het
                ook duidelijk kan voorstellen, mensgericht kan denken en sterk kan samenwerken.
              </p>
            </div>

            <div className="pillars-grid soft-skills-grid">
              <div className="pillar-card scroll-reveal">
                <span className="card-label">Soft skills</span>
                <h3>Presenteren</h3>
                <p>
                  Ik kan informatie gestructureerd overbrengen en een project duidelijk voorstellen
                  aan anderen.
                </p>
              </div>
              <div className="pillar-card pillar-card-accent scroll-reveal">
                <span className="card-label">Soft skills</span>
                <h3>Empathie en klantgerichtheid</h3>
                <p>
                  Ik toon medeleven, denk mee met mensen en kan een niet-technische klant helder
                  informeren over een project.
                </p>
              </div>
              <div className="pillar-card scroll-reveal">
                <span className="card-label">Soft skills</span>
                <h3>Initiatief en teamwork</h3>
                <p>
                  Ik neem initiatief wanneer nodig en werk graag samen in groep om stap voor stap
                  tot een sterk resultaat te komen.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageFooter text="© 2026 Siebe - About me" linkTo="/cv" linkLabel="Ga naar Mijn Projecten" />
    </>
  );
}

export default AboutPage;
