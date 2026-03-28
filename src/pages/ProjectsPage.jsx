import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';

const projects = [
  {
    image: 'https://siebe-sampermans.vercel.app/images/projects/farmforward.png',
    alt: 'Screenshot van project FarmForward',
    label: 'Verplicht project',
    title: 'SKIL2 project semester 1',
    details: [
      {
        title: 'Context',
        text: 'Vul hier kort in wat het project was, voor welk vak of doel het gemaakt werd en waarom het belangrijk was.',
      },
      {
        title: 'Wat ik gedaan heb',
        text: 'Beschrijf hier heel concreet jouw eigen bijdrage, zeker als het om groepswerk ging.',
      },
      {
        title: 'Resultaat',
        text: 'Noteer wat er uiteindelijk gebouwd of opgeleverd werd en voeg eventueel een beeld toe.',
      },
      {
        title: 'Wat ik geleerd heb',
        text: 'Beschrijf hier de hard skills en soft skills die je uit dit project hebt meegenomen.',
      },
    ],
  },
  {
    id: 'project-2',
    image: 'https://siebe-sampermans.vercel.app/images/projects/fridgemate.png',
    alt: 'Screenshot van project FridgeMate',
    label: 'Verplicht project',
    title: 'SKIL2 project semester 2',
    details: [
      {
        title: 'Context',
        text: 'Vul hier kort in wat het project was, wat de doelstelling was en in welke context het plaatsvond.',
      },
      {
        title: 'Wat ik gedaan heb',
        text: 'Beschrijf jouw persoonlijke taken, keuzes en verantwoordelijkheden binnen het project.',
      },
      {
        title: 'Resultaat',
        text: 'Leg uit wat het eindresultaat was en hoe het project uiteindelijk werd afgewerkt.',
      },
      {
        title: 'Wat ik geleerd heb',
        text: 'Vermeld hier welke technische en professionele vaardigheden je verder hebt ontwikkeld.',
      },
    ],
  },
  {
    id: 'project-3',
    image: 'https://siebe-sampermans.vercel.app/images/projects/vrcade.png',
    alt: 'Screenshot van project VRCade',
    label: 'Extra project',
    title: 'Quickcode',
    details: [
      {
        title: 'Context',
        text: 'In het eerste jaar maakte ik Quickcode, een website om mensen op een speelse en competitieve manier te helpen leren coderen.',
      },
      {
        title: 'Wat ik gedaan heb',
        text: 'Ik werkte mee aan het concept en de uitwerking van de website en dacht na over hoe leren coderen motiverender gemaakt kon worden.',
      },
      {
        title: 'Resultaat',
        text: 'Het resultaat was een interactieve website waarin leren, competitie en gebruikservaring samenkomen.',
      },
      {
        title: 'Wat ik geleerd heb',
        text: 'Ik leerde beter nadenken over development, gebruikservaring, creativiteit en het bouwen van iets met echte meerwaarde.',
      },
    ],
  },
  {
    id: 'project-4',
    image: 'https://siebe-sampermans.vercel.app/images/projects/webdesignportfolio.png',
    alt: 'Screenshot van webdesign portfolio project',
    label: 'Extra project',
    title: 'Showcase portfolio',
    details: [
      {
        title: 'Context',
        text: 'Voor 3ITF bouw ik een eerste showcase portfolio dat professioneel oogt en klaar is voor stage, projecten en verdere groei.',
      },
      {
        title: 'Wat ik gedaan heb',
        text: 'Ik werkte de structuur, inhoud en presentatie uit zodat de website toont wie ik ben en wat ik al kan.',
      },
      {
        title: 'Resultaat',
        text: 'Het resultaat is een duidelijke HTML-website met een vaste navigatie, een about-pagina, projectenpagina en aparte CV-pagina.',
      },
      {
        title: 'Wat ik geleerd heb',
        text: 'Ik leerde informatie professioneler structureren, inhoud afstemmen op requirements en mijn profiel beter presenteren.',
      },
    ],
  },
];

function ProjectsPage() {
  usePageTitle('Siebe | Projects');
  useScrollReveal({ withProjectCues: true });

  return (
    <>
      <main>
        <section className="page-intro">
          <div className="container">
            <span className="eyebrow">Projects / Achievements</span>
            <h1 className="page-title">Mijn projecten</h1>
            <p className="page-text">
              Volgens de minimum requirements toon ik hier de verplichte SKIL2-projecten en twee
              extra projecten. Per project beschrijf ik de context, mijn bijdrage, het resultaat
              en wat ik eruit geleerd heb.
            </p>
          </div>
        </section>

        <section>
          <div className="container projects-grid">
            {projects.map((project, index) => (
              <div key={project.title}>
                <article className="project-card scroll-reveal" id={project.id}>
                  <div className="project-visual project-image">
                    <img src={project.image} alt={project.alt} />
                  </div>
                  <div className="project-body">
                    <span className="card-label">{project.label}</span>
                    <h2>{project.title}</h2>
                    {project.details.map((detail) => (
                      <div key={detail.title} className="project-detail">
                        <strong>{detail.title}</strong>
                        <p>{detail.text}</p>
                      </div>
                    ))}
                  </div>
                </article>

                {index < projects.length - 1 && (
                  <div
                    className="project-scroll-cue scroll-reveal"
                    aria-hidden="true"
                    data-cue-for={projects[index + 1].id}
                  >
                    <span>Scroll verder</span>
                    <span className="project-scroll-arrow"></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <PageFooter
        text="© 2026 Siebe - Projects"
        linkTo="/about"
        linkLabel="Ga naar Cv"
      />
    </>
  );
}

export default ProjectsPage;
