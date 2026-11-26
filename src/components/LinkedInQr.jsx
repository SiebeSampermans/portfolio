import { useEffect, useRef, useState } from 'react';

/** LinkedIn QR code in the theme colour. The QR library is only downloaded when this card is shown. */
function LinkedInQr({ value }) {
  const qrRef = useRef(null);
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' ? document.body.dataset.theme || 'blue' : 'blue',
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.dataset.theme || 'blue');
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const accent = theme === 'blue' ? '#5ef1ff' : '#c6ff3d';
  const accentStrong = '#ffffff';

  useEffect(() => {
    const container = qrRef.current;
    if (!container) {
      return undefined;
    }

    let cancelled = false;
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (cancelled) return;
      const qrCode = new QRCodeStyling({
        width: 168,
        height: 168,
        data: value,
        type: 'svg',
        margin: 0,
        qrOptions: { errorCorrectionLevel: 'Q' },
        dotsOptions: { color: accent, type: 'rounded' },
        cornersSquareOptions: { color: accentStrong, type: 'extra-rounded' },
        cornersDotOptions: { color: accent, type: 'dot' },
        backgroundOptions: { color: 'transparent' },
      });
      container.innerHTML = '';
      qrCode.append(container);
    });

    return () => {
      cancelled = true;
      container.innerHTML = '';
    };
  }, [accent, accentStrong, value]);

  return <div ref={qrRef} className="linkedin-qr-art" aria-hidden="true" />;
}

export default LinkedInQr;
