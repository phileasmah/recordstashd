import { NextRequest, NextResponse } from "next/server";
import { fetchFromSpotify, handleApiError } from "../utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") || "6";
    const country = searchParams.get("country") || "US";

    const newReleases = await fetchFromSpotify(
      `/browse/new-releases?limit=${limit}&country=${country}`
    );

    return NextResponse.json(newReleases);
  } catch (error) {
    return handleApiError(error, "Failed to fetch new releases");
  }
} 