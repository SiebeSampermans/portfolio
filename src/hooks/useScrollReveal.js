import { useEffect } from 'react';

function useScrollReveal(options = {}) {
  const {
    threshold = 0.18,
    rootMargin = '0px 0px -80px 0px',
    withProjectCues = false,
  } = options;

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll('.scroll-reveal'));

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    let cueObserver;

    if (withProjectCues) {
      cueObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const cue = document.querySelector(`[data-cue-for="${entry.target.id}"]`);
            if (!cue) {
              return;
            }

            if (entry.isIntersecting) {
              cue.classList.add('is-hidden');
            } else {
              cue.classList.remove('is-hidden');
            }
          });
        },
        { threshold: 0.18 },
      );

      document.querySelectorAll('.project-card[id]').forEach((card) => cueObserver.observe(card));
    }

    return () => {
      revealObserver.disconnect();
      if (cueObserver) {
        cueObserver.disconnect();
      }
    };
  }, [rootMargin, threshold, withProjectCues]);
}

export default useScrollReveal;
