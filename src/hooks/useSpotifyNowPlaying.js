import { useEffect, useState } from 'react';

const initialNowPlayingState = {
  status: 'loading',
  track: null,
  errorMessage: '',
};

function useSpotifyNowPlaying(refreshIntervalMs = 10000) {
  const [nowPlayingState, setNowPlayingState] = useState(initialNowPlayingState);

  useEffect(() => {
    let isMounted = true;

    const loadNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify-now-playing');
        const data = await response.json();

        if (!isMounted) {
          return;
        }

        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load Spotify status.');
        }

        setNowPlayingState({
          status: 'ready',
          track: {
            ...data,
            syncedAt: Date.now(),
          },
          errorMessage: '',
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setNowPlayingState({
          status: 'error',
          track: null,
          errorMessage: error instanceof Error ? error.message : 'Unable to load Spotify status.',
        });
      }
    };

    loadNowPlaying();
    const intervalId = window.setInterval(loadNowPlaying, refreshIntervalMs);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [refreshIntervalMs]);

  useEffect(() => {
    if (!nowPlayingState.track?.isPlaying || !nowPlayingState.track?.durationMs) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setNowPlayingState((current) => {
        if (!current.track?.isPlaying || !current.track.durationMs) {
          return current;
        }

        const nextProgressMs = Math.min(
          (current.track.progressMs || 0) + 1000,
          current.track.durationMs,
        );

        return {
          ...current,
          track: {
            ...current.track,
            progressMs: nextProgressMs,
          },
        };
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [nowPlayingState.track?.isPlaying, nowPlayingState.track?.durationMs]);

  return nowPlayingState;
}

export default useSpotifyNowPlaying;
