import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';
import aboutPhoto from '../assets/about-photo.jpg';
import { useLanguage } from '../i18n/LanguageContext';

const technicalSkills = [
  { name: 'Python', category: 'Programming' },
  { name: 'C#', category: 'Programming' },
  { name: 'Java', category: 'Programming' },
  { name: 'JavaScript', category: 'Programming' },
  { name: '.NET', category: 'Framework' },
  { name: 'React', category: 'Framework' },
  { name: 'Alpine', category: 'Framework' },
  { name: 'PHP', category: 'Back-end' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'FastAPI', category: 'Back-end' },
  { name: 'SQL', category: 'Database' },
  { name: 'SQLite', category: 'Database' },
  { name: 'HTML', category: 'Front-end' },
  { name: 'CSS', category: 'Front-end' },
  { name: 'Bootstrap', category: 'Front-end' },
  { name: 'Tailwind', category: 'Front-end' },
  { name: 'Livewire', category: 'Front-end' },
  { name: 'Laravel', category: 'Framework' },
  { name: 'Docker', category: 'Cloud' },
  { name: 'Azure', category: 'Cloud' },
  { name: 'Cisco', category: 'Networking' },
];

const formatPlaybackTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

function AboutPage() {
  const [cursorState, setCursorState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
  });
  const { spotifyNowPlaying: nowPlayingState } = useOutletContext();

  const { t: translation } = useLanguage();
  const t = translation.about;

  usePageTitle(t.title);
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

  const {
    status: nowPlayingStatus,
    track: nowPlayingTrack,
    errorMessage: nowPlayingErrorMessage,
  } = nowPlayingState;
  const isTrackPlaying = nowPlayingTrack?.isPlaying;
  const playbackProgress =
    nowPlayingTrack?.durationMs && nowPlayingTrack?.progressMs != null
      ? Math.min((nowPlayingTrack.progressMs / nowPlayingTrack.durationMs) * 100, 100)
      : 0;

  return (
    <>
      <main>
        <section className="page-intro">
          <div className="container">
            <span className="eyebrow scroll-reveal">{t.eyebrow}</span>
            <h1 className="page-title scroll-reveal">{t.heading}</h1>
            <p className="page-text scroll-reveal">{t.intro}</p>
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
                <img className="about-photo-image" src={aboutPhoto} alt={t.photoAlt} />
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
              <h2 className="section-title scroll-reveal">{t.introTitle}</h2>
              {t.paragraphs.map((paragraph) => (
                <p className="scroll-reveal" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="spotify-section">
          <div className="container spotify-layout">
            <div className="spotify-intro scroll-reveal">
              <span className="eyebrow">Spotify</span>
              <h2>{t.spotifyTitle}</h2>
              <p>{t.spotifyText1}</p>
              <p>{t.spotifyText2}</p>
            </div>

            <article className="spotify-now-playing-card scroll-reveal">
              <div className="spotify-now-playing-head">
                <span className="card-label">{t.liveListening}</span>
                <span
                  className={`spotify-live-pill${
                    isTrackPlaying ? ' is-active' : ''
                  }${nowPlayingStatus === 'error' ? ' is-error' : ''}`}
                >
                  {nowPlayingStatus === 'loading'
                    ? t.statusLoading
                    : nowPlayingStatus === 'error'
                      ? t.statusOffline
                      : isTrackPlaying
                        ? t.statusListening
                        : t.statusNotPlaying}
                </span>
              </div>

              {nowPlayingStatus === 'loading' && (
                <div className="spotify-now-playing-state" role="status" aria-live="polite">
                  <div className="spotify-now-playing-artwork spotify-now-playing-artwork-placeholder"></div>
                  <div className="spotify-now-playing-copy">
                    <strong>{t.checkingSpotify}</strong>
                    <span>{t.loadingTrack}</span>
                  </div>
                </div>
              )}

              {nowPlayingStatus === 'error' && (
                <div className="spotify-now-playing-state spotify-now-playing-state-error">
                  <div className="spotify-now-playing-artwork spotify-now-playing-artwork-placeholder"></div>
                  <div className="spotify-now-playing-copy">
                    <strong>{t.notSetUp}</strong>
                    <span>{t.notSetUpText}</span>
                    {nowPlayingErrorMessage && (
                      <span className="spotify-now-playing-error-detail">{nowPlayingErrorMessage}</span>
                    )}
                  </div>
                </div>
              )}

              {nowPlayingStatus === 'ready' && nowPlayingTrack && (
                <div className="spotify-now-playing-body">
                  <div className="spotify-now-playing-primary">
                    {nowPlayingTrack.albumImageUrl ? (
                      <img
                        className="spotify-now-playing-artwork"
                        src={nowPlayingTrack.albumImageUrl}
                        alt={t.artworkFor(nowPlayingTrack.title)}
                      />
                    ) : (
                      <div className="spotify-now-playing-artwork spotify-now-playing-artwork-placeholder"></div>
                    )}

                    <div className="spotify-now-playing-copy">
                      <strong>{nowPlayingTrack.title}</strong>
                      {nowPlayingTrack.artist && <span>{nowPlayingTrack.artist}</span>}
                      {nowPlayingTrack.album && (
                        <span className="spotify-now-playing-album">{nowPlayingTrack.album}</span>
                      )}
                    </div>
                  </div>

                  <div className="spotify-now-playing-secondary">
                    {isTrackPlaying ? (
                      <>
                        <div
                          className="spotify-progress"
                          role="progressbar"
                          aria-valuemin="0"
                          aria-valuemax={nowPlayingTrack.durationMs || 0}
                          aria-valuenow={nowPlayingTrack.progressMs || 0}
                          aria-label={t.trackProgress}
                        >
                          <span
                            className="spotify-progress-bar"
                            style={{ width: `${playbackProgress}%` }}
                          ></span>
                        </div>
                        <div className="spotify-progress-meta">
                          <span>{formatPlaybackTime(nowPlayingTrack.progressMs || 0)}</span>
                          <span>{formatPlaybackTime(nowPlayingTrack.durationMs || 0)}</span>
                        </div>
                      </>
                    ) : (
                      <p className="spotify-now-playing-idle">{t.idleText}</p>
                    )}
                  </div>
                </div>
              )}
            </article>
          </div>
        </section>

        <section className="future-section">
          <div className="container">
            <div className="section-header scroll-reveal">
              <span className="eyebrow">{t.futureEyebrow}</span>
              <h2>{t.futureTitle}</h2>
              <p>{t.futureText}</p>
            </div>

            <div className="future-panel scroll-reveal">
              <div className="future-lead scroll-reveal">
                <span className="card-label">{t.visionLabel}</span>
                <h3>{t.visionTitle}</h3>
                <p>{t.visionText}</p>
              </div>

              <div className="future-grid-alt">
                <div className="info-item future-card scroll-reveal">
                  <strong>{t.shortTerm}</strong>
                  <span>{t.shortTermText}</span>
                </div>
                <div className="info-item future-card scroll-reveal">
                  <strong>{t.longTerm}</strong>
                  <span>{t.longTermText}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="skills-section">
          <div className="container">
            <div className="stack-showcase">
              <div className="stack-intro scroll-reveal">
                <span className="card-label">{t.stackLabel}</span>
                <h3>{t.stackTitle}</h3>
                <p>{t.stackText}</p>
              </div>

              <div className="skills-carousel scroll-reveal" aria-label={t.skillsCarousel}>
                <div className="skills-carousel-track">
                  {[0, 1].map((loopIndex) => (
                    <div
                      className="skills-carousel-group"
                      key={`skills-loop-${loopIndex}`}
                      aria-hidden={loopIndex === 1}
                    >
                      {technicalSkills.map((skill) => (
                        <article className="skill-chip" key={`${loopIndex}-${skill.name}`}>
                          <span className="skill-chip-name">{skill.name}</span>
                          <span className="skill-chip-category">
                            {t.skillCategories[skill.category] ?? skill.category}
                          </span>
                        </article>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="soft-skills-intro scroll-reveal">
              <span className="card-label">{t.softSkillsLabel}</span>
              <h3>{t.softSkillsTitle}</h3>
              <p>{t.softSkillsText}</p>
            </div>

            <div className="pillars-grid soft-skills-grid">
              {t.softSkills.map((skill, index) => (
                <div
                  className={`pillar-card${index === 1 ? ' pillar-card-accent' : ''} scroll-reveal`}
                  key={index}
                >
                  <span className="card-label">{t.softSkillsLabel}</span>
                  <h3>{skill.title}</h3>
                  <p>{skill.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PageFooter text={t.footer} linkTo="/cv" linkLabel={t.footerLink} />
    </>
  );
}

export default AboutPage;
