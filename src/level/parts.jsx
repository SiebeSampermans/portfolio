import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * One stretch of the course: content floats above the ground, obstacles sit in the lane.
 * Each named obstacle is swapped for a harder pattern from HARD_PATTERNS.
 */
export function Seg({ children, className = '', obstacle, lane, width }) {
  const kinds = obstacle ? HARD_PATTERNS[obstacle] || [obstacle] : [];

  return (
    <div className={`seg ${className}`} style={width ? { '--seg-w': width } : undefined}>
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

const HARD_PATTERNS = {
  spike: ['spiked-block'],
  spikes: ['bonus-run'],
  block: ['pit'],
  'block-spike': ['bug-patrol'],
  stairs: ['climb'],
  tall: ['sky-bridge'],
};

// Each obstacle is a row of columns; each column stacks parts from the ground up.
// `gap` lifts what comes after it into the air; `coin` is a bit to grab, `bug` walks and can be squashed.
const OBSTACLE_COLUMNS = {
  spike: [['spike']],
  spikes: [['spike'], ['spike']],
  triple: [['spike'], ['spike'], ['spike']],
  block: [['block']],
  'spiked-block': [['spike'], ['block', 'spike'], ['spike']],
  pit: [['block'], ['spike'], ['spike'], ['spike'], ['block', 'gap-s', 'coin']],
  climb: [['block'], ['block-tall'], ['block-tall', 'block'], ['spike'], ['spike']],
  'bonus-run': [['gap', 'bonus'], ['spike'], ['spike'], ['gap-s', 'coin'], ['gap', 'bonus']],
  'bug-patrol': [['gap-s', 'coin'], ['bug'], ['gap-s', 'coin']],
  'sky-bridge': [['spike'], ['spike'], ['gap', 'block'], ['spike'], ['spike'], ['gap', 'bonus'], ['spike'], ['spike']],
};

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
    default:
      return <i className={`ob-${part}`}></i>;
  }
}

export function Obstacle({ kind = 'spike' }) {
  return (
    <span className={`obstacle obstacle-${kind}`}>
      {(OBSTACLE_COLUMNS[kind] || [['spike']]).map((column, columnIndex) => (
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
