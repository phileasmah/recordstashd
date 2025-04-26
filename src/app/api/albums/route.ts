import { NextRequest, NextResponse } from "next/server";
import { fetchFromSpotify, handleApiError } from "../utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const artist = searchParams.get("artist");
    const album = searchParams.get("album");

    if (!id && (!artist || !album)) {
      return NextResponse.json(
        { error: "Either id or both artist and album must be provided" },
        { status: 400 },
      );
    }

    if (id) {
      // Direct album fetch
      const albumData = await fetchFromSpotify(`/albums/${id}`);
      return NextResponse.json(albumData);
    } else {
      // Search and then fetch complete album data
      const searchResults = await fetchFromSpotify(
        `/search?q=${`artist%3A${artist}%20album%3A${album}`}&type=album&limit=1`,
      );

      const foundAlbum = searchResults.albums?.items?.[0];
      if (!foundAlbum) {
        return NextResponse.json({ error: "Album not found" }, { status: 404 });
      }

      // Get complete album data
      const albumData = await fetchFromSpotify(`/albums/${foundAlbum.id}`);
      return NextResponse.json(albumData);
    }
  } catch (error) {
    return handleApiError(error, "Failed to fetch album data");
  }
}
