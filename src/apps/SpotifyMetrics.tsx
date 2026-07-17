import { useEffect, useState } from 'react'

type Tab = 'overview' | 'artists' | 'tracks' | 'recent' | 'monthly'
type TimeRange = 'short_term' | 'medium_term' | 'long_term'

interface ArtistMetric {
  id: string
  name: string
  image: string | null
  url: string
}

interface TrackMetric {
  id: string
  name: string
  artists: string[]
  album: string
  image: string | null
  url: string
}

interface RecentMetric extends TrackMetric {
  playedAt: string
}

interface MonthlyMetric extends TrackMetric {
  addedAt: string
}

interface SpotifyMetricsResponse {
  currentlyPlaying: (TrackMetric & { isPlaying: boolean }) | null
  topArtists: ArtistMetric[]
  topTracks: TrackMetric[]
  recentlyPlayed: RecentMetric[]
  songOfMonth: MonthlyMetric[]
  updatedAt: string
}

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'artists', label: 'Artists' },
  { id: 'tracks', label: 'Tracks' },
  { id: 'recent', label: 'Recent' },
  { id: 'monthly', label: 'Monthly Pick' },
]

const ranges: Array<{ id: TimeRange; label: string }> = [
  { id: 'short_term', label: '4 weeks' },
  { id: 'medium_term', label: '6 months' },
  { id: 'long_term', label: '1 year' },
]

const spotifyEndpoint = import.meta.env.VITE_SPOTIFY_METRICS_URL?.replace(/\/$/, '')

function formatMonth(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Chicago',
  })
}

function Artwork({ src, alt, size = 40 }: { src: string | null; alt: string; size?: number }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <span className="spotify-artwork-placeholder" style={{ width: size, height: size }} />
  }

  return (
    <img
      className="spotify-artwork"
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
    />
  )
}

