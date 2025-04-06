import { getSpotifyToken } from '@/lib/spotify';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = await getSpotifyToken();
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Spotify token' },
      { status: 500 }
    );
  }
} 