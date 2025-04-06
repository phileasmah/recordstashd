import { getSpotifyToken } from "@/lib/spotify";
import { NextResponse } from 'next/server';

export async function fetchFromSpotify(endpoint: string) {
  const token = await getSpotifyToken();
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

export function handleApiError(error: unknown, customMessage: string) {
  console.error(`${customMessage}:`, error);
  return NextResponse.json(
    { error: customMessage },
    { status: 500 }
  );
} 