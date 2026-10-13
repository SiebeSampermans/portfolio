import { useEffect, useMemo, useState } from 'react';
import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';
import { useLanguage } from '../i18n/LanguageContext';
import farmforwardImage from '../assets/projects/farmforward.png';
import fridgemateImage from '../assets/projects/fridgemate.png';
import vrcadeImage from '../assets/projects/vrcade.png';
import webdesignPortfolioImage from '../assets/projects/webdesignportfolio.png';
import skilSemesterOneImage from '../assets/projects/skil-semester-1.png';
import poutrelImage from '../assets/projects/poutrel.png';
import tsnuffeltjeImage from '../assets/projects/tsnuffeltje.png';

const projects = [
  { id: 'project-5', image: skilSemesterOneImage, visualTitle: 'SKIL S1' },
  {
    id: 'project-6',
    image: poutrelImage,
    visualTitle: 'TALL Stack',
    link: 'https://poutrel.lepuort.be/',
  },
  { id: 'project-7', image: tsnuffeltjeImage, link: 'https://tsnuffeltje.vercel.app/' },
  { id: 'project-1', image: farmforwardImage },
  { id: 'project-2', image: fridgemateImage, link: 'https://fridgemate-tds.netlify.app/' },
  { id: 'project-3', image: vrcadeImage, link: 'https://vrcade.netlify.app/' },
  { id: 'project-4', image: webdesignPortfolioImage, link: 'https://siebegaming.sinners.be/' },
];

const detailKeys = ['context', 'did', 'result', 'learned'];

const localizeProjects = (t) =>
  projects.map((project) => {
    const text = t.items[project.id];

    return {
      ...project,
      ...text,
      visualTitle: text.visualTitle ?? project.visualTitle,
      details: detailKeys.map((key) => ({
        key,
        title: t.detailTitles[key],
        text: text[key],
        ...(key === 'result' && project.link
          ? { link: project.link, linkLabel: text.linkLabel }
          : {}),
      })),
    };
  });

function ProjectsPage() {
  const [areProjectImagesReady, setAreProjectImagesReady] = useState(false);
  const { t: translation } = useLanguage();
  const t = translation.projects;
  const localizedProjects = useMemo(() => localizeProjects(t), [t]);

  usePageTitle(t.title);
  useScrollReveal({ withProjectCues: true });

  useEffect(() => {
    const imageSources = projects
      .map((project) => project.image)
      .filter((imageSource) => typeof imageSource === 'string' && imageSource.length > 0);

    setAreProjectImagesReady(false);

    if (imageSources.length === 0) {
      setAreProjectImagesReady(true);
      return undefined;
    }

    let isCancelled = false;
    let loadedImages = 0;

    const markImageAsReady = () => {
      loadedImages += 1;

      if (!isCancelled && loadedImages >= imageSources.length) {
        setAreProjectImagesReady(true);
      }
    };

    const preloadedImages = imageSources.map((source) => {
      const image = new Image();
      image.onload = markImageAsReady;
      image.onerror = markImageAsReady;
      image.src = source;

      if (image.complete) {
        image.onload = null;
        image.onerror = null;
        markImageAsReady();
      }

      return image;
    });

    return () => {
      isCancelled = true;
      preloadedImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, []);

  return (
    <>
      <main>
        <section className="page-intro">
          <div className="container">
            <span className="eyebrow">{t.eyebrow}</span>
            <h1 className="page-title">{t.heading}</h1>
            <p className="page-text">{t.intro}</p>
          </div>
        </section>

        <section>
          <div
            className={`container projects-grid-shell${
              areProjectImagesReady ? ' is-ready' : ' is-loading'
            }`}
          >
            {!areProjectImagesReady && (
              <div className="projects-loading" role="status" aria-live="polite">
                <span className="projects-loading-spinner" aria-hidden="true"></span>
                <span>{t.loading}</span>
              </div>
            )}

            <div className="projects-grid">
              {localizedProjects.map((project, index) => (
                <div key={project.id}>
                  <article className="project-card scroll-reveal" id={project.id}>
                    {project.image && project.details.some((detail) => detail.link) ? (
                      <a
                        className="project-visual project-image"
                        href={project.details.find((detail) => detail.link)?.link}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t.open(project.title)}
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
                        aria-label={t.open(project.title)}
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
                        <div key={detail.key} className="project-detail">
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
                      <span>{t.scrollFurther}</span>
                      <span className="project-scroll-arrow"></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PageFooter text={t.footer} linkTo="/about" linkLabel={t.footerLink} />
    </>
  );
}

export default ProjectsPage;