function TrackRows({ tracks, recent = false }: { tracks: Array<TrackMetric | RecentMetric>; recent?: boolean }) {
  return (
    <ol className="spotify-list">
      {tracks.map((track, index) => (
        <li key={`${track.id}-${recent && 'playedAt' in track ? track.playedAt : index}`}>
          <span className="spotify-rank">{index + 1}</span>
          <Artwork src={track.image} alt="" />
          <span className="spotify-list-copy">
            <a href={track.url} target="_blank" rel="noreferrer">{track.name}</a>
            <span>{track.artists.join(', ')}</span>
          </span>
          <span className="spotify-list-detail">
            {recent && 'playedAt' in track
              ? new Date(track.playedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
              : track.album}
          </span>
        </li>
      ))}
    </ol>
  )
}

export default function SpotifyMetrics() {
  const [tab, setTab] = useState<Tab>('overview')
  const [range, setRange] = useState<TimeRange>('medium_term')
  const [metrics, setMetrics] = useState<SpotifyMetricsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(Boolean(spotifyEndpoint))
  const [refreshRequest, setRefreshRequest] = useState(0)

  useEffect(() => {
    if (!spotifyEndpoint) return

    const controller = new AbortController()

    fetch(`${spotifyEndpoint}/metrics?time_range=${range}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        return response.json() as Promise<SpotifyMetricsResponse>
      })
      .then((response) => {
        setMetrics(response)
        setError(null)
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return
        setError(reason instanceof Error ? reason.message : 'Unable to load Spotify metrics')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [range, refreshRequest])

  const featuredTrack = metrics?.currentlyPlaying ?? metrics?.recentlyPlayed[0] ?? null
  const currentMonthlySong = metrics?.songOfMonth?.[0] ?? null
  const previousMonthlySongs = metrics?.songOfMonth?.slice(1) ?? []

  return (
    <div className="spotify-app">
      <div className="spotify-menu"><span>File</span><span>View</span><span>Help</span></div>

      <menu role="tablist" className="spotify-tabs">
        {tabs.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </menu>

      <div className="sunken-panel spotify-panel">
        {!spotifyEndpoint && (
          <div className="spotify-message">
            Set VITE_SPOTIFY_METRICS_URL to connect this window to the Spotify Worker.
          </div>
        )}

        {spotifyEndpoint && loading && !metrics && <div className="spotify-message">Loading Spotify metrics...</div>}

        {spotifyEndpoint && error && (
          <div className="spotify-message">
            <p>{error}</p>
            <button
              onClick={() => {
                setLoading(true)
                setError(null)
                setRefreshRequest((value) => value + 1)
              }}
            >
              Retry
            </button>
          </div>
        )}

        {metrics && !error && tab === 'overview' && (
          <div className="spotify-overview">
            {featuredTrack ? (
              <>
                <Artwork src={featuredTrack.image} alt={`Artwork for ${featuredTrack.name}`} size={96} />
                <div className="spotify-featured-copy">
                  <strong>{metrics.currentlyPlaying?.isPlaying ? 'Currently playing' : 'Last played'}</strong>
                  <a href={featuredTrack.url} target="_blank" rel="noreferrer">{featuredTrack.name}</a>
                  <span>{featuredTrack.artists.join(', ')}</span>
                  <span>{featuredTrack.album}</span>
                  <a className="spotify-open-button" href={featuredTrack.url} target="_blank" rel="noreferrer">
                    Open in Spotify
                  </a>
                </div>
              </>
            ) : (
              <div className="spotify-message">No recent listening activity was found.</div>
            )}
          </div>
        )}

        {metrics && !error && tab === 'artists' && (
          <ol className="spotify-list">
            {metrics.topArtists.map((artist, index) => (
              <li key={artist.id}>
                <span className="spotify-rank">{index + 1}</span>
                <Artwork src={artist.image} alt="" />
                <span className="spotify-list-copy">
                  <a href={artist.url} target="_blank" rel="noreferrer">{artist.name}</a>
                  <span>Artist</span>
                </span>
              </li>
            ))}
          </ol>
        )}

        {metrics && !error && tab === 'tracks' && <TrackRows tracks={metrics.topTracks} />}
        {metrics && !error && tab === 'recent' && <TrackRows tracks={metrics.recentlyPlayed} recent />}
        {metrics && !error && tab === 'monthly' && (
          <div className="spotify-monthly">
            {currentMonthlySong ? (
              <>
                <section className="spotify-monthly-featured">
                  <Artwork
                    src={currentMonthlySong.image}
                    alt={`Artwork for ${currentMonthlySong.name}`}
                    size={96}
                  />
                  <div className="spotify-featured-copy">
                    <strong>Song of the Month — {formatMonth(currentMonthlySong.addedAt)}</strong>
                    <a href={currentMonthlySong.url} target="_blank" rel="noreferrer">
                      {currentMonthlySong.name}
                    </a>
                    <span>{currentMonthlySong.artists.join(', ')}</span>
                    <span>{currentMonthlySong.album}</span>
                    <a className="spotify-open-button" href={currentMonthlySong.url} target="_blank" rel="noreferrer">
                      Open in Spotify
                    </a>
                  </div>
                </section>

                {previousMonthlySongs.length > 0 && (
                  <section className="spotify-monthly-history">
                    <h3>Previous selections</h3>
                    <ol className="spotify-list">
                      {previousMonthlySongs.map((song) => (
                        <li key={`${song.id}-${song.addedAt}`}>
                          <Artwork src={song.image} alt="" />
                          <span className="spotify-list-copy">
                            <a href={song.url} target="_blank" rel="noreferrer">{song.name}</a>
                            <span>{song.artists.join(', ')}</span>
                          </span>
                          <span className="spotify-list-detail">{formatMonth(song.addedAt)}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}
              </>
            ) : (
              <div className="spotify-message">No monthly selections were found.</div>
            )}
          </div>
        )}
      </div>

      {(tab === 'artists' || tab === 'tracks') && (
        <fieldset className="spotify-range">
          <legend>Listening period</legend>
          <menu className="spotify-periods">
          {ranges.map((item) => (
            <button 
              key={item.id}
            type="button"
            aria-pressed={range === item.id}
            onClick={() => {
              setLoading(true)
              setError(null)
              setRange(item.id)
            }}
          >
            {item.label}
          </button>
        ))}
        </menu>
      </fieldset>
      )}

      <div className="status-bar">
        <p className="status-bar-field">
          {loading ? 'Updating...' : metrics ? `Updated ${new Date(metrics.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Not connected'}
        </p>
        <p className="status-bar-field">Data provided by Spotify</p>
      </div>
    </div>
  )
}
