import { useEffect, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Checkpoint, Modal, Seg } from '../parts';

const MOBILE_QUERY = '(max-width: 640px)';

function CvZone({ isBlue }) {
  const { t: translation } = useLanguage();
  const t = translation.cv;
  const level = translation.level;
  const [isOpen, setIsOpen] = useState(false);
  const [loadedPdf, setLoadedPdf] = useState(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(query.matches);
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const cvFile = isBlue ? '/CV_blauw.pdf' : '/CV_groen.pdf';
  const cvPreviewSrc = `${cvFile}#toolbar=0&navpanes=0&scrollbar=1`;
  // Mobile browsers crop or refuse inline PDFs, so phones get an image of the page.
  const cvPreviewImage = cvFile.replace('.pdf', '-preview.jpg');

  return (
    <section className="zone zone-cv" aria-labelledby="cv-title">
      <Checkpoint id="cv" index={4} label={level.sections.cv} word={level.checkpoint} />

      <Seg className="seg-heading" obstacle="spikes">
        <div className="big-sign">
          <span className="mono-label">{t.eyebrow}</span>
          <h2 id="cv-title">{t.heading}</h2>
          <p>{t.intro}</p>
          <a className="btn btn-primary" href={cvFile} download="CV_Siebe_Sampermans.pdf">
            {t.download} ↓
          </a>
        </div>
      </Seg>

      <Seg className="seg-powerup" obstacle="stairs">
        <div className="powerup">
          <button
            type="button"
            className="powerup-block"
            aria-label={t.printerOn}
            onClick={() => setIsOpen(true)}
          >
            <span aria-hidden="true">CV</span>
          </button>
          <div className="powerup-copy">
            <span className="mono-label">{t.stationLabel}</span>
            <h3>{t.printerTitle}</h3>
            <p>{t.printerText}</p>
            <button type="button" className="btn btn-ghost" onClick={() => setIsOpen(true)}>
              {t.printerOn}
            </button>
          </div>
        </div>
      </Seg>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t.previewTitle} closeLabel={level.close} className="modal-cv">
        <div className="modal-cv-head">
          <span className="mono-label">{t.previewLabel}</span>
          <a className="btn btn-primary" href={cvFile} download="CV_Siebe_Sampermans.pdf">
            {t.download} ↓
          </a>
        </div>
        {isMobile ? (
          <a href={cvFile} target="_blank" rel="noreferrer">
            <img className="cv-sheet" src={cvPreviewImage} alt={t.previewTitle} />
          </a>
        ) : (
          // The image shows instantly; the PDF viewer fades in over it once it has loaded.
          <div className="cv-sheet cv-sheet-stack">
            <img src={cvPreviewImage} alt="" aria-hidden="true" />
            <iframe
              key={cvPreviewSrc}
              className={loadedPdf === cvPreviewSrc ? 'is-loaded' : undefined}
              src={cvPreviewSrc}
              title={t.previewTitle}
              onLoad={() => setLoadedPdf(cvPreviewSrc)}
            ></iframe>
          </div>
        )}
      </Modal>
    </section>
  );
}

export default CvZone;
