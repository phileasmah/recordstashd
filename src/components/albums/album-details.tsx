"use client";

import { SpotifyAlbum } from "@/types/spotify";
import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../../convex/_generated/api";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { RatingBadge } from "../ui/rating-badge";
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
      window.open(webUrl, '_blank');
    }, 500);
    // try opening the Spotify app via an iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = spotifyUri;
    document.body.appendChild(iframe);
    // clear fallback if app opened (window blur)
    const clearFallback = () => {
      window.clearTimeout(fallbackTimeout);
      window.removeEventListener('blur', clearFallback);
    };
    window.addEventListener('blur', clearFallback);
    // clean up iframe after
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Album Info Section */}
        <Card className="flex-grow flex-col py-0 md:flex-row lg:w-2/3">
          <div className="relative aspect-square w-full md:w-80">
            <Image
              src={album.images?.[0]?.url || "/placeholder.png"}
              alt={album.name}
              fill
              sizes="100%"
              priority
              className="rounded-lg object-cover"
            />
          </div>
          <CardHeader className="flex-grow px-8 py-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-end gap-3">
                  <CardTitle className="text-3xl font-bold">
                    {album.name}
                  </CardTitle>
                  {averageRating ? (
                    <RatingBadge
                      prefix={"Average "}
                      rating={averageRating}
                      hoverText={`${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`}
                    />
                  ) : (
                    <Badge variant="secondary">No ratings yet</Badge>
                  )}
                </div>
                <CardDescription className="text-xl">
                  {album.artists?.map((artist) => artist.name).join(", ")}
                </CardDescription>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base">
                <div className="text-muted-foreground">Release Date:</div>
                <div>{album.release_date || "Unknown"}</div>
                <div className="text-muted-foreground">Total Tracks:</div>
                <div>{album.total_tracks || "Unknown"}</div>
                <div className="text-muted-foreground">Label:</div>
                <div>{album.label || "Unknown"}</div>
              </div>
              <Button
                className="bg-spotify text-white hover:bg-spotify rounded-full text-base"
                onClick={handleOpenSpotify}
              >
                <Image
                  src="/spotify_logo_black.svg"
                  alt="Spotify"
                  width={22}
                  height={22}
                />
                Listen on Spotify
              </Button>
            </div>
          </CardHeader>
        </Card>

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
