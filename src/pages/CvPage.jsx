import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';

function CvPage() {
  usePageTitle('Siebe | CV');
  useScrollReveal();

  return (
    <>
      <main>
        <section className="page-intro">
          <div className="container">
            <span className="eyebrow">Curriculum Vitae</span>
            <h1 className="page-title">CV download</h1>
            <p className="page-text">
              De opdracht vraagt een aparte CV-pagina met een downloadbare PDF. Zet jouw bestand
              in deze map met de naam <code>CV_siebe.pdf</code>.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/CV_siebe.pdf" download>
                Download CV_siebe.pdf
              </a>
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="info-item scroll-reveal">
              <strong>Belangrijk</strong>
              <span>
                De downloadlink werkt zodra je jouw echte CV als <code>CV_siebe.pdf</code> in
                dezelfde map zet als deze bestanden.
              </span>
            </div>
          </div>
        </section>
      </main>

      <PageFooter
        text="© 2026 Siebe - CV"
        linkTo="/projects"
        linkLabel="Bekijk mijn projecten"
      />
    </>
  );
}

export default CvPage;
