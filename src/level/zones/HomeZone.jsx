import { useLanguage } from '../../i18n/LanguageContext';
import { Card, Checkpoint, Seg } from '../parts';

const STAT_OBSTACLES = ['spike', 'block', 'spikes', 'stairs'];

function HomeZone({ onNavigate, canPlay }) {
  const { t: translation } = useLanguage();
  const t = translation.home;
  const level = translation.level;

  return (
    <section className="zone zone-home" aria-labelledby="home-title">
      <Checkpoint id="home" index={1} label={level.sections.home} word={level.checkpoint} />

      <Seg className="seg-hero">
        <div className="hero">
          <span className="mono-label">{t.eyebrow}</span>
          <h1 id="home-title" className="hero-name">
            <span>Siebe</span>
            <span className="hero-name-outline">Sampermans</span>
          </h1>
          <div className="hero-intro">
            <p>{t.intro1}</p>
            <p>{t.intro2}</p>
          </div>
          <div className="hero-actions">
            <span className="start-hint">
              <span className="start-key" aria-hidden="true">↓</span>
              <span className="start-desktop">{level.start}</span>
              <span className="start-mobile">{level.runHint}</span>
            </span>
            <button type="button" className="btn btn-ghost" onClick={() => onNavigate('projects')}>
              {level.skipTo} →
            </button>
          </div>
          {canPlay && (
            <div className="play-hint">
              <span className="keys" aria-hidden="true">
                <kbd>←</kbd>
                <kbd>↑</kbd>
                <kbd>→</kbd>
              </span>
              <span>
                <strong>{level.playTitle}</strong>
                {level.playHint}
              </span>
            </div>
          )}
        </div>
      </Seg>

      <Seg className="seg-focus" obstacle="spike">
        <Card className="card-focus">
          <span className="mono-label">{t.focusLabel}</span>
          <ol className="focus-list">
            {t.focus.map((item, index) => (
              <li key={item.title}>
                <span className="focus-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </Seg>

      <Seg className="seg-stats-intro" obstacle="block">
        <div className="big-sign">
          <span className="mono-label">{t.statsEyebrow}</span>
          <h2>{t.statsTitle}</h2>
          <p>{t.statsText}</p>
        </div>
      </Seg>

      {t.stats.map((stat, index) => (
        <Seg key={index} className="seg-stat" obstacle={STAT_OBSTACLES[index]}>
          <Card className={`card-stat card-stat-${index}`}>
            <span className="mono-label">{stat.label}</span>
            <strong>{stat.title}</strong>
            <p>{stat.text}</p>
          </Card>
        </Seg>
      ))}
    </section>
  );
}

export default HomeZone;
