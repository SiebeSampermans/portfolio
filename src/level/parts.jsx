import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * One stretch of the course: content floats above the ground, obstacles sit in the lane.
 * Each named obstacle is swapped for a harder pattern from HARD_PATTERNS.
 */
export function Seg({ children, className = '', obstacle, lane, width }) {
  // Each obstacle name has a few variants; the segment's stable id picks one, so the course
  // looks the same on every visit but repeats less.
  const id = useId();
  const variants = obstacle ? HARD_PATTERNS[obstacle] || [obstacle] : [];
  const hash = Array.from(id).reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 9973, 7);
  const kinds = variants.length ? [variants[hash % variants.length]] : [];
  // Make sure the segment is wide enough for its obstacles plus room to land on either side.
  const laneWidth = kinds.reduce((sum, kind) => sum + obstacleWidth(kind), 0) + (kinds.length - 1) * 140;
  const style = {
    ...(width ? { '--seg-w': width } : {}),
    ...(kinds.length ? { '--lane-min': `${Math.ceil(laneWidth / 0.92) + 220}px` } : {}),
  };

  return (
    <div className={`seg ${className}`} style={style}>
      <div className="seg-body">{children}</div>
      <div className="seg-lane" aria-hidden="true">
        {lane}
        {kinds.length > 0 && (
          <span className="lane-obstacles">
            {kinds.map((kind, index) => (
              <Obstacle key={index} kind={kind} />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

// The course is a friendly platformer: no spikes, just hills to climb, pits to jump,
// mushroom platforms to land on, blocks to bump and bugs to stomp.
const HARD_PATTERNS = {
  spike: ['hill-step', 'hill-climb', 'hill-valley', 'hill-hump'],
  spikes: ['brick-row', 'hill-bricks'],
  block: ['pit', 'pit-hills', 'pit-plateau'],
  'block-spike': ['bug-patrol'],
  stairs: ['mushrooms'],
  tall: ['mushroom-hop'],
};

// Each obstacle is a row of columns; each column stacks parts from the ground up.
// `gap` lifts what comes after it into the air; `pit` is a hole in the ground (fall in and it's over);
// `hill-*` is raised ground; `stem-*` + `mushroom` is a mushroom platform you land on;
// `brick` breaks when you hit it powered up; `bonus` gives a bit, `power` gives a power chip;
// `coin` is a bit to grab, `bug` walks and can be squashed.
const OBSTACLE_COLUMNS = {
  block: [['block']],
  'hill-step': [['hill-1'], ['hill-2', 'gap-s', 'coin'], ['hill-1']],
  'hill-climb': [['hill-1'], ['hill-2'], ['hill-3', 'gap-s', 'coin'], ['hill-2n'], ['hill-1n']],
  'hill-valley': [['hill-2'], ['hill-1w', 'gap', 'coin'], ['hill-3n'], ['hill-1']],
  'hill-hump': [['hill-1n'], ['hill-2w', 'gap-s', 'coin'], ['hill-1n']],
  'hill-bricks': [['hill-1w'], ['hill-1', 'gap', 'brick'], ['hill-1', 'gap', 'bonus'], ['hill-1w']],
  'pit-hills': [['hill-2'], ['pit', 'gap', 'gap', 'coin'], ['hill-2']],
  'pit-plateau': [['hill-1n'], ['pit'], ['hill-2w', 'gap-s', 'coin'], ['pit'], ['hill-1n']],
  pit: [['hill-1'], ['pit', 'gap', 'coin'], ['hill-1']],
  'brick-row': [['gap', 'brick'], ['gap', 'bonus'], ['gap', 'brick'], ['gap', 'power'], ['gap', 'brick']],
  'bug-patrol': [['gap-s', 'coin'], ['bug'], ['gap-s', 'coin']],
  mushrooms: [
    ['stem-s', 'mushroom'],
    ['pit-w', 'gap', 'gap', 'coin'],
    ['stem-m', 'mushroom'],
    ['stem-s', 'mushroom', 'gap-s', 'coin'],
  ],
  'mushroom-hop': [
    ['stem-m', 'mushroom'],
    ['pit-w'],
    ['stem-l', 'mushroom', 'gap-s', 'coin'],
    ['pit'],
    ['stem-s', 'mushroom'],
  ],
  // The playground after the flag: no pits and no bugs, just things to climb and bump.
  'play-mushrooms': [
    ['stem-s', 'mushroom'],
    ['stem-m', 'mushroom', 'gap-s', 'coin'],
    ['stem-l', 'mushroom', 'gap-s', 'coin'],
    ['stem-m', 'mushroom'],
    ['stem-s', 'mushroom'],
  ],
  'play-tower': [
    ['block'],
    ['block', 'block'],
    ['block', 'block', 'block', 'gap-s', 'coin'],
    ['gap', 'gap', 'gap', 'bonus'],
    ['block', 'block', 'block', 'gap-s', 'coin'],
    ['block', 'block'],
    ['block'],
  ],
  'finish-stairs': [['block'], ['block', 'block'], ['block', 'block', 'block'], ['block', 'block', 'block', 'block']],
};

const PART_WIDTH = {
  coin: 26,
  bug: 46,
  pit: 160,
  'pit-w': 220,
  'hill-1': 156,
  'hill-2': 156,
  'hill-3': 156,
  'hill-1n': 104,
  'hill-2n': 104,
  'hill-3n': 104,
  'hill-1w': 260,
  'hill-2w': 260,
  mushroom: 156,
  'stem-s': 40,
  'stem-m': 40,
  'stem-l': 40,
  gap: 0,
  'gap-s': 0,
};
const obstacleWidth = (kind) =>
  (OBSTACLE_COLUMNS[kind] || [['block']]).reduce(
    (sum, column) => sum + Math.max(...column.map((part) => PART_WIDTH[part] ?? 52)),
    0,
  );

function ObstaclePart({ part }) {
  switch (part) {
    case 'gap':
      return <u className="ob-gap"></u>;
    case 'gap-s':
      return <u className="ob-gap ob-gap-s"></u>;
    case 'coin':
      return <b className="coin"></b>;
    case 'bug':
      return (
        <b className="bug">
          <span className="bug-body"></span>
        </b>
      );
    case 'power':
      return <i className="ob-bonus ob-power"></i>;
    case 'stem-s':
    case 'stem-m':
    case 'stem-l':
      return <u className={`ob-stem ob-${part}`}></u>;
    case 'hill-1':
    case 'hill-2':
    case 'hill-3':
    case 'hill-1n':
    case 'hill-2n':
    case 'hill-3n':
    case 'hill-1w':
    case 'hill-2w':
      return <i className={`ob-hill ob-hill-${part.slice(5, 6)} ob-${part}`}></i>;
    case 'pit-w':
      return <i className="ob-pit ob-pit-w"></i>;
    default:
      return <i className={`ob-${part}`}></i>;
  }
}

export function Obstacle({ kind = 'block' }) {
  return (
    <span className={`obstacle obstacle-${kind}`}>
      {(OBSTACLE_COLUMNS[kind] || [['block']]).map((column, columnIndex) => (
        <span className="ob-col" key={columnIndex}>
          {column.map((part, index) => (
            <ObstaclePart key={index} part={part} />
          ))}
        </span>
      ))}
    </span>
  );
}

/** Checkpoint flag that opens each section of the course. */
export function Checkpoint({ id, index, label, word }) {
  return (
    <div className="checkpoint" data-section={id}>
      <div className="checkpoint-sign">
        <span className="mono-label">
          {word} {String(index).padStart(2, '0')}
        </span>
        <strong>{label}</strong>
      </div>
      <div className="seg-lane" aria-hidden="true">
        <span className="checkpoint-flag">
          <i></i>
        </span>
      </div>
    </div>
  );
}

export function Card({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`card ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function Modal({ isOpen, onClose, title, closeLabel, children, className = '' }) {
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (event) => event.key === 'Escape' && onCloseRef.current();
    window.addEventListener('keydown', onKey);
    document.documentElement.classList.add('has-modal');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('has-modal');
      previous?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Rendered on <body>: inside the moving world, `position: fixed` would follow the transform.
  return createPortal(
    <div className="modal-backdrop" onPointerDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="modal-close" onClick={onClose} ref={closeRef}>
          {closeLabel} <span aria-hidden="true">✕</span>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
