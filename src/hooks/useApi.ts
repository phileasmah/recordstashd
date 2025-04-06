import { NewReleasesResponse, SpotifyAlbum, SpotifySearchResults } from "@/types/spotify";
import { useCallback } from "react";

interface ApiError {
  error: string;
}

export function useApi() {
  const searchAlbums = useCallback(
    async (query: string, limit: number = 5): Promise<SpotifySearchResults> => {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || "Failed to search albums");
      }

      return data as SpotifySearchResults;
    },
    []
  );

  const getAlbum = useCallback(
    async (params: { id?: string; artist?: string; album?: string }): Promise<SpotifyAlbum> => {
      const queryParams = new URLSearchParams();
      if (params.id) {
        queryParams.set("id", params.id);
      } else if (params.artist && params.album) {
        queryParams.set("artist", params.artist);
        queryParams.set("album", params.album);
      } else {
        throw new Error("Either id or both artist and album must be provided");
      }

      const response = await fetch(`/api/albums?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || "Failed to fetch album");
      }

      return data as SpotifyAlbum;
    },
    []
  );

  const getNewReleases = useCallback(
    async (params?: { limit?: number; country?: string }): Promise<NewReleasesResponse> => {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.set("limit", params.limit.toString());
      if (params?.country) queryParams.set("country", params.country);

      const response = await fetch(`/api/new-releases?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || "Failed to fetch new releases");
      }

      return data as NewReleasesResponse;
    },
    []
  );

  return {
    searchAlbums,
    getAlbum,
    getNewReleases,
  };
} 