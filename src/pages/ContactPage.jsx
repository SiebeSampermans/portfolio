import { useEffect, useRef, useState } from 'react';
import LinkedInQr from '../components/LinkedInQr';
import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';

const LINKEDIN_URL = 'https://www.linkedin.com/in/siebe-sampermans-727a75330/';
const INSTAGRAM_URL = 'http://instagram.com/siebe_sampermans/';
const CONTACT_RECIPIENT = 'sampermans.dev@gmail.com';
const OUTLOOK_EMAIL = 'r1058833@student.thomasmore.be';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

function SocialIcon({ label }) {
  if (label === 'Instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.5" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.5" cy="6.7" r="1.15" />
      </svg>
    );
  }

  if (label === 'LinkedIn') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3.5" />
        <rect x="6.7" y="9.3" width="2.3" height="7.7" />
        <circle cx="7.85" cy="7.2" r="1.2" />
        <path d="M12 9.3v7.7h2.3v-4.1c0-1.35.52-2.25 1.82-2.25 1.12 0 1.63.78 1.63 2.05V17H20v-4.95c0-2.25-1.2-3.45-3.02-3.45-1.38 0-2.05.77-2.38 1.3V9.3z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.5 7.2 11 12.4l7.5-5.2" />
      <rect x="3.5" y="6" width="15" height="12" rx="2.2" />
      <path d="M18.5 8.2h2v9.6h-6.2" />
      <path d="M8.4 12c0-1.5 1.08-2.6 2.6-2.6s2.6 1.1 2.6 2.6-1.08 2.6-2.6 2.6S8.4 13.5 8.4 12Z" />
    </svg>
  );
}

