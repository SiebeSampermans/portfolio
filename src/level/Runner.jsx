import { forwardRef, useEffect, useState } from 'react';

export const RUNNER_COLORS = [
  { id: 'accent', value: 'var(--accent)' },
  { id: 'pink', value: '#ff5fd2' },
  { id: 'yellow', value: '#ffd84d' },
  { id: 'orange', value: '#ff8a3d' },
  { id: 'purple', value: '#b388ff' },
  { id: 'white', value: '#ffffff' },
];

export const RUNNER_FACES = ['letter', 'smile', 'cool', 'robot', 'angry', 'wink'];
export const RUNNER_HATS = ['none', 'cap', 'crown', 'party', 'headphones', 'beanie'];
export const RUNNER_TRAILS = ['line', 'squares', 'sparkles', 'rainbow', 'none'];
export const TRAIL_BITS = 12;

const DEFAULT_STYLE = { color: 'accent', face: 'letter', hat: 'none', trail: 'line' };
const STORAGE_KEY = 'runner-style';

const readStyle = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      color: RUNNER_COLORS.some((c) => c.id === saved.color) ? saved.color : DEFAULT_STYLE.color,
      face: RUNNER_FACES.includes(saved.face) ? saved.face : DEFAULT_STYLE.face,
      hat: RUNNER_HATS.includes(saved.hat) ? saved.hat : DEFAULT_STYLE.hat,
      trail: RUNNER_TRAILS.includes(saved.trail) ? saved.trail : DEFAULT_STYLE.trail,
    };
  } catch {
    return DEFAULT_STYLE;
  }
};

/** The visitor's block: colour, face, hat and trail, remembered in this browser. */
export function useRunnerStyle() {
  const [style, setStyle] = useState(() => (typeof window === 'undefined' ? DEFAULT_STYLE : readStyle()));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(style));
    } catch {
      // Storage can be unavailable (private mode); the choice then lasts for this visit only.
    }
  }, [style]);

  return [style, (patch) => setStyle((current) => ({ ...current, ...patch })), () => setStyle(DEFAULT_STYLE)];
}

export const colorValue = (id) => RUNNER_COLORS.find((c) => c.id === id)?.value ?? 'var(--accent)';

export function Face({ face }) {
  const ink = 'var(--ink)';

  switch (face) {
    case 'smile':
      return (
        <svg viewBox="0 0 100 100" className="runner-face">
          <rect x="24" y="28" width="14" height="18" rx="3" fill={ink} />
          <rect x="62" y="28" width="14" height="18" rx="3" fill={ink} />
          <path d="M26 62 Q50 84 74 62" fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round" />
        </svg>
      );
    case 'cool':
      return (
        <svg viewBox="0 0 100 100" className="runner-face">
          <path d="M14 30 H86 V40 L80 52 H58 L52 40 H48 L42 52 H20 L14 40 Z" fill={ink} />
          <rect x="22" y="34" width="12" height="4" fill="#fff" opacity="0.6" />
          <path d="M38 72 Q56 80 70 66" fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case 'robot':
      return (
        <svg viewBox="0 0 100 100" className="runner-face">
          <rect x="16" y="24" width="68" height="26" rx="8" fill={ink} />
          <circle cx="36" cy="37" r="6" fill="#ff5fd2" />
          <circle cx="64" cy="37" r="6" fill="#ff5fd2" />
          <rect x="26" y="62" width="48" height="16" rx="3" fill={ink} />
          <path d="M38 62 V78 M50 62 V78 M62 62 V78" stroke="var(--runner-color)" strokeWidth="4" />
        </svg>
      );
    case 'angry':
      return (
        <svg viewBox="0 0 100 100" className="runner-face">
          <path d="M18 24 L42 34 M82 24 L58 34" stroke={ink} strokeWidth="8" strokeLinecap="round" />
          <rect x="26" y="38" width="13" height="14" rx="2" fill={ink} />
          <rect x="61" y="38" width="13" height="14" rx="2" fill={ink} />
          <rect x="30" y="66" width="40" height="9" rx="3" fill={ink} />
        </svg>
      );
    case 'wink':
      return (
        <svg viewBox="0 0 100 100" className="runner-face">
          <rect x="24" y="28" width="14" height="18" rx="3" fill={ink} />
          <path d="M60 38 H78" stroke={ink} strokeWidth="8" strokeLinecap="round" />
          <path d="M28 64 Q50 80 72 60" fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round" />
          <path d="M56 70 Q62 84 68 68" fill="#ff5fd2" />
        </svg>
      );
    default:
      return <span className="runner-letter">S</span>;
  }
}

export function Hat({ hat }) {
  switch (hat) {
    case 'cap':
      return (
        <svg viewBox="0 0 100 60" className="runner-hat">
          <path d="M14 48 Q16 10 52 10 Q84 10 84 48 Z" fill="#ff3d5a" stroke="var(--ink)" strokeWidth="6" />
          <path d="M60 46 H100 V54 H56 Z" fill="#ff3d5a" stroke="var(--ink)" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="50" cy="10" r="5" fill="var(--ink)" />
        </svg>
      );
    case 'crown':
      return (
        <svg viewBox="0 0 100 60" className="runner-hat">
          <path d="M14 54 L10 14 L32 32 L50 6 L68 32 L90 14 L86 54 Z" fill="#ffd84d" stroke="var(--ink)" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="50" cy="38" r="6" fill="#ff5fd2" />
        </svg>
      );
    case 'party':
      return (
        <svg viewBox="0 0 100 70" className="runner-hat runner-hat-tall">
          <path d="M26 66 L50 8 L74 66 Z" fill="#b388ff" stroke="var(--ink)" strokeWidth="6" strokeLinejoin="round" />
          <path d="M36 42 L64 50 M31 56 L69 64" stroke="#ffd84d" strokeWidth="6" />
          <circle cx="50" cy="8" r="8" fill="#ff5fd2" stroke="var(--ink)" strokeWidth="4" />
        </svg>
      );
    case 'headphones':
      return (
        <svg viewBox="0 0 100 100" className="runner-hat runner-hat-wrap">
          <path d="M10 56 Q10 6 50 6 Q90 6 90 56" fill="none" stroke="var(--ink)" strokeWidth="9" />
          <rect x="0" y="46" width="20" height="34" rx="7" fill="#ff5fd2" stroke="var(--ink)" strokeWidth="5" />
          <rect x="80" y="46" width="20" height="34" rx="7" fill="#ff5fd2" stroke="var(--ink)" strokeWidth="5" />
        </svg>
      );
    case 'beanie':
      return (
        <svg viewBox="0 0 100 60" className="runner-hat">
          <path d="M14 50 Q14 12 50 12 Q86 12 86 50 Z" fill="#3d7bff" stroke="var(--ink)" strokeWidth="6" />
          <rect x="10" y="42" width="80" height="14" rx="4" fill="#ffffff" stroke="var(--ink)" strokeWidth="5" />
          <circle cx="50" cy="10" r="8" fill="#ffffff" stroke="var(--ink)" strokeWidth="4" />
        </svg>
      );
    default:
      return null;
  }
}

/** The block itself; the engine moves it through `ref`. */
export const RunnerBlock = forwardRef(function RunnerBlock({ style, className = '' }, ref) {
  return (
    <span
      className={`runner ${className}`}
      ref={ref}
      style={{ '--runner-color': colorValue(style.color) }}
    >
      <Face face={style.face} />
      <Hat hat={style.hat} />
    </span>
  );
});
