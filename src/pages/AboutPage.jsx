import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';
import aboutPhoto from '../assets/about-photo.jpg';

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
            <span className="eyebrow scroll-reveal">About me</span>
            <h1 className="page-title scroll-reveal">Who I am</h1>
            <p className="page-text scroll-reveal">
              On this page, I briefly explain who I am, what motivates me, and where I want to
              keep growing.
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
                <img className="about-photo-image" src={aboutPhoto} alt="Portrait photo of Siebe" />
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
              <h2 className="section-title scroll-reveal">A short introduction</h2>
              <p className="scroll-reveal">
                My name is Siebe and I am a motivated Applied Computer Science student. I am
                socially minded, naturally curious, and I enjoy working together with others to
                create strong solutions.
              </p>
              <p className="scroll-reveal">
                Outside school, I spend time on football, beatboxing, gaming, building PCs, and
                social activities with friends. These hobbies not only show what I enjoy, but also
                say something about my discipline, creativity, and sense of teamwork.
              </p>
              <p className="scroll-reveal">
                I chose Applied Computer Science because I enjoy working with computers and because
                this program fits perfectly with the IT and development direction I followed in
                secondary school. From the moment I noticed I could quickly spot bugs in code, I
                knew IT was truly the right fit for me.
              </p>
            </div>
          </div>
        </section>

        <section className="spotify-section">
          <div className="container spotify-layout">
            <div className="spotify-intro scroll-reveal">
              <span className="eyebrow">Spotify</span>
              <h2>Music is a big part of my lifestyle</h2>
              <p>
                I listen to a lot of music, and it is genuinely a big part of how I live day to
                day. It helps me through thick and thin, keeps me focused, gives me energy, and is
                always there whether I want to relax, work, or reset my mind.
              </p>
              <p>
                The live block on the right gives a quick snapshot of what is currently setting the
                tone for my day.
              </p>
            </div>

            <article className="spotify-now-playing-card scroll-reveal">
              <div className="spotify-now-playing-head">
                <span className="card-label">Live listening</span>
                <span
                  className={`spotify-live-pill${
                    isTrackPlaying ? ' is-active' : ''
                  }${nowPlayingStatus === 'error' ? ' is-error' : ''}`}
                >
                  {nowPlayingStatus === 'loading'
                    ? 'Loading'
                    : nowPlayingStatus === 'error'
                      ? 'Offline'
                      : isTrackPlaying
                        ? 'Listening now'
                        : 'Not playing'}
                </span>
              </div>

              {nowPlayingStatus === 'loading' && (
                <div className="spotify-now-playing-state" role="status" aria-live="polite">
                  <div className="spotify-now-playing-artwork spotify-now-playing-artwork-placeholder"></div>
                  <div className="spotify-now-playing-copy">
                    <strong>Checking Spotify...</strong>
                    <span>Loading the current track.</span>
                  </div>
                </div>
              )}

              {nowPlayingStatus === 'error' && (
                <div className="spotify-now-playing-state spotify-now-playing-state-error">
                  <div className="spotify-now-playing-artwork spotify-now-playing-artwork-placeholder"></div>
                  <div className="spotify-now-playing-copy">
                    <strong>Spotify connection is not set up yet.</strong>
                    <span>
                      Add your Spotify app credentials and refresh token to show live listening
                      here.
                    </span>
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
                        alt={`Artwork for ${nowPlayingTrack.title}`}
                      />
                    ) : (
                      <div className="spotify-now-playing-artwork spotify-now-playing-artwork-placeholder"></div>
                    )}

                    <div className="spotify-now-playing-copy">
                      <strong>{nowPlayingTrack.title}</strong>
                      <span>{nowPlayingTrack.artist}</span>
                      <span className="spotify-now-playing-album">{nowPlayingTrack.album}</span>
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
                          aria-label="Current track progress"
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
                      <p className="spotify-now-playing-idle">
                        Nothing is currently playing, but this card will update automatically when
                        Spotify starts.
                      </p>
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
              <span className="eyebrow">Future</span>
              <h2>My dreams and ambitions</h2>
              <p>
                In the long term, I want to use technology in a way that is clear and useful for
                other people. AI interests me the most right now, but application development is
                definitely still a direction in which I see myself growing.
              </p>
            </div>

            <div className="future-panel scroll-reveal">
              <div className="future-lead scroll-reveal">
                <span className="card-label">Vision</span>
                <h3>I want to make technology human and practical.</h3>
                <p>
                  For me, a strong IT career is not only technical. I want to build solutions that
                  are clear, impactful, and socially meaningful as well.
                </p>
              </div>

              <div className="future-grid-alt">
                <div className="info-item future-card scroll-reveal">
                  <strong>Short term</strong>
                  <span>Keep growing in AI, application development, and project-based work.</span>
                </div>
                <div className="info-item future-card scroll-reveal">
                  <strong>Long term</strong>
                  <span>
                    Become an IT professional who contributes to society in a clear and human way.
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
                <h3>Tools and technologies I have already worked with</h3>
                <p>
                  Throughout my education and projects, I have already built experience with
                  different languages, frameworks, tools, and platforms. That broad foundation
                  helps me switch flexibly between front-end, back-end, and technical
                  infrastructure.
                </p>
              </div>

              <div className="skills-carousel scroll-reveal" aria-label="Technical skills carousel">
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
                          <span className="skill-chip-category">{skill.category}</span>
                        </article>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="soft-skills-intro scroll-reveal">
              <span className="card-label">Soft skills</span>
              <h3>My soft skills make the difference</h3>
              <p>
                Besides technical knowledge, it is especially my soft skills that help me stand
                out. They allow me not only to build a project, but also to present it clearly,
                think in a human-centered way, and collaborate effectively.
              </p>
            </div>

            <div className="pillars-grid soft-skills-grid">
              <div className="pillar-card scroll-reveal">
                <span className="card-label">Soft skills</span>
                <h3>Presenting</h3>
                <p>
                  I can communicate information in a structured way and present a project clearly
                  to others.
                </p>
              </div>
              <div className="pillar-card pillar-card-accent scroll-reveal">
                <span className="card-label">Soft skills</span>
                <h3>Empathy and client focus</h3>
                <p>
                  I show empathy, think along with people, and can clearly inform a non-technical
                  client about a project.
                </p>
              </div>
              <div className="pillar-card scroll-reveal">
                <span className="card-label">Soft skills</span>
                <h3>Initiative and teamwork</h3>
                <p>
                  I take initiative when needed and enjoy working in a team to build a strong
                  result step by step.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PageFooter text="&copy; 2026 Siebe - About me" linkTo="/cv" linkLabel="Go to my CV" />
    </>
  );
}

export default AboutPage;
