import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/** One stretch of the course: content floats above the ground, an obstacle sits in the lane. */
export function Seg({ children, className = '', obstacle, lane, width }) {
  return (
    <div className={`seg ${className}`} style={width ? { '--seg-w': width } : undefined}>
      <div className="seg-body">{children}</div>
      <div className="seg-lane" aria-hidden="true">
        {lane}
        {obstacle && <Obstacle kind={obstacle} />}
      </div>
    </div>
  );
}

const OBSTACLE_PARTS = {
  spike: ['spike'],
  spikes: ['spike', 'spike'],
  block: ['block'],
  'block-spike': ['block', 'spike'],
  stairs: ['block', 'block-tall'],
  tall: ['block-tall'],
};

export function Obstacle({ kind = 'spike' }) {
  return (
    <span className={`obstacle obstacle-${kind}`}>
      {(OBSTACLE_PARTS[kind] || ['spike']).map((part, index) => (
        <i key={index} className={`ob-${part}`}></i>
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
