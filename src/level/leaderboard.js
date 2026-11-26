// Fastest times for the playable level. Shared through /api/leaderboard when the site has a database;
// otherwise (and always as a backup) the best times on this device are kept in localStorage.

import { useCallback, useEffect, useState } from 'react';

const LOCAL_KEY = 'level-times';
const NAME_KEY = 'level-name';
const SHOW = 10;

export const formatRaceTime = (ms) => {
  const total = Math.max(0, Math.round(ms / 10));
  const hundredths = total % 100;
  const seconds = Math.floor(total / 100);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
};

const readLocal = () => {
  try {
    const list = JSON.parse(window.localStorage.getItem(LOCAL_KEY) || '[]');
    return Array.isArray(list) ? list.filter((entry) => Number.isFinite(entry?.ms)) : [];
  } catch {
    return [];
  }
};

const writeLocal = (entries) => {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(entries));
  } catch {
    // Storage may be unavailable; the time then only lasts for this visit.
  }
};

const sortTimes = (entries) => [...entries].sort((a, b) => a.ms - b.ms).slice(0, SHOW);

export const savedName = () => {
  try {
    return window.localStorage.getItem(NAME_KEY) || '';
  } catch {
    return '';
  }
};

const rememberName = (name) => {
  try {
    window.localStorage.setItem(NAME_KEY, name);
  } catch {
    // Not important.
  }
};

const fetchJson = async (options) => {
  const response = await fetch('/api/leaderboard', options);
  const type = response.headers.get('content-type') || '';
  if (!type.includes('application/json')) throw new Error('No leaderboard API here');
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error || 'Leaderboard error');
    error.status = response.status;
    throw error;
  }
  return data;
};

/** The leaderboard: { entries, isShared, isLoading, error, highlightId, refresh, submit }. */
export function useLeaderboard() {
  const [entries, setEntries] = useState(() => sortTimes(readLocal()));
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [highlightId, setHighlightId] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchJson();
      if (data.configured) {
        setIsShared(true);
        setEntries(data.entries);
      } else {
        setIsShared(false);
        setEntries(sortTimes(readLocal()));
      }
    } catch {
      setIsShared(false);
      setEntries(sortTimes(readLocal()));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submit = useCallback(async ({ name, ms, score }) => {
    const id = `local-${Date.now().toString(36)}`;
    const entry = { id, name, ms, score, at: new Date().toISOString() };
    rememberName(name);
    const local = sortTimes([...readLocal(), entry]);
    writeLocal(local);
    setError('');
    try {
      const data = await fetchJson({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ms, score }),
      });
      if (data.configured) {
        setIsShared(true);
        setEntries(data.entries);
        setHighlightId(data.id);
        return { rank: data.rank };
      }
    } catch (failure) {
      if (failure.status === 429 || failure.status === 400) setError(failure.message);
    }
    setIsShared(false);
    setEntries(local);
    setHighlightId(id);
    const rank = local.findIndex((item) => item.id === id);
    return { rank: rank < 0 ? null : rank + 1 };
  }, []);

  return { entries, isShared, isLoading, error, highlightId, refresh, submit };
}
