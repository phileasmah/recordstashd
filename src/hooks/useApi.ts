import { SpotifySearchResults } from "@/types/spotify";

interface ApiError {
  error: string;
}

export function useApi() {
  const searchAlbums = async (
    query: string,
    limit: number = 5,
  ): Promise<SpotifySearchResults> => {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as ApiError).error || "Failed to search albums");
    }

    return data as SpotifySearchResults;
  };

  return {
    searchAlbums,
  };
}
