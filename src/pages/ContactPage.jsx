import { useEffect, useRef, useState } from 'react';
import LinkedInQr from '../components/LinkedInQr';
import PageFooter from '../components/PageFooter';
import usePageTitle from '../hooks/usePageTitle';
import useScrollReveal from '../hooks/useScrollReveal';
import { useLanguage } from '../i18n/LanguageContext';

const LINKEDIN_URL = 'https://www.linkedin.com/in/siebe-sampermans-727a75330/';
const INSTAGRAM_URL = 'https://www.instagram.com/siebe_sampermans/';
const FACEBOOK_URL = 'https://www.facebook.com/siebe.sampermans.7?locale=nl_BE';
const CONTACT_RECIPIENT = 'sampermans.dev@gmail.com';
const OUTLOOK_EMAIL = 'r1058833@student.thomasmore.be';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const OFFENSIVE_NAME_WORDS = ['fuck', 'shit', 'bitch', 'asshole', 'cunt', 'nigger', 'faggot'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

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

  if (label === 'Facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3.5" />
        <path d="M13.2 18v-5.2h1.95l.35-2.2H13.2V9.35c0-.75.26-1.3 1.42-1.3h1.02V6.1c-.18-.03-.8-.08-1.52-.08-1.5 0-2.52.9-2.52 2.62v1.96H10v2.2h1.62V18z" />
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
    handle: '@siebe_sampermans',
    href: INSTAGRAM_URL,
  },
  {
    label: 'Facebook',
    handle: 'Siebe Sampermans',
    href: FACEBOOK_URL,
  },
  {
    label: 'Outlook',
    handle: 'R1058833',
    href: `mailto:${OUTLOOK_EMAIL}`,
  },
];

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [honeypotValue, setHoneypotValue] = useState('');
  const [sendState, setSendState] = useState({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const progressTimerRef = useRef(null);
  const mountedAtRef = useRef(Date.now());

  const { t: translation } = useLanguage();
  const t = translation.contact;

  usePageTitle(t.title);
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

  const submitWithEmailJs = async (event) => {
    event.preventDefault();
    const trimmedName = formData.name.trim();
    const normalizedName = trimmedName.toLowerCase();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();
    const normalizedMessage = trimmedMessage.toLowerCase();

    if (sendState.status === 'sending') {
      return;
    }

    if (honeypotValue.trim()) {
      setSendState({
        status: 'error',
        progress: 0,
        message: t.errors.blocked,
      });
      return;
    }

    if (Date.now() - mountedAtRef.current < 2500) {
      setSendState({
        status: 'error',
        progress: 0,
        message: t.errors.tooFast,
      });
      return;
    }

    if (OFFENSIVE_NAME_WORDS.some((word) => normalizedName.includes(word))) {
      setSendState({
        status: 'error',
        progress: 0,
        message: t.errors.offensiveName,
      });
      return;
    }

    if (OFFENSIVE_NAME_WORDS.some((word) => normalizedMessage.includes(word))) {
      setSendState({
        status: 'error',
        progress: 0,
        message: t.errors.offensiveMessage,
      });
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setSendState({
        status: 'error',
        progress: 0,
        message: t.errors.invalidEmail,
      });
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setSendState({
        status: 'error',
        progress: 0,
        message: t.errors.notConfigured,
      });
      return;
    }

    setSendState({
      status: 'sending',
      progress: 8,
      message: t.preparing,
    });

    let currentProgress = 8;
    progressTimerRef.current = window.setInterval(() => {
      currentProgress = Math.min(currentProgress + Math.random() * 14, 88);
      setSendState((current) => ({
        ...current,
        progress: currentProgress,
        message: t.sendingMessage,
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
            from_name: trimmedName,
            from_email: trimmedEmail,
            user_email: trimmedEmail,
            reply_to: trimmedEmail,
            message: trimmedMessage,
            subject: `New contact message from ${trimmedName}`,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Unknown error while sending.');
      }

      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }

      setSendState({
        status: 'success',
        progress: 100,
        message: t.sent,
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
        message: t.errors.failed,
      });
    }
  };

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
          <div className="container contact-layout">
            <div className="contact-card contact-form-card scroll-reveal">
              <span className="card-label">{t.formLabel}</span>
              <h2>{t.formTitle}</h2>
              <p>
                {t.formText} <code>{CONTACT_RECIPIENT}</code>.
              </p>

              <form
                className="contact-form"
                onSubmit={submitWithEmailJs}
                aria-busy={sendState.status === 'sending'}
              >
                <label className="contact-field contact-field-honeypot" aria-hidden="true">
                  <span>{t.honeypot}</span>
                  <input
                    type="text"
                    name="contact_company"
                    value={honeypotValue}
                    onChange={(event) => setHoneypotValue(event.target.value)}
                    tabIndex="-1"
                    autoComplete="new-password"
                  />
                </label>

                <label className="contact-field">
                  <span>{t.name}</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.namePlaceholder}
                    required
                  />
                </label>

                <label className="contact-field">
                  <span>{t.email}</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.emailPlaceholder}
                    required
                  />
                </label>

                <label className="contact-field">
                  <span>{t.message}</span>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t.messagePlaceholder}
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
                        <span>{t.sendingEmail}</span>
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
                        <strong>{sendState.status === 'success' ? t.success : t.error}</strong>
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
                  {sendState.status === 'sending' ? t.sending : t.send}
                </button>
              </form>
            </div>

            <aside className="contact-card linkedin-card scroll-reveal">
              <span className="card-label">LinkedIn</span>
              <h2>{t.linkedinTitle}</h2>
              <p>{t.linkedinText}</p>

              <div className="linkedin-qr-frame">
                <LinkedInQr value={LINKEDIN_URL} />
              </div>

              <a className="btn btn-secondary" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                {t.openLinkedin}
              </a>
            </aside>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="section-header scroll-reveal">
              <span className="eyebrow">{t.socialsEyebrow}</span>
              <h2>{t.socialsTitle}</h2>
              <p>{t.socialsText}</p>
            </div>

            <div className="contact-social-grid">
              {SOCIAL_CARDS.map((card) => (
                <a
                  key={card.label}
                  className="contact-social-card scroll-reveal"
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel={card.href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={t.socials[card.label].cta}
                >
                  <div className="contact-social-card-inner">
                    <div className="contact-social-face contact-social-face-front">
                      <span className="card-label">{card.label}</span>
                      <span className="contact-social-icon" aria-hidden="true">
                        <SocialIcon label={card.label} />
                      </span>
                      <strong>{card.label}</strong>
                    </div>

                    <div className="contact-social-face contact-social-face-back">
                      <span className="card-label">{card.label}</span>
                      <span className="contact-social-icon" aria-hidden="true">
                        <SocialIcon label={card.label} />
                      </span>
                      <strong>{card.handle}</strong>
                      <p>{t.socials[card.label].text}</p>
                      <span className="contact-social-cta">{t.socials[card.label].cta}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PageFooter text={t.footer} linkTo="/cv" linkLabel={t.footerLink} />
    </>
  );
}

export default ContactPage;
