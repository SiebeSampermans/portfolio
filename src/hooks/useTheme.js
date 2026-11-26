import { useEffect, useRef, useState } from 'react';
import greenFavicon from '../assets/favicons/favicon-green.png';
import blueFavicon from '../assets/favicons/favicon-blue.png';

const readSavedTheme = () => {
  try {
    const savedTheme = window.localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'blue' : true;
  } catch {
    return true;
  }
};

/** Blue/green theme: drives the colours, the favicon and which CV version is offered. */
function useTheme() {
  const [isBlue, setIsBlue] = useState(() => (typeof window === 'undefined' ? true : readSavedTheme()));
  const [transition, setTransition] = useState(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const handleThemeRequest = (event) => {
      if (event.detail?.theme === 'blue') setIsBlue(true);
      if (event.detail?.theme === 'green') setIsBlue(false);
    };
    window.addEventListener('app-theme-request', handleThemeRequest);
    return () => window.removeEventListener('app-theme-request', handleThemeRequest);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = isBlue ? 'blue' : 'green';

    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.setAttribute('rel', 'icon');
      document.head.appendChild(favicon);
    }
    favicon.setAttribute('type', 'image/png');
    favicon.setAttribute('href', isBlue ? blueFavicon : greenFavicon);

    try {
      window.localStorage.setItem('theme', isBlue ? 'blue' : 'green');
    } catch {
      // Storage can be unavailable (private mode); the choice then lasts for this visit only.
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return undefined;
    }

    setTransition(isBlue ? 'blue' : 'green');
    const timeoutId = window.setTimeout(() => setTransition(null), 900);
    return () => window.clearTimeout(timeoutId);
  }, [isBlue]);

  return { isBlue, toggle: () => setIsBlue((current) => !current), transition };
}

export default useTheme;
