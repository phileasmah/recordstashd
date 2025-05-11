import { SpotifySearchResults } from "@/types/spotify";
import { useMemo } from "react";

interface ApiError {
  error: string;
}

export function useApi() {
  const searchAlbums = useMemo(
    () => async (query: string): Promise<SpotifySearchResults> => {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || "Failed to search albums");
      }
      return data as SpotifySearchResults;
    },
    []
  );

  return {
    searchAlbums,
  };
}
