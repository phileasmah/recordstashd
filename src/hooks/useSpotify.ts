"use client";
import { useCallback, useState } from "react";

interface SpotifyError {
  message: string;
  status?: number;
}

export function useSpotify() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SpotifyError | null>(null);

  const fetchWithToken = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        // First get the token from our API
        const tokenResponse = await fetch("/api/spotify/token");
        if (!tokenResponse.ok) {
          throw new Error("Failed to get Spotify token");
        }
        const { token } = await tokenResponse.json();

        // Then make the actual Spotify API request
        const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw {
            message: "Spotify API request failed",
            status: response.status,
          };
        }

        return await response.json();
      } catch (err) {
        setError(err as SpotifyError);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const searchAlbums = useCallback(
    async (query: string, limit: number = 5) => {
      return fetchWithToken(
        `/search?q=${encodeURIComponent(query)}&type=album&limit=${limit}`,
      );
    },
    [fetchWithToken],
  );

  const getAlbum = useCallback(
    async (albumId: string) => {
      return fetchWithToken(`/albums/${albumId}`);
    },
    [fetchWithToken],
  );

  return {
    isLoading,
    error,
    fetchWithToken,
    searchAlbums,
    getAlbum,
  };
}