const SOCIAL_CARDS = [
  {
    label: 'Instagram',
    icon: 'IG',
    handle: '@siebe_sampermans',
    text: 'Voor behind the scenes, dagelijkse updates en een meer persoonlijke inkijk.',
    href: INSTAGRAM_URL,
    cta: 'Open Instagram',
  },
  {
    label: 'LinkedIn',
    icon: 'in',
    handle: 'Siebe Sampermans',
    text: 'Voor stage, werk en professionele connecties rond IT, projecten en groei.',
    href: LINKEDIN_URL,
    cta: 'Open LinkedIn',
  },
  {
    label: 'Outlook',
    icon: 'O',
    handle: 'R1058833',
    text: 'Voor directe vragen, samenwerkingen of een professionele kennismaking via mail.',
    href: `mailto:${OUTLOOK_EMAIL}`,
    cta: 'Mail via Outlook',
  },
];

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [website, setWebsite] = useState('');
  const [sendState, setSendState] = useState({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const [flippedCard, setFlippedCard] = useState(null);
  const progressTimerRef = useRef(null);
  const mountedAtRef = useRef(Date.now());

  usePageTitle('Siebe | Contact');
  useScrollReveal();

  useEffect(() => () => {
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const isSmallScreen = () => typeof window !== 'undefined' && window.innerWidth <= 640;

  const toggleCardFlip = (label) => {
    setFlippedCard((current) => (current === label ? null : label));
  };

  const handleSocialCardActivate = (label) => {
    if (isSmallScreen()) {
      return;
    }

    toggleCardFlip(label);
  };

  const submitWithEmailJs = async (event) => {
    event.preventDefault();

    if (sendState.status === 'sending') {
      return;
    }

    if (website.trim()) {
      setSendState({
        status: 'error',
        progress: 0,
        message: 'Versturen geblokkeerd. Probeer het opnieuw.',
      });
      return;
    }

    if (Date.now() - mountedAtRef.current < 2500) {
      setSendState({
        status: 'error',
        progress: 0,
        message: 'Wacht heel even en probeer dan opnieuw te verzenden.',
      });
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setSendState({
        status: 'error',
        progress: 0,
        message:
          'EmailJS is nog niet ingesteld. Voeg VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID en VITE_EMAILJS_PUBLIC_KEY toe aan je .env-bestand.',
      });
      return;
    }

    setSendState({
      status: 'sending',
      progress: 8,
      message: 'Bericht wordt voorbereid...',
    });

    let currentProgress = 8;
    progressTimerRef.current = window.setInterval(() => {
      currentProgress = Math.min(currentProgress + Math.random() * 14, 88);
      setSendState((current) => ({
        ...current,
        progress: currentProgress,
        message: 'Bericht wordt verzonden...',
      }));
    }, 180);

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            to_email: CONTACT_RECIPIENT,
            recipient_email: CONTACT_RECIPIENT,
            from_name: formData.name,
            from_email: formData.email,
            user_email: formData.email,
            reply_to: formData.email,
            message: formData.message,
            subject: `Nieuw contactbericht van ${formData.name}`,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Onbekende fout bij het versturen.');
      }

      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      setSendState({
        status: 'success',
        progress: 100,
        message: 'Je mail is succesvol verstuurd.',
      });
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      setSendState({
        status: 'error',
        progress: 100,
        message: 'Versturen mislukt. Controleer je EmailJS-configuratie en probeer opnieuw.',
      });
    }
  };

  return (
    <>
      <main>
        <section className="page-intro">
          <div className="container">
            <span className="eyebrow scroll-reveal">Contact</span>
            <h1 className="page-title scroll-reveal">Neem contact op</h1>
            <p className="page-text scroll-reveal">
              Wil je me contacteren voor een stage, project of kennismaking? Laat een bericht
              achter via het formulier of scan de QR-code om rechtstreeks naar mijn LinkedIn te
              gaan.
            </p>
          </div>
        </section>

        <section>
          <div className="container contact-layout">
            <div className="contact-card contact-form-card scroll-reveal">
              <span className="card-label">Contact form</span>
              <h2>Stuur me een bericht</h2>
              <p>
                Vul je bericht in en verstuur het rechtstreeks via EmailJS. Tijdens het verzenden
                zie je eerst een progress bar en daarna een melding of het gelukt is. Berichten
                van deze pagina gaan naar <code>{CONTACT_RECIPIENT}</code>.
              </p>

              <form className="contact-form" onSubmit={submitWithEmailJs} aria-busy={sendState.status === 'sending'}>
                <label className="contact-field contact-field-honeypot" aria-hidden="true">
                  <span>Website</span>
                  <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </label>

                <label className="contact-field">
                  <span>Naam</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jouw naam"
                    required
                  />
                </label>

                <label className="contact-field">
                  <span>E-mail</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jij@email.com"
                    required
                  />
                </label>

                <label className="contact-field">
                  <span>Bericht</span>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Vertel kort waarvoor je me contacteert..."
                    rows="6"
                    required
                  ></textarea>
                </label>

                {(sendState.status === 'sending' ||
                  sendState.status === 'success' ||
                  sendState.status === 'error') && (
                  <div className="contact-feedback">
                    <div
                      className={`contact-progress${
                        sendState.status === 'success'
                          ? ' is-success'
                          : sendState.status === 'error'
                            ? ' is-error'
                            : ''
                      }`}
                      aria-live="polite"
                    >
                      <div className="contact-progress-meta">
                        <span>Mail versturen</span>
                        <span>{Math.round(sendState.progress)}%</span>
                      </div>
                      <div className="contact-progress-track">
                        <div
                          className="contact-progress-indicator"
                          style={{ width: `${sendState.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {sendState.status !== 'sending' && (
                      <div
                        className={`contact-alert${
                          sendState.status === 'success' ? ' is-success' : ' is-error'
                        }`}
                        role="alert"
                      >
                        <strong>{sendState.status === 'success' ? 'Succes' : 'Fout'}</strong>
                        <span>{sendState.message}</span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={sendState.status === 'sending'}
                >
                  {sendState.status === 'sending' ? 'Bezig met verzenden...' : 'Verstuur bericht'}
                </button>
              </form>
            </div>

            <aside className="contact-card linkedin-card scroll-reveal">
              <span className="card-label">LinkedIn</span>
              <h2>Scan mijn QR-code</h2>
              <p>
                Scan de code om meteen mijn LinkedIn-profiel te openen of gebruik de knop hieronder
                om direct door te klikken.
              </p>

              <div className="linkedin-qr-frame">
                <LinkedInQr value={LINKEDIN_URL} />
              </div>

              <a className="btn btn-secondary" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                Open LinkedIn
              </a>
            </aside>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="section-header scroll-reveal">
              <span className="eyebrow">Socials</span>
              <h2>Vind me ook hier</h2>
              <p>
                Naast het formulier kan je me ook rechtstreeks bereiken via deze drie contactkaarten.
              </p>
            </div>

            <div className="contact-social-grid">
              {SOCIAL_CARDS.map((card) => (
                <div
                  key={card.label}
                  className={`contact-social-card scroll-reveal${
                    flippedCard === card.label ? ' is-flipped' : ''
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSocialCardActivate(card.label)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleSocialCardActivate(card.label);
                    }
                  }}
                >
                  <div className="contact-social-card-inner">
                    <div className="contact-social-face contact-social-face-front">
                      <a
                        className="contact-social-icon"
                        href={card.href}
                        target={card.href.startsWith('http') ? '_blank' : undefined}
                        rel={card.href.startsWith('http') ? 'noreferrer' : undefined}
                        aria-label={`${card.cta} via ${card.label}`}
                        onClick={(event) => {
                          if (!isSmallScreen()) {
                            event.preventDefault();
                            event.stopPropagation();
                          }
                        }}
                      >
                        <SocialIcon label={card.label} />
                      </a>
                      <strong>{card.label}</strong>
                      <span className="contact-social-hint">Tik op het icoon om te openen</span>
                    </div>

                    <div className="contact-social-face contact-social-face-back">
                      <span className="card-label">{card.label}</span>
                      <strong>{card.handle}</strong>
                      <p>{card.text}</p>
                      <a
                        className="contact-social-cta"
                        href={card.href}
                        target={card.href.startsWith('http') ? '_blank' : undefined}
                        rel={card.href.startsWith('http') ? 'noreferrer' : undefined}
                        onClick={(event) => event.stopPropagation()}
                      >
                        {card.cta}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PageFooter
        text="© 2026 Siebe - Contact"
        linkTo="/cv"
        linkLabel="Ga terug naar mijn CV"
      />
    </>
  );
}

export default ContactPage;
