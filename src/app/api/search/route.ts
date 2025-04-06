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
    const query = searchParams.get("q");
    const limit = searchParams.get("limit") || "5";

    if (!query) {
      return Response.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const token = await getSpotifyToken();
    const searchResults = await fetchFromSpotify(
      `/search?q=${encodeURIComponent(query)}&type=album&limit=${limit}`,
      token
    );

    return Response.json(searchResults);
  } catch (error) {
    console.error("Search API error:", error);
    return Response.json(
      { error: "Failed to search albums" },
      { status: 500 }
    );
  }
} 