import { useMemo, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import farmforwardImage from '../../assets/projects/farmforward.webp';
import fridgemateImage from '../../assets/projects/fridgemate.webp';
import vrcadeImage from '../../assets/projects/vrcade.webp';
import webdesignPortfolioImage from '../../assets/projects/webdesignportfolio.webp';
import skilSemesterOneImage from '../../assets/projects/skil-semester-1.webp';
import poutrelImage from '../../assets/projects/poutrel.webp';
import tsnuffeltjeImage from '../../assets/projects/tsnuffeltje.webp';
import { Card, Checkpoint, Modal, Seg } from '../parts';

const projects = [
  { id: 'project-5', image: skilSemesterOneImage },
  { id: 'project-6', image: poutrelImage, link: 'https://poutrel.lepuort.be/' },
  { id: 'project-7', image: tsnuffeltjeImage, link: 'https://tsnuffeltje.vercel.app/' },
  { id: 'project-1', image: farmforwardImage },
  { id: 'project-2', image: fridgemateImage, link: 'https://fridgemate-tds.netlify.app/' },
  { id: 'project-3', image: vrcadeImage, link: 'https://vrcade.netlify.app/' },
  { id: 'project-4', image: webdesignPortfolioImage, link: 'https://siebegaming.sinners.be/' },
];

const detailKeys = ['context', 'did', 'result', 'learned'];

function ProjectsZone() {
  const { t: translation } = useLanguage();
  const t = translation.projects;
  const level = translation.level;
  const [openId, setOpenId] = useState(null);

  const items = useMemo(
    () => projects.map((project) => ({ ...project, ...t.items[project.id] })),
    [t],
  );
  const openProject = items.find((item) => item.id === openId);

  return (
    <section className="zone zone-projects" aria-labelledby="projects-title">
      <Checkpoint id="projects" index={3} label={level.sections.projects} word={level.checkpoint} />

      <Seg className="seg-heading" obstacle="block-spike">
        <div className="big-sign">
          <span className="mono-label">{t.eyebrow}</span>
          <h2 id="projects-title">{t.heading}</h2>
          <p>{t.intro}</p>
        </div>
      </Seg>

      {items.map((project, index) => (
        <Seg
          key={project.id}
          className="seg-project"
          obstacle={index % 2 ? 'spikes' : 'block'}
        >
          <Card as="article" className="card-project" id={project.id}>
            <div className="project-media">
              <img src={project.image} alt={project.alt} loading="lazy" />
              <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="project-info">
              <span className="mono-label">{project.label}</span>
              <h3>{project.title}</h3>
              <p>{project.context}</p>
              <div className="project-actions">
                <button type="button" className="btn btn-primary" onClick={() => setOpenId(project.id)}>
                  {level.details}
                </button>
                {project.link && (
                  <a className="btn btn-ghost" href={project.link} target="_blank" rel="noreferrer" aria-label={t.open(project.title)}>
                    {level.visit} ↗
                  </a>
                )}
              </div>
            </div>
          </Card>
        </Seg>
      ))}

      <Modal
        isOpen={Boolean(openProject)}
        onClose={() => setOpenId(null)}
        title={openProject?.title}
        closeLabel={level.close}
        className="modal-project"
      >
        {openProject && (
          <>
            <img className="modal-project-image" src={openProject.image} alt={openProject.alt} />
            <div className="modal-project-body">
              <span className="mono-label">{openProject.label}</span>
              <h3>{openProject.title}</h3>
              {detailKeys.map((key) => (
                <div className="modal-detail" key={key}>
                  <strong>{t.detailTitles[key]}</strong>
                  <p>{openProject[key]}</p>
                </div>
              ))}
              {openProject.link && (
                <a className="btn btn-primary" href={openProject.link} target="_blank" rel="noreferrer">
                  {openProject.linkLabel} ↗
                </a>
              )}
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}

export default ProjectsZone;
