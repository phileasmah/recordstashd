import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export async function fetchFromSpotify(endpoint: string, nextFetchRequestConfig?: NextFetchRequestConfig) {
  const token = await getSpotifyToken();
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...nextFetchRequestConfig,
  });

  if (!response.ok) {
    throw new Error(`Spotify API request failed: ${response.statusText}`);
  }

  return response.json();
}

async function getSpotifyToken() {
  // Try to get token from Convex
  const storedToken = await fetchQuery(api.spotify.getStoredToken);

  if (storedToken?.accessToken) {
    return storedToken.accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials not configured");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Spotify token");
  }

  const data = await response.json();

  // Store the token in Convex
  fetchMutation(api.spotify.storeToken, {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  });

  return data.access_token;
}
