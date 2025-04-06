import { getSpotifyToken } from "@/lib/spotify";
import { NextRequest } from "next/server";

async function fetchFromSpotify(endpoint: string, token: string) {
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const artist = searchParams.get("artist");
    const album = searchParams.get("album");

    if (!id && (!artist || !album)) {
      return Response.json(
        { error: "Either id or both artist and album must be provided" },
        { status: 400 }
      );
    }

    const token = await getSpotifyToken();

    if (id) {
      // Direct album fetch
      const albumData = await fetchFromSpotify(`/albums/${id}`, token);
      return Response.json(albumData);
    } else {
      // Search and then fetch complete album data
      const searchQuery = `${artist} ${album}`;
      const searchResults = await fetchFromSpotify(
        `/search?q=${encodeURIComponent(searchQuery)}&type=album&limit=1`,
        token
      );

      const foundAlbum = searchResults.albums?.items?.[0];
      if (!foundAlbum) {
        return Response.json({ error: "Album not found" }, { status: 404 });
      }

      // Get complete album data
      const albumData = await fetchFromSpotify(
        `/albums/${foundAlbum.id}`,
        token
      );
      return Response.json(albumData);
    }
  } catch (error) {
    console.error("Album API error:", error);
    return Response.json(
      { error: "Failed to fetch album data" },
      { status: 500 }
    );
  }
} 