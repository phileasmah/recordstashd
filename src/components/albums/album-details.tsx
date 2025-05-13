"use client";

import { SpotifyAlbum } from "@/types/spotify";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { AlbumDetailsCard } from "./album-details-card";
import { AlbumReview } from "./album-review";
import { AlbumReviews } from "./album-reviews";
import { AlbumTracks } from "./album-tracks";

interface AlbumDetailsProps {
  album: SpotifyAlbum;
  albumIdInDb: Id<"albums"> | null;
}

export function AlbumDetails({ album, albumIdInDb }: AlbumDetailsProps) {
  const [albumId, setAlbumId] = useState<Id<"albums"> | null>(albumIdInDb);
  const ratingStats = useQuery(
    api.reviewAggregates.getAlbumAverageRating,
    albumId ? { albumId } : "skip",
  );
  const averageRating = ratingStats?.average;
  const ratingCount = ratingStats?.count;

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
        <AlbumDetailsCard
          album={album}
          averageRating={averageRating}
          ratingCount={ratingCount}
          onOpenSpotify={handleOpenSpotify}
        />

        <div className="lg:w-1/3">
          <AlbumReview
            albumIdInDb={albumId}
            albumName={album.name}
            artistName={album.artists?.[0]?.name || ""}
            setAlbumIdInDb={setAlbumId}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr] lg:items-start">
        <AlbumTracks album={album} />
        <AlbumReviews albumIdInDb={albumId} />
      </div>
    </div>
  );
}
