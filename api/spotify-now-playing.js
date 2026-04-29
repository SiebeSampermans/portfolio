const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';

const getAccessToken = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Spotify environment variables.');
  }

  const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authorization}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Unable to refresh Spotify access token.');
  }

  const data = await response.json();
  return data.access_token;
};

export default async function handler(_request, response) {
  try {
    const accessToken = await getAccessToken();
    const nowPlayingResponse = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (nowPlayingResponse.status === 204) {
      return response.status(200).json({
        isPlaying: false,
        title: 'Spotify is quiet right now',
        artist: 'Waiting for the next track',
        album: 'No active playback',
        albumImageUrl: null,
        songUrl: 'https://open.spotify.com/',
        progressMs: 0,
        durationMs: 0,
      });
    }

    if (!nowPlayingResponse.ok) {
      const errorText = await nowPlayingResponse.text();
      throw new Error(errorText || 'Unable to load current Spotify playback.');
    }

    const data = await nowPlayingResponse.json();
    const item = data.item;
    const albumImage = item?.album?.images?.[0]?.url || null;
    const artistNames = item?.artists?.map((artist) => artist.name).join(', ') || 'Unknown artist';

    return response.status(200).json({
      isPlaying: Boolean(data.is_playing),
      title: item?.name || 'Unknown track',
      artist: artistNames,
      album: item?.album?.name || 'Unknown album',
      albumImageUrl: albumImage,
      songUrl: item?.external_urls?.spotify || 'https://open.spotify.com/',
      progressMs: data.progress_ms || 0,
      durationMs: item?.duration_ms || 0,
    });
  } catch (error) {
    return response.status(500).json({
      error: error.message || 'Unable to load Spotify status.',
    });
  }
}
