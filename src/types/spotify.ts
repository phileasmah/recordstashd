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

export interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  artists: {
    id: string
    name: string
  }[]
}

export interface SpotifySearchResults {
  artists: {
    items: SpotifyArtist[]
  }
  albums: {
    items: SpotifyAlbum[]
  }
} 