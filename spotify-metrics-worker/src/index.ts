interface Env {
  SPOTIFY_CLIENT_ID: string
  SPOTIFY_CLIENT_SECRET: string
  SPOTIFY_REFRESH_TOKEN: string
}

interface SpotifyImage {
  url: string
  width: number | null
  height: number | null
}

interface SpotifyArtist {
  id: string
  name: string
  images?: SpotifyImage[]
  external_urls: {
    spotify: string
  }
}

interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    id: string
    name: string
  }>
  album: {
    name: string
    images: SpotifyImage[]
  }
  external_urls: {
    spotify: string
  }
}

interface SpotifyPlayback {
  is_playing: boolean
  item: SpotifyTrack | null
}

const ALLOWED_ORIGINS = new Set([
  'https://justinmeiners.com',
  'https://www.justinmeiners.com',
  'http://localhost:5173',
])

function corsHeaders(request: Request) {
  const origin = request.headers.get('Origin')
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.has(origin)
      ? origin
      : 'https://justinmeiners.com'

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

async function getAccessToken(env: Env) {
  const credentials = btoa(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
  )

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: env.SPOTIFY_REFRESH_TOKEN,
    }),
  })

  if (!response.ok) {
    throw new Error(`Spotify token request failed: ${response.status}`)
  }

  const data = await response.json<{ access_token: string }>()
  return data.access_token
}

async function spotifyRequest<T>(path: string, accessToken: string) {
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Spotify request failed: ${response.status}`)
  }

  return response.json<T>()
}

async function currentlyPlaying(accessToken: string) {
  const response = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )

  if (response.status === 204) return null
  if (!response.ok) {
    throw new Error(`Spotify request failed: ${response.status}`)
  }

  return response.json<SpotifyPlayback>()
}

function mapTrack(track: SpotifyTrack) {
  return {
    id: track.id,
    name: track.name,
    artists: track.artists.map((artist) => artist.name),
    album: track.album.name,
    image: track.album.images[0]?.url ?? null,
    url: track.external_urls.spotify,
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const headers = corsHeaders(request)

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers,
      })
    }

    if (request.method !== 'GET' || url.pathname !== '/metrics') {
      return Response.json(
        { error: 'Not found' },
        { status: 404, headers },
      )
    }

    try {
      const requestedRange = url.searchParams.get('time_range')
      const timeRange = new Set(['short_term', 'medium_term', 'long_term']).has(
        requestedRange ?? '',
      )
        ? requestedRange
        : 'medium_term'
      const accessToken = await getAccessToken(env)

      const [playback, artists, tracks, recent] = await Promise.all([
        currentlyPlaying(accessToken),
        spotifyRequest<{ items: SpotifyArtist[] }>(
          `/me/top/artists?time_range=${timeRange}&limit=5`,
          accessToken,
        ),
        spotifyRequest<{ items: SpotifyTrack[] }>(
          `/me/top/tracks?time_range=${timeRange}&limit=5`,
          accessToken,
        ),
        spotifyRequest<{
          items: Array<{
            track: SpotifyTrack
            played_at: string
          }>
        }>('/me/player/recently-played?limit=5', accessToken),
      ])

      const metrics = {
        currentlyPlaying: playback?.item
          ? { ...mapTrack(playback.item), isPlaying: playback.is_playing }
          : null,
        topArtists: artists.items.map((artist) => ({
          id: artist.id,
          name: artist.name,
          image: artist.images?.[0]?.url ?? null,
          url: artist.external_urls.spotify,
        })),
        topTracks: tracks.items.map(mapTrack),
        recentlyPlayed: recent.items.map(({ track, played_at }) => ({
          ...mapTrack(track),
          playedAt: played_at,
        })),
        updatedAt: new Date().toISOString(),
      }

      return Response.json(metrics, {
        headers: {
          ...headers,
          'Cache-Control': 'public, max-age=300',
        },
      })
    } catch (error) {
      console.error(error)

      return Response.json(
        { error: 'Spotify data is temporarily unavailable' },
        { status: 502, headers },
      )
    }
  },
}
