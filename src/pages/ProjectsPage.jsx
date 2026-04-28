import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';
import farmforwardImage from '../assets/projects/farmforward.png';
import fridgemateImage from '../assets/projects/fridgemate.png';
import vrcadeImage from '../assets/projects/vrcade.png';
import webdesignPortfolioImage from '../assets/projects/webdesignportfolio.png';
import skilSemesterOneImage from '../assets/projects/skil-semester-1.png';
import poutrelImage from '../assets/projects/poutrel.png';
import tsnuffeltjeImage from '../assets/projects/tsnuffeltje.png';

const projects = [
  {
    id: 'project-5',
    image: skilSemesterOneImage,
    alt: 'Screenshot of the semester 1 analysis and design data model',
    label: 'Second year / Semester 1',
    title: 'Analytic Report',
    visualTitle: 'SKIL S1',
    visualMeta: 'Analysis, design and data model',
    details: [
      {
        title: 'Context',
        text: 'During the first semester of my second year in Applied Computer Science, we worked on a larger SKIL project in which analysis and design were central. The project was not only about building ideas, but about documenting a complete solution with clear requirements, flows, and a structured data model.',
      },
      {
        title: 'What I did',
        text: 'I contributed to the analysis, helped structure the documentation, and translated requirements into a concrete design. That included thinking about entities, relationships, user flows, and how the database and application structure should support the project.',
      },
      {
        title: 'Result',
        text: 'The end result was a complete analysis and design deliverable, including a detailed data model that could serve as a strong starting point for implementation. It showed that I can help shape a project before development starts and keep complex information structured.',
      },
      {
        title: 'What I learned',
        text: 'I learned how important a strong analysis phase is for later development. I also improved in documenting decisions, modeling data clearly, and turning abstract requirements into a technical foundation a team can build on.',
      },
    ],
  },
  {
    id: 'project-6',
    image: poutrelImage,
    alt: 'Screenshot of the Poutrel fitness and coaching platform',
    label: 'Second year / Semester 2',
    title: 'Poutrel',
    visualTitle: 'TALL Stack',
    visualMeta: 'Fitness and coaching platform',
    details: [
      {
        title: 'Context',
        text: 'In the second semester of my second year in Applied Computer Science, we received an analysis and design report from another group and had to turn it into a working TALL stack website. The concept became Poutrel, a fitness and coaching platform where users can book lessons, reserve material, and follow training schedules.',
      },
      {
        title: 'What I did',
        text: 'I worked on translating the handed-over analysis into a functional web application, paying attention to structure, usability, and consistency with the original concept. That meant helping build both the interface and the underlying application logic within the TALL stack.',
      },
      {
        title: 'Result',
        text: 'The result was a working TALL stack website with a clean dashboard-style interface and clear user flows for reservations and training follow-up.',
        link: 'https://poutrel.lepuort.be/',
        linkLabel: 'View Poutrel',
      },
      {
        title: 'What I learned',
        text: 'I learned how to build from someone else\'s analysis instead of starting from my own concept. That improved my ability to read requirements carefully, make technical decisions within constraints, and collaborate in a workflow that feels closer to a real client handover.',
      },
    ],
  },
  {
    id: 'project-7',
    image: tsnuffeltjeImage,
    alt: "Screenshot of the T'Snuffeltje dog grooming salon website",
    label: 'Personal project',
    title: "T'Snuffeltje",
    visualTitle: 'Client Website',
    visualMeta: 'Warm brand site for a dog grooming salon',
    details: [
      {
        title: 'Context',
        text: "This project started when a friend of my mother asked for a website for her dog grooming salon. The goal was to create a warm and personal site that matches the calm atmosphere of the salon and gives visitors immediate trust.",
      },
      {
        title: 'What I did',
        text: 'I designed and built the website, and recently updated it so it better reflects the skills I have developed since the first version. I focused on soft visual styling, better content structure, and a presentation that feels caring and professional for a real client.',
      },
      {
        title: 'Result',
        text: 'The result is a live website for a real business with a strong visual identity, service-focused content, and a design that fits the salon atmosphere shown in the photography and typography.',
        link: 'https://tsnuffeltje.vercel.app/',
        linkLabel: "View T'Snuffeltje",
      },
      {
        title: 'What I learned',
        text: 'I learned a lot about designing for a real client, translating feedback into concrete improvements, and matching the visual style of a website to the personality of a business. It also helped me grow in ownership and polish.',
      },
    ],
  },
  {
    id: 'project-1',
    image: farmforwardImage,
    alt: 'Screenshot of project FarmForward',
    label: 'Required project',
    title: 'FarmForward',
    details: [
      {
        title: 'Context',
        text: 'FarmForward was created around the story of Juma, a 54-year-old farmer in rural Tanzania who depends on weather, soil conditions, and timing to support his family. The challenge was that many small farmers face unpredictable weather, limited information about planting or harvesting, and little access to smartphones or internet-based tools.',
      },
      {
        title: 'What I did',
        text: 'I helped shape the concept of an AI-powered SMS assistant that gives farmers simple, practical support through numbered options. The system was designed to stay accessible on even the most basic phones, without requiring internet access.',
      },
      {
        title: 'Result',
        text: 'The result was a clear proof of concept for an AI SMS assistant that can provide weather forecasts, pesticide advice, and storm alerts in a simple menu-based flow. It showed how technology can be made useful and accessible for farmers who are often excluded from digital tools.',
      },
      {
        title: 'What I learned',
        text: 'I learned how important accessibility and simplicity are when designing digital solutions. I also improved my ability to think from the user perspective and to translate a real-world problem into a practical technical concept.',
      },
    ],
  },
  {
    id: 'project-2',
    image: fridgemateImage,
    alt: 'Screenshot of project FridgeMate',
    label: 'Required project',
    title: 'FridgeMate',
    details: [
      {
        title: 'Context',
        text: 'FridgeMate is a proof of concept developed to help users track what is in their fridge. The goal was to reduce food waste, save money, and make it easier to decide what to cook.',
      },
      {
        title: 'What I did',
        text: 'I worked on the concept and front-end of the application. I also pitched the idea, where I developed and found my own voice in presenting.',
      },
      {
        title: 'Result',
        text: 'The result is a simple and clear prototype that demonstrates how fridge inventory tracking can work in practice.',
        link: 'https://fridgemate-tds.netlify.app/',
        linkLabel: 'View FridgeMate',
      },
      {
        title: 'What I learned',
        text: 'I learned how to turn an idea into a working proof of concept. I also improved my pitching and communication skills.',
      },
    ],
  },
  {
    id: 'project-3',
    image: vrcadeImage,
    alt: 'Screenshot of project VRCade',
    label: 'Required project',
    title: 'VRCade',
    details: [
      {
        title: 'Context',
        text: 'For the Fullstack Essentials course, I developed a front-end for a hypothetical VR arcade. The goal was to create a modern and engaging website that reflects a VR experience.',
      },
      {
        title: 'What I did',
        text: 'I designed and built the entire front-end using HTML, CSS, and JavaScript. I focused on clear structure and a futuristic design.',
      },
      {
        title: 'Result',
        text: 'The result is a responsive website with a modern look that fits a VR arcade.',
        link: 'https://vrcade.netlify.app/',
        linkLabel: 'View VRCade',
      },
      {
        title: 'What I learned',
        text: 'I improved my front-end development and responsive design skills. I also learned the importance of UX/UI in creating a good user experience.',
      },
    ],
  },
  {
    id: 'project-4',
    image: webdesignPortfolioImage,
    alt: 'Screenshot of web design portfolio project',
    label: 'Required project',
    title: 'Webdesign Portfolio',
    details: [
      {
        title: 'Context',
        text: 'For the Webdesign Essentials course, I created a website to improve my web design skills. The goal was to build a visually appealing and well-structured personal website.',
      },
      {
        title: 'What I did',
        text: 'I designed and developed the website from scratch, focusing on layout, styling, and usability. I experimented with different design elements to improve the overall look and feel.',
      },
      {
        title: 'Result',
        text: 'The result is a personal gaming-themed website that showcases my design skills and style. The site is hosted via a student webhosting platform.',
        link: 'https://siebegaming.sinners.be/',
        linkLabel: 'View Website',
      },
      {
        title: 'What I learned',
        text: 'I improved my web design and layout skills through hands-on practice. I also gained a better understanding of visual design and user experience.',
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
            <h1 className="page-title">My projects</h1>
            <p className="page-text">
              This page brings together course projects and personal work that show how I grow in
              analysis, design, development, and collaboration. For each project, I describe the
              context, my contribution, the result, and what I learned from it.
            </p>
          </div>
        </section>

        <section>
          <div className="container projects-grid">
            {projects.map((project, index) => (
              <div key={project.title}>
                <article className="project-card scroll-reveal" id={project.id}>
                  {project.image && project.details.some((detail) => detail.link) ? (
                    <a
                      className="project-visual project-image"
                      href={project.details.find((detail) => detail.link)?.link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.title}`}
                    >
                      <img src={project.image} alt={project.alt} />
                    </a>
                  ) : project.image ? (
                    <div className="project-visual project-image">
                      <img src={project.image} alt={project.alt} />
                    </div>
                  ) : project.details.some((detail) => detail.link) ? (
                    <a
                      className="project-visual project-placeholder"
                      href={project.details.find((detail) => detail.link)?.link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.title}`}
                    >
                      <strong>{project.visualTitle ?? project.title}</strong>
                      {project.visualMeta && <span>{project.visualMeta}</span>}
                    </a>
                  ) : (
                    <div className="project-visual project-placeholder" aria-hidden="true">
                      <strong>{project.visualTitle ?? project.title}</strong>
                      {project.visualMeta && <span>{project.visualMeta}</span>}
                    </div>
                  )}
                  <div className="project-body">
                    <span className="card-label">{project.label}</span>
                    <h2>{project.title}</h2>
                    {project.details.map((detail) => (
                      <div key={detail.title} className="project-detail">
                        <strong>{detail.title}</strong>
                        <p>{detail.text}</p>
                        {detail.link && (
                          <p>
                            <a href={detail.link} target="_blank" rel="noreferrer">
                              {detail.linkLabel}
                            </a>
                          </p>
                        )}
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
                    <span>Scroll further</span>
                    <span className="project-scroll-arrow"></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <PageFooter text="&copy; 2026 Siebe - Projects" linkTo="/about" linkLabel="Go to About" />
    </>
  );
}

export default ProjectsPage;
