import { useEffect, useRef, useState } from 'react';
import { formatRaceTime, savedName } from './leaderboard';

/** Top times as a pixel scoreboard. */
export function LeaderboardList({ board, text, compact = false }) {
  const { entries, isShared, isLoading, highlightId } = board;
  return (
    <div className={`leaderboard${compact ? ' is-compact' : ''}`}>
      <div className="leaderboard-head">
        <span className="mono-label">{text.leaderboard}</span>
        <small>{isShared ? text.leaderboardShared : text.leaderboardLocal}</small>
      </div>
      {entries.length ? (
        <ol>
          {entries.map((entry, index) => (
            <li key={entry.id || `${entry.name}-${entry.ms}-${index}`} className={entry.id && entry.id === highlightId ? 'is-you' : undefined}>
              <span className="leaderboard-rank">{index + 1}</span>
              <span className="leaderboard-name">{entry.name}</span>
              <span className="leaderboard-time">{formatRaceTime(entry.ms)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="leaderboard-empty">{isLoading ? '…' : text.leaderboardEmpty}</p>
      )}
    </div>
  );
}

/** Shown when you grab the flag: your result, a name to put on the board, and where to go next. */
export function ClearCard({ finish, stats, board, text, onAgain, onHome }) {
  const [name, setName] = useState(savedName);
  const [status, setStatus] = useState('idle'); // idle | saving | saved
  const [rank, setRank] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    board.refresh();
    const timer = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 700);
    return () => window.clearTimeout(timer);
    // Only when the card opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (event) => {
    event.preventDefault();
    const clean = name.trim().slice(0, 12);
    if (!clean || status !== 'idle') return;
    setStatus('saving');
    const result = await board.submit({ name: clean, ms: finish.ms, score: finish.score, checkpoints: finish.checkpoints });
    setRank(result.rank);
    setStatus('saved');
  };

  return (
    <div className="clear-card" role="dialog" aria-label={text.cleared}>
      <strong>{text.cleared}</strong>
      <div className="clear-time">
        <span>{text.time}</span>
        <b>{formatRaceTime(finish.ms)}</b>
      </div>
      <dl>
        <dt>{text.bits}</dt>
        <dd>{stats.bits}</dd>
        <dt>{text.bugs}</dt>
        <dd>{stats.bugs}</dd>
        <dt>{text.flagBonus}</dt>
        <dd>{finish.flagBonus}</dd>
        <dt className="clear-total">{text.score}</dt>
        <dd className="clear-total">{finish.score}</dd>
      </dl>

      {finish.checkpoints < finish.totalCheckpoints ? (
        <p className="clear-missed">{text.missedCheckpoints(finish.checkpoints, finish.totalCheckpoints)}</p>
      ) : status === 'saved' ? (
        <p className="clear-saved">{rank ? text.yourRank(rank) : text.saved}</p>
      ) : (
        <form className="clear-form" onSubmit={save}>
          <label htmlFor="clear-name">{text.yourName}</label>
          <div>
            <input
              id="clear-name"
              ref={inputRef}
              value={name}
              maxLength={12}
              autoComplete="nickname"
              placeholder={text.namePlaceholder}
              onChange={(event) => setName(event.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={!name.trim() || status === 'saving'}>
              {text.saveTime}
            </button>
          </div>
        </form>
      )}
      {board.error && <p className="clear-error">{board.error}</p>}

      <LeaderboardList board={board} text={text} compact />

      <div className="clear-actions">
        <button type="button" className="btn btn-primary" onClick={onAgain}>
          ↺ {text.again}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onHome}>
          ⚑ {text.backToStart}
        </button>
      </div>
    </div>
  );
}
