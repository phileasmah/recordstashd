import {
  NewReleasesResponse,
  SpotifyAlbum,
  SpotifySearchResults,
} from "@/types/spotify";

interface ApiError {
  error: string;
}

export const searchAlbums = async (
  query: string,
  limit: number = 5,
): Promise<SpotifySearchResults> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as ApiError).error || "Failed to search albums");
  }

  return data as SpotifySearchResults;
};

export const getAlbum = async (params: {
  id?: string;
  artist?: string;
  album?: string;
}): Promise<SpotifyAlbum> => {
  const queryParams = new URLSearchParams();
  if (params.id) {
    queryParams.set("id", params.id);
  } else if (params.artist && params.album) {
    queryParams.set("artist", params.artist);
    queryParams.set("album", params.album);
  } else {
    throw new Error("Either id or both artist and album must be provided");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/albums?${queryParams}`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as ApiError).error || "Failed to fetch album");
  }

  return data as SpotifyAlbum;
};

export const getNewReleases = async (params?: {
  limit?: number;
  country?: string;
}): Promise<NewReleasesResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.country) queryParams.set("country", params.country);

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/new-releases?${queryParams}`;
  console.log("Fetching new releases from URL:", url);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "Failed to fetch new releases. Status:",
      response.status,
      "Response text:",
      errorText,
    );
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(
        errorJson.error ||
          `Failed to fetch new releases. Status: ${response.status}`,
      );
    } catch (e) {
      throw new Error(
        `Failed to fetch new releases. Status: ${response.status}. Response: ${errorText.substring(0, 200)}... ${e}`,
      );
    }
  }

  const data = await response.json();
  return data as NewReleasesResponse;
};
