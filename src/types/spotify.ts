export interface SpotifyImage {
  url: string
  height: number
  width: number
}

export interface SpotifyArtist {
  id: string
  name: string
  images: SpotifyImage[]
  genres: string[]
}

export interface SpotifyTrack {
  id: string
  name: string
  duration_ms: number
  artists: {
    id: string
    name: string
  }[]
}

export interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  artists: {
    id: string
    name: string
  }[]
  release_date: string
  total_tracks: number
  label: string
  tracks?: {
    items: SpotifyTrack[]
  }
}

export interface SpotifySearchResults {
  artists: {
    items: SpotifyArtist[]
  }
  albums: {
    items: SpotifyAlbum[]
  }
} 