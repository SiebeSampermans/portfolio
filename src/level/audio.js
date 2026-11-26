// Original chiptune music and sound effects, synthesised in the browser with the Web Audio API.
// No audio files, so nothing to license: the tunes below are written for this site.
// Sound is off until the visitor turns it on (and browsers only allow it after a click or key press).

const STORAGE_KEY = 'level-sound';

let ctx = null;
let master = null;
let enabled = false;
let timer = 0;
let nextTime = 0;
let step = 0;
const listeners = new Set();

const midi = (note) => 440 * 2 ** ((note - 69) / 12);

// Day: bright and bouncy, C major, 132 BPM. Night: calm, A minor, 96 BPM.
// Lead notes are eighth notes (null is a rest); bass roots change every bar.
const SONGS = {
  day: {
    bpm: 132,
    lead: [
      72, 76, 79, 76, 74, 72, 74, 76,
      77, 76, 74, 72, 71, 72, 74, null,
      72, 76, 79, 84, 83, 79, 76, 79,
      81, 79, 77, 76, 74, null, 72, null,
      69, 72, 76, 72, 74, 77, 76, 74,
      72, 74, 76, 79, 77, 76, 74, 72,
      71, 74, 79, 77, 76, 74, 72, 71,
      72, null, 79, null, 72, null, null, null,
    ],
    roots: [48, 53, 48, 55, 57, 53, 55, 48],
    leadWave: 'square',
    leadGain: 0.07,
  },
  night: {
    bpm: 96,
    lead: [
      69, null, 72, 76, 74, null, 72, null,
      65, null, 69, 72, 71, null, 69, null,
      72, null, 76, 79, 77, 76, 74, 72,
      71, null, 67, 71, 69, null, null, null,
    ],
    roots: [45, 41, 48, 43],
    leadWave: 'triangle',
    leadGain: 0.11,
  },
};

const songNow = () => (document.body.dataset.theme === 'green' ? SONGS.night : SONGS.day);

function ensureContext() {
  if (ctx) return ctx;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  ctx = new AudioContext();
  master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);
  return ctx;
}

function tone(freq, start, duration, { wave = 'square', gain = 0.06, slideTo = null } = {}) {
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp).connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

let noiseBuffer = null;
function noise(start, duration, { gain = 0.05, highpass = 6000 } = {}) {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = highpass;
  const amp = ctx.createGain();
  amp.gain.setValueAtTime(gain, start);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter).connect(amp).connect(master);
  source.start(start);
  source.stop(start + duration + 0.02);
}

function scheduleMusic() {
  const song = songNow();
  const eighth = 60 / song.bpm / 2;
  while (nextTime < ctx.currentTime + 0.15) {
    const index = step % song.lead.length;
    const bar = Math.floor(index / 8) % song.roots.length;
    const inBar = index % 8;
    const note = song.lead[index];
    if (note) tone(midi(note), nextTime, eighth * 0.9, { wave: song.leadWave, gain: song.leadGain });
    if (inBar % 2 === 0) {
      const root = song.roots[bar];
      const offset = [0, 7, 12, 7][inBar / 2];
      tone(midi(root + offset), nextTime, eighth * 1.8, { wave: 'triangle', gain: 0.12 });
    }
    if (inBar % 2 === 1) noise(nextTime, 0.04, { gain: 0.025 });
    if (inBar === 0 || inBar === 4) noise(nextTime, 0.09, { gain: 0.06, highpass: 120 });
    nextTime += eighth;
    step += 1;
  }
}

function startMusic() {
  if (!ensureContext() || timer) return;
  ctx.resume();
  nextTime = ctx.currentTime + 0.05;
  step = 0;
  timer = window.setInterval(scheduleMusic, 30);
}

function stopMusic() {
  window.clearInterval(timer);
  timer = 0;
}

const EFFECTS = {
  jump: (t) => tone(330, t, 0.16, { slideTo: 660, gain: 0.05 }),
  coin: (t) => {
    tone(988, t, 0.07, { gain: 0.05 });
    tone(1319, t + 0.07, 0.18, { gain: 0.05 });
  },
  stomp: (t) => {
    noise(t, 0.08, { gain: 0.09, highpass: 200 });
    tone(300, t, 0.12, { slideTo: 120, gain: 0.06 });
  },
  bump: (t) => tone(150, t, 0.09, { wave: 'triangle', gain: 0.14 }),
  brick: (t) => noise(t, 0.18, { gain: 0.1, highpass: 400 }),
  power: (t) => [60, 64, 67, 72, 76, 79].forEach((n, i) => tone(midi(n + 12), t + i * 0.05, 0.08, { gain: 0.05 })),
  checkpoint: (t) => [72, 79, 84].forEach((n, i) => tone(midi(n), t + i * 0.07, i === 2 ? 0.22 : 0.08, { gain: 0.05 })),
  hurt: (t) => tone(500, t, 0.3, { slideTo: 150, gain: 0.06 }),
  die: (t) => [72, 67, 64, 60].forEach((n, i) => tone(midi(n), t + i * 0.12, 0.14, { gain: 0.06 })),
  flag: (t) =>
    [67, 72, 76, 79, 84, 88].forEach((n, i) => tone(midi(n), t + i * 0.09, i === 5 ? 0.5 : 0.1, { gain: 0.06 })),
};

/** Plays a sound effect if sound is on. */
export function sfx(name) {
  if (!enabled || !ctx || !EFFECTS[name]) return;
  EFFECTS[name](ctx.currentTime + 0.005);
}

export function isSoundOn() {
  return enabled;
}

/** Turns music and effects on or off. Must be called from a click or key handler the first time. */
export function setSound(on) {
  enabled = on;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // Storage may be unavailable; the choice then lasts for this visit only.
  }
  if (on) startMusic();
  else stopMusic();
  listeners.forEach((listener) => listener(on));
}

export function onSoundChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Whether the visitor turned sound on during an earlier visit (we still wait for a gesture to start it). */
export function wantsSound() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

/** Start the other song from its first bar when switching between day and night. */
if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
  new MutationObserver(() => {
    if (timer && ctx) {
      step = 0;
      nextTime = Math.max(nextTime, ctx.currentTime + 0.05);
    }
  }).observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
}

/** Mute while the tab is hidden, pick up again when it comes back. */
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (enabled) ctx.resume();
  });
}
