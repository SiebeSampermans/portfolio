// Fastest-time leaderboard for the playable level, stored in a Redis sorted set (Upstash / Vercel KV REST API).
// GET  /api/leaderboard          -> { configured, entries: [{ name, ms, score, at }] }
// POST /api/leaderboard { name, ms, score } -> { configured, entries, rank }
// Without the Redis environment variables it answers { configured: false } and the site keeps times locally.

const KEY = 'level-siebe:times';
const KEEP = 50;
const SHOW = 10;
const MIN_MS = 45000; // running flat out without stopping still takes about 55 seconds
const MAX_MS = 60 * 60 * 1000;

const redisConfig = () => {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').trim();
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '').trim();
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
};

const pipeline = async ({ url, token }, commands) => {
  const response = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!response.ok) throw new Error(`Redis answered ${response.status}`);
  return (await response.json()).map((item) => item.result);
};

const parseEntries = (flat = []) => {
  const entries = [];
  for (let i = 0; i < flat.length; i += 2) {
    try {
      const data = JSON.parse(flat[i]);
      entries.push({ name: data.n, score: data.s, at: data.t, id: data.i, ms: Number(flat[i + 1]) });
    } catch {
      // Skip anything that is not ours.
    }
  }
  return entries;
};

const cleanName = (value) =>
  String(value || '')
    .replace(/[^\p{L}\p{N} _.-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12);

const readBody = async (request) => {
  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') return JSON.parse(request.body || '{}');
  let raw = '';
  for await (const chunk of request) raw += chunk;
  return JSON.parse(raw || '{}');
};

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  const config = redisConfig();
  if (!config) {
    response.status(200).json({ configured: false, entries: [] });
    return;
  }

  try {
    if (request.method === 'GET') {
      const [flat] = await pipeline(config, [['ZRANGE', KEY, '0', String(SHOW - 1), 'WITHSCORES']]);
      response.status(200).json({ configured: true, entries: parseEntries(flat) });
      return;
    }

    if (request.method !== 'POST') {
      response.setHeader('Allow', 'GET, POST');
      response.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const body = await readBody(request);
    const name = cleanName(body.name);
    const ms = Math.round(Number(body.ms));
    const score = Math.max(0, Math.min(Math.round(Number(body.score) || 0), 1000000));
    if (!name || !Number.isFinite(ms) || ms < MIN_MS || ms > MAX_MS) {
      response.status(400).json({ error: 'Invalid entry' });
      return;
    }

    // One entry per visitor every 15 seconds.
    const ip = String(request.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    const [allowed] = await pipeline(config, [['SET', `${KEY}:rate:${ip}`, '1', 'EX', '15', 'NX']]);
    if (allowed !== 'OK') {
      response.status(429).json({ error: 'Too many entries, try again in a moment' });
      return;
    }

    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
    const member = JSON.stringify({ n: name, s: score, t: new Date().toISOString(), i: id });
    const [, , rank, flat] = await pipeline(config, [
      ['ZADD', KEY, String(ms), member],
      ['ZREMRANGEBYRANK', KEY, String(KEEP), '-1'],
      ['ZRANK', KEY, member],
      ['ZRANGE', KEY, '0', String(SHOW - 1), 'WITHSCORES'],
    ]);
    response.status(200).json({
      configured: true,
      id,
      rank: rank === null ? null : Number(rank) + 1,
      entries: parseEntries(flat),
    });
  } catch (error) {
    response.status(502).json({ configured: true, error: error.message, entries: [] });
  }
}
