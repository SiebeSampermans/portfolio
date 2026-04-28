import { useEffect, useState } from 'react';
import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';

const PAPER_RETRACT_DURATION_MS = 3200;

function CvPage() {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isRetracting, setIsRetracting] = useState(false);
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' ? document.body.dataset.theme || 'blue' : 'blue',
  );

  usePageTitle('Siebe | CV');
  useScrollReveal();

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const syncTheme = () => {
      setTheme(document.body.dataset.theme || 'blue');
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isPreviewing) {
      setIsRetracting(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsRetracting(false);
    }, PAPER_RETRACT_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isPreviewing]);

  const handlePowerToggle = () => {
    setIsPreviewing((current) => {
      if (current) {
        setIsRetracting(true);
      }

      return !current;
    });
  };

  const cvFile = theme === 'green' ? '/CV_groen.pdf' : '/CV_blauw.pdf';
  const cvPreviewSrc = `${cvFile}#toolbar=0&navpanes=0&scrollbar=1`;

  return (
    <>
      <main>
        <section className="page-intro">
          <div className="container">
            <span className="eyebrow">Curriculum Vitae</span>
            <h1 className="page-title">CV download</h1>
            <p className="page-text">
              This page contains a dedicated CV section with a downloadable PDF. You can download
              it directly or preview it on the page itself.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={cvFile} download>
                Download CV
              </a>
            </div>
          </div>
        </section>

        <section>
          <div className="container cv-preview-section">
            <div
              className={`cv-printer-assembly${
                isPreviewing || isRetracting ? ' is-paper-active' : ''
              }${isPreviewing ? ' is-previewing' : ''}`}
            >
              <div className="cv-printer-anchor">
                <div className={`cv-printer-card${isPreviewing ? ' is-printing' : ''}`}>
                  <button
                    type="button"
                    className={`cv-printer-power${isPreviewing ? ' is-active' : ''}`}
                    aria-label={isPreviewing ? 'Turn printer off' : 'Turn printer on'}
                    onClick={handlePowerToggle}
                  >
                    <span className="cv-printer-led" aria-hidden="true"></span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 3.4v7.4" />
                      <path d="M7.05 5.75A8.2 8.2 0 1 0 16.95 5.75" />
                    </svg>
                  </button>

                  <div className="cv-printer-top">
                    <div>
                      <span className="card-label">Preview Station</span>
                      <h2>Interactive CV printer</h2>
                      <p>
                        Press the power button and watch your CV print out below the slot.
                      </p>
                    </div>
                  </div>

                  <div className="cv-printer-slot-wrap" aria-hidden="true">
                    <div className="cv-printer-slot"></div>
                  </div>
                </div>

                <div
                  className={`cv-paper-stage${isPreviewing || isRetracting ? ' is-active' : ''}${
                    isPreviewing ? ' is-visible' : ''
                  }`}
                >
                  <div className="cv-paper-sheet">
                    <div className="cv-paper-toolbar">
                      <span className="cv-paper-dot"></span>
                      <span className="cv-paper-dot"></span>
                      <span className="cv-paper-dot"></span>
                      <span className="cv-paper-label">CV Preview</span>
                    </div>
                    <iframe
                      className="cv-paper-frame"
                      src={cvPreviewSrc}
                      title="CV preview"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageFooter text="(c) 2026 Siebe - CV" linkTo="/" linkLabel="Back to home" />
    </>
  );
}

export default CvPage;
