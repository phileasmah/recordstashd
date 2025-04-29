"use client";

import { SpotifyAlbum } from "@/types/spotify";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AlbumDetailsCard } from "./album-details-card";
import { AlbumReview } from "./album-review";
import { AlbumTracks } from "./album-tracks";
import { RecentReviews } from "./recent-reviews";

interface AlbumDetailsProps {
  album: SpotifyAlbum;
}

export function AlbumDetails({ album }: AlbumDetailsProps) {
  const ratingStats = useQuery(api.reviewAggregates.getAlbumAverageRating, {
    albumName: album.name,
    artistName: album.artists?.[0]?.name || "",
  });
  const averageRating = ratingStats?.average;
  const reviewCount = ratingStats?.count;

  // handler to open Spotify app if installed, with web fallback
  const handleOpenSpotify = () => {
    const webUrl = album.external_urls?.spotify;
    const spotifyUri = `spotify:album:${album.id}`;
    // fallback to web after a delay
    const fallbackTimeout = window.setTimeout(() => {
      window.open(webUrl, "_blank");
    }, 500);
    // try opening the Spotify app via an iframe
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = spotifyUri;
    document.body.appendChild(iframe);
    // clear fallback if app opened (window blur)
    const clearFallback = () => {
      window.clearTimeout(fallbackTimeout);
      window.removeEventListener("blur", clearFallback);
    };
    window.addEventListener("blur", clearFallback);
    // clean up iframe after
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Album Info Section */}
        <AlbumDetailsCard
          album={album}
          averageRating={averageRating}
          reviewCount={reviewCount}
          onOpenSpotify={handleOpenSpotify}
        />

        {/* Review Input Section */}
        <div className="lg:w-1/3">
          <AlbumReview
            albumName={album.name}
            artistName={album.artists?.[0]?.name || ""}
          />
        </div>
      </div>

      {/* Tracks and Reviews Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AlbumTracks album={album} />

        {/* Reviews Section */}
        <RecentReviews
          albumName={album.name}
          artistName={album.artists?.[0]?.name || ""}
        />
      </div>
    </div>
  );
}
