import { useLanguage } from '../i18n/LanguageContext';
import { Modal } from './parts';
import {
  colorValue,
  Face,
  Hat,
  PixelHero,
  RUNNER_BODIES,
  RUNNER_COLORS,
  RUNNER_FACES,
  RUNNER_HATS,
  RUNNER_TRAILS,
  RunnerBlock,
} from './Runner';

function OptionGroup({ label, children }) {
  return (
    <fieldset className="garage-group">
      <legend className="mono-label">{label}</legend>
      <div className="garage-options">{children}</div>
    </fieldset>
  );
}

function Option({ isActive, onClick, label, children }) {
  return (
    <button
      type="button"
      className={`garage-option${isActive ? ' is-active' : ''}`}
      aria-pressed={isActive}
      onClick={onClick}
      title={label}
    >
      <span className="garage-option-art" aria-hidden="true">
        {children}
      </span>
      <span className="garage-option-label">{label}</span>
    </button>
  );
}

function Garage({ isOpen, onClose, style, update, reset }) {
  const { t: translation } = useLanguage();
  const t = translation.garage;
  const close = translation.level.close;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.title} closeLabel={close} className="modal-garage">
      <div className="garage">
        <div className="garage-stage">
          <span className="mono-label">{t.title}</span>
          <h3>{t.open}</h3>
          <p>{t.intro}</p>
          <div className={`garage-preview trail-${style.trail}`} aria-hidden="true">
            <span className="garage-preview-trail">
              {Array.from({ length: 6 }, (_, index) => (
                <i key={index} style={{ '--i': index }}></i>
              ))}
            </span>
            <RunnerBlock style={style} className="runner-preview" />
            <span className="garage-preview-ground"></span>
          </div>
          <div className="garage-actions">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              {t.done}
            </button>
            <button type="button" className="btn btn-ghost" onClick={reset}>
              {t.reset}
            </button>
          </div>
        </div>

        <div className="garage-pickers">
          <OptionGroup label={t.body}>
            {RUNNER_BODIES.map((body) => (
              <Option key={body} isActive={style.body === body} onClick={() => update({ body })} label={t.bodies[body]}>
                {body === 'hero' ? (
                  <span className="mini-hero" style={{ '--runner-color': colorValue(style.color) }}>
                    <PixelHero />
                  </span>
                ) : (
                  <span className="mini-block" style={{ '--runner-color': colorValue(style.color) }}>
                    <Face face={style.face} />
                  </span>
                )}
              </Option>
            ))}
          </OptionGroup>

          <OptionGroup label={t.color}>
            {RUNNER_COLORS.map((color) => (
              <Option
                key={color.id}
                isActive={style.color === color.id}
                onClick={() => update({ color: color.id })}
                label={t.colors[color.id]}
              >
                <span className="swatch" style={{ background: colorValue(color.id) }}></span>
              </Option>
            ))}
          </OptionGroup>

          {style.body === 'block' && (
          <OptionGroup label={t.face}>
            {RUNNER_FACES.map((face) => (
              <Option key={face} isActive={style.face === face} onClick={() => update({ face })} label={t.faces[face]}>
                <span className="mini-block" style={{ '--runner-color': colorValue(style.color) }}>
                  <Face face={face} />
                </span>
              </Option>
            ))}
          </OptionGroup>
          )}

          <OptionGroup label={t.hat}>
            {RUNNER_HATS.map((hat) => (
              <Option key={hat} isActive={style.hat === hat} onClick={() => update({ hat })} label={t.hats[hat]}>
                {hat === 'none' ? <span className="none-mark">∅</span> : <span className="mini-hat"><Hat hat={hat} /></span>}
              </Option>
            ))}
          </OptionGroup>

          <OptionGroup label={t.trail}>
            {RUNNER_TRAILS.map((trail) => (
              <Option key={trail} isActive={style.trail === trail} onClick={() => update({ trail })} label={t.trails[trail]}>
                <span className={`mini-trail trail-${trail}`} style={{ '--runner-color': colorValue(style.color) }}>
                  {trail === 'none' ? '∅' : Array.from({ length: 4 }, (_, index) => <i key={index} style={{ '--i': index }}></i>)}
                </span>
              </Option>
            ))}
          </OptionGroup>
        </div>
      </div>
    </Modal>
  );
}

export default Garage;
