import {
  NewReleasesResponse,
  SpotifyAlbum,
  SpotifySearchResults,
} from "@/types/spotify";
import { fetchFromSpotify } from "./spotify";

export async function fetchNewReleasesFromSpotify(params?: {
  limit?: number;
  country?: string;
}): Promise<NewReleasesResponse> {
  const limit = params?.limit || 6;
  // const country = params?.country || "US";
  const endpoint = `/browse/new-releases?limit=${limit}`;

  try {
    const data = await fetchFromSpotify(endpoint, {
      next: { revalidate: 60 * 60 * 24 * 2 },
    });
    return data as NewReleasesResponse;
  } catch (error) {
    throw new Error(
      `Error in fetchNewReleasesFromSpotify calling fetchFromSpotify with endpoint '${endpoint}': ${error}`,
    );
  }
}

export async function fetchAlbumFromSpotify(params: {
  id?: string;
  artist?: string;
  album?: string;
}): Promise<SpotifyAlbum> {
  if (!params.id && (!params.artist || !params.album)) {
    throw new Error(
      "Either id or both artist and album must be provided to fetchAlbumFromSpotifyService",
    );
  }

  try {
    if (params.id) {
      const albumData = await fetchFromSpotify(`/albums/${params.id}`);
      return albumData as SpotifyAlbum;
    } else {
      const searchEndpoint = `/search?q=${encodeURIComponent(
        `artist:${params.artist} album:${params.album}`,
      )}&type=album&limit=1`;
      const searchResults = (await fetchFromSpotify(
        searchEndpoint,
      )) as SpotifySearchResults;
      const foundAlbum = searchResults.albums?.items?.[0];

      if (!foundAlbum) {
        throw new Error(
          `Album not found on Spotify for artist '${params.artist}', album '${params.album}'`,
        );
      }

      const albumDetailEndpoint = `/albums/${foundAlbum.id}`;
      const albumData = await fetchFromSpotify(albumDetailEndpoint);

      return albumData as SpotifyAlbum;
    }
  } catch (error) {
    throw new Error(
      `Error in fetchAlbumFromSpotify calling fetchFromSpotify with params '${JSON.stringify(params)}': ${error}`,
    );
  }
}
