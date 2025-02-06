import { NextResponse } from 'next/server';

async function getAccessToken() {
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token!,
    }),
  });

  return response.json();
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken();
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    });

    if (response.status === 204 || response.status > 400) {
      console.log('No track playing or error');
      return NextResponse.json({ isPlaying: false });
    }

    const data = await response.json();

    return NextResponse.json({
        isPlaying: data.is_playing,
        title: data.item.name,
        artist: data.item.artists.map((artist: any) => artist.name).join(', '),
        albumImage: data.item.album.images[0].url,
        progress: data.progress_ms,
        duration: data.item.duration_ms,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ isPlaying: false });
  }
}