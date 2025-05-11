import { fetchFromSpotify } from "@/lib/spotify";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "../utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const limit = "5";

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const searchResults = await fetchFromSpotify(
      `/search?q=${encodeURIComponent(query)}&type=album&limit=${limit}`
    );

    return NextResponse.json(searchResults);
  } catch (error) {
    return handleApiError(error, "Failed to search albums");
  }
} 