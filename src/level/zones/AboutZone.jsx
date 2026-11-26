import { useLanguage } from '../../i18n/LanguageContext';
import aboutPhoto from '../../assets/about-photo.jpg';
import { Card, Checkpoint, Seg } from '../parts';

const technicalSkills = [
  { name: 'Python', category: 'Programming' },
  { name: 'C#', category: 'Programming' },
  { name: 'Java', category: 'Programming' },
  { name: 'JavaScript', category: 'Programming' },
  { name: '.NET', category: 'Framework' },
  { name: 'React', category: 'Framework' },
  { name: 'PHP', category: 'Back-end' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'HTML', category: 'Front-end' },
  { name: 'CSS', category: 'Front-end' },
  { name: 'Docker', category: 'Cloud' },
  { name: 'Cisco', category: 'Networking' },
  { name: 'SAP', category: 'Enterprise' },
  { name: 'Qlik Sense', category: 'Data & BI' },
  { name: 'Microsoft 365', category: 'Low-code' },
  { name: 'BPMN', category: 'Process' },
];

const SOFT_OBSTACLES = ['spikes', 'block-spike', 'spike', 'stairs'];

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
};

const sameText = (a, b) =>
  (a || '').toLowerCase().replace(/[^a-z0-9]/g, '') === (b || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function SpotifyPlayer({ spotify, t }) {
  const { status, track } = spotify;
  const isPlaying = status === 'ready' && Boolean(track?.isPlaying);
  const showAlbum = Boolean(track?.album) && !sameText(track.album, track.title);
  const progress =
    track?.durationMs && track?.progressMs != null
      ? Math.min((track.progressMs / track.durationMs) * 100, 100)
      : 0;

  return (
    <Card className={`card-player${isPlaying ? ' is-playing' : ''}`}>
      <div className="player-top">
        <span className="mono-label">{t.liveListening}</span>
        <span className={`pill${isPlaying ? ' is-on' : ''}${status === 'error' ? ' is-error' : ''}`}>
          {status === 'loading'
            ? t.statusLoading
            : status === 'error'
              ? t.statusOffline
              : isPlaying
                ? t.statusListening
                : t.statusNotPlaying}
        </span>
      </div>

      <div className="player-body" aria-live="polite">
        <div className="player-disc" aria-hidden={!(status === 'ready' && track?.albumImageUrl)}>
          {status === 'ready' && track?.albumImageUrl ? (
            <img src={track.albumImageUrl} alt={t.artworkFor(track.title)} />
          ) : (
            <span className="player-disc-empty"></span>
          )}
        </div>
        <div className="player-copy">
          {status === 'loading' && (
            <>
              <strong>{t.checkingSpotify}</strong>
              <span>{t.loadingTrack}</span>
            </>
          )}
          {status === 'error' && (
            <>
              <strong>{t.notSetUp}</strong>
              <span>{t.notSetUpText}</span>
            </>
          )}
          {status === 'ready' && track && (
            <>
              <strong title={track.title}>{track.title}</strong>
              {track.artist && <span title={track.artist}>{track.artist}</span>}
              {showAlbum && <span className="player-album" title={track.album}>{track.album}</span>}
            </>
          )}
        </div>
      </div>

      {status === 'ready' && track && (
        isPlaying ? (
          <div className="player-progress">
            <div
              className="player-track"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax={track.durationMs || 0}
              aria-valuenow={track.progressMs || 0}
              aria-label={t.trackProgress}
            >
              <span style={{ width: `${progress}%` }}></span>
            </div>
            <div className="player-times">
              <span>{formatTime(track.progressMs || 0)}</span>
              <span>{formatTime(track.durationMs || 0)}</span>
            </div>
          </div>
        ) : (
          <p className="player-idle">{t.idleText}</p>
        )
      )}
    </Card>
  );
}

function AboutZone({ spotify }) {
  const { t: translation } = useLanguage();
  const t = translation.about;
  const level = translation.level;

  return (
    <section className="zone zone-about" aria-labelledby="about-title">
      <Checkpoint id="about" index={2} label={level.sections.about} word={level.checkpoint} />

      <Seg className="seg-heading" obstacle="spikes">
        <div className="big-sign">
          <span className="mono-label">{t.eyebrow}</span>
          <h2 id="about-title">{t.heading}</h2>
          <p>{t.intro}</p>
        </div>
      </Seg>

      <Seg className="seg-photo" obstacle="block">
        <figure className="photo-card">
          <img src={aboutPhoto} alt={t.photoAlt} />
          <figcaption>Siebe Sampermans</figcaption>
        </figure>
      </Seg>

      {t.paragraphs.map((paragraph, index) => (
        <Seg key={index} className="seg-text" obstacle={index === 1 ? 'stairs' : 'spike'}>
          <Card className="card-text">
            {index === 0 && <h3>{t.introTitle}</h3>}
            <span className="mono-label">0{index + 1} / 0{t.paragraphs.length}</span>
            <p>{paragraph}</p>
          </Card>
        </Seg>
      ))}

      <Seg className="seg-music" obstacle="spikes">
        <div className="big-sign">
          <span className="mono-label">Spotify</span>
          <h3>{t.spotifyTitle}</h3>
          <p>{t.spotifyText1}</p>
          <p className="muted">{t.spotifyText2}</p>
        </div>
      </Seg>

      <Seg className="seg-player" obstacle="block-spike">
        <SpotifyPlayer spotify={spotify} t={t} />
      </Seg>

      <Seg className="seg-future" obstacle="tall">
        <Card className="card-future">
          <span className="mono-label">{t.futureEyebrow}</span>
          <h3>{t.futureTitle}</h3>
          <p>{t.futureText}</p>
        </Card>
      </Seg>

      <Seg className="seg-vision" obstacle="spike">
        <div className="vision">
          <span className="mono-label">{t.visionLabel}</span>
          <blockquote>{t.visionTitle}</blockquote>
          <p>{t.visionText}</p>
          <div className="vision-goals">
            <div>
              <strong>{t.shortTerm}</strong>
              <span>{t.shortTermText}</span>
            </div>
            <div>
              <strong>{t.longTerm}</strong>
              <span>{t.longTermText}</span>
            </div>
          </div>
        </div>
      </Seg>

      <Seg className="seg-stack" obstacle="stairs">
        <div className="stack">
          <div className="stack-intro">
            <span className="mono-label">{t.stackLabel}</span>
            <h3>{t.stackTitle}</h3>
            <p>{t.stackText}</p>
          </div>
          <ul className="stack-grid" aria-label={t.skillsCarousel}>
            {technicalSkills.map((skill, index) => (
              <li key={skill.name} style={{ '--i': index }}>
                <strong>{skill.name}</strong>
                <span>{t.skillCategories[skill.category] ?? skill.category}</span>
              </li>
            ))}
          </ul>
        </div>
      </Seg>

      <Seg className="seg-soft-intro" obstacle="spike">
        <div className="big-sign">
          <span className="mono-label">{t.softSkillsLabel}</span>
          <h3>{t.softSkillsTitle}</h3>
          <p>{t.softSkillsText}</p>
        </div>
      </Seg>

      {t.softSkills.map((skill, index) => (
        <Seg key={skill.title} className="seg-soft" obstacle={SOFT_OBSTACLES[index]}>
          <Card className="card-soft">
            <span className="soft-index">{String(index + 1).padStart(2, '0')}</span>
            <h4>{skill.title}</h4>
            <p>{skill.text}</p>
          </Card>
        </Seg>
      ))}
    </section>
  );
}

export default AboutZone;
