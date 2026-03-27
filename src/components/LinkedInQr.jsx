import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';

function LinkedInQr({ value }) {
  const qrRef = useRef(null);
  const qrCodeRef = useRef(null);
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined' ? document.body.dataset.theme || 'green' : 'green',
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.dataset.theme || 'green');
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const isBlueTheme = theme === 'blue';
  const accent = isBlueTheme ? '#78a8ff' : '#76ff8b';
  const accentStrong = isBlueTheme ? '#4f7dff' : '#effff2';

  useEffect(() => {
    if (!qrRef.current) {
      return undefined;
    }

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: 180,
        height: 180,
        data: value,
        type: 'svg',
        margin: 0,
        qrOptions: {
          errorCorrectionLevel: 'Q',
        },
        dotsOptions: {
          color: accent,
          type: 'rounded',
        },
        cornersSquareOptions: {
          color: accentStrong,
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          color: accent,
          type: 'dot',
        },
        backgroundOptions: {
          color: 'transparent',
        },
      });

      qrCodeRef.current.append(qrRef.current);
    } else {
      qrCodeRef.current.update({
        data: value,
        dotsOptions: {
          color: accent,
          type: 'rounded',
        },
        cornersSquareOptions: {
          color: accentStrong,
          type: 'extra-rounded',
        },
        cornersDotOptions: {
          color: accent,
          type: 'dot',
        },
      });
    }

    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
      qrCodeRef.current = null;
    };
  }, [accent, accentStrong, value]);

  return <div ref={qrRef} className="linkedin-qr-art" aria-hidden="true" />;
}

export default LinkedInQr;
