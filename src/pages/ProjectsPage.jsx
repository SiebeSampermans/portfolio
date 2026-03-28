import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';

const projects = [
  {
    image: 'https://siebe-sampermans.vercel.app/images/projects/farmforward.png',
    alt: 'Screenshot of the FarmForward project',
    label: 'Required project',
    title: 'SKIL2 project semester 1',
    details: [
      {
        title: 'Context',
        text: 'Briefly explain what the project was, for which course or goal it was created, and why it was important.',
      },
      {
        title: 'What I did',
        text: 'Describe your personal contribution clearly, especially if this was a group project.',
      },
      {
        title: 'Result',
        text: 'Explain what was built or delivered in the end and optionally add a visual.',
      },
      {
        title: 'What I learned',
        text: 'Describe the hard skills and soft skills you gained from this project.',
      },
    ],
  },
  {
    id: 'project-2',
    image: 'https://siebe-sampermans.vercel.app/images/projects/fridgemate.png',
    alt: 'Screenshot of the FridgeMate project',
    label: 'Required project',
    title: 'SKIL2 project semester 2',
    details: [
      {
        title: 'Context',
        text: 'Briefly explain what the project was, what the objective was, and in which context it took place.',
      },
      {
        title: 'What I did',
        text: 'Describe your personal tasks, choices, and responsibilities within the project.',
      },
      {
        title: 'Result',
        text: 'Explain what the final result was and how the project was completed.',
      },
      {
        title: 'What I learned',
        text: 'Mention which technical and professional skills you developed further.',
      },
    ],
  },
  {
    id: 'project-3',
    image: 'https://siebe-sampermans.vercel.app/images/projects/vrcade.png',
    alt: 'Screenshot of the VRCade project',
    label: 'Extra project',
    title: 'Quickcode',
    details: [
      {
        title: 'Context',
        text: 'In my first year, I worked on Quickcode, a website designed to help people learn coding in a playful and competitive way.',
      },
      {
        title: 'What I did',
        text: 'I contributed to the concept and development of the website and thought about how learning to code could become more motivating.',
      },
      {
        title: 'Result',
        text: 'The result was an interactive website where learning, competition, and user experience come together.',
      },
      {
        title: 'What I learned',
        text: 'I learned to think more carefully about development, user experience, creativity, and building something with real added value.',
      },
    ],
  },
  {
    id: 'project-4',
    image: 'https://siebe-sampermans.vercel.app/images/projects/webdesignportfolio.png',
    alt: 'Screenshot of the portfolio web design project',
    label: 'Extra project',
    title: 'Showcase portfolio',
    details: [
      {
        title: 'Context',
        text: 'For this portfolio, I am building a first showcase website that looks professional and is ready for internships, projects, and further growth.',
      },
      {
        title: 'What I did',
        text: 'I worked on the structure, content, and presentation so the website clearly shows who I am and what I can already do.',
      },
      {
        title: 'Result',
        text: 'The result is a clear website with fixed navigation, an about page, a projects page, and a separate CV page.',
      },
      {
        title: 'What I learned',
        text: 'I learned to structure information more professionally, align content with requirements, and present my profile more clearly.',
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
            <span className="eyebrow">Projects</span>
            <h1 className="page-title">My projects</h1>
            <p className="page-text">
              Here I present the required SKIL2 projects together with two extra projects. For each
              project, I describe the context, my contribution, the result, and what I learned from
              it.
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
                    <span>Scroll down</span>
                    <span className="project-scroll-arrow"></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <PageFooter text="(c) 2026 Siebe - Projects" linkTo="/contact" linkLabel="Go to contact" />
    </>
  );
}

export default ProjectsPage;
