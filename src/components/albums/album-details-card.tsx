"use client";

import { SpotifyAlbum } from "@/types/spotify";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { RatingBadge } from "../ui/rating-badge";

interface AlbumDetailsCardProps {
  album: SpotifyAlbum;
  averageRating?: number;
  reviewCount?: number;
  onOpenSpotify: () => void;
}

export function AlbumDetailsCard({
  album,
  averageRating,
  reviewCount,
  onOpenSpotify,
}: AlbumDetailsCardProps) {
  return (
    <Card className="flex-grow flex-col py-0 md:flex-row lg:w-2/3 bg-transparent border-none">
      <Image
        src={album.images?.[0]?.url || "/placeholder.png"}
        alt={album.name}
        width={330}
        height={330}
        sizes="100%"
        priority
        className="w-full rounded-sm md:h-[330px] md:w-[330px] lg:h-[320px] lg:w-[320px] my-auto ml-0 md:ml-8"
      />
      <CardHeader className="flex-grow px-8 py-6 my-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-end gap-3 lg:flex-col lg:items-start lg:gap-1 xl:flex-row xl:items-end xl:gap-3">
              <CardTitle className="text-3xl font-bold">
                {album.name}
              </CardTitle>
              {averageRating ? (
                <RatingBadge
                  prefix={"Average "}
                  rating={averageRating}
                  hoverText={`${reviewCount} ${
                    reviewCount === 1 ? "review" : "reviews"
                  }`}
                />
              ) : (
                <Badge variant="secondary">No ratings yet</Badge>
              )}
            </div>
            <CardDescription className="text-xl">
              {album.artists?.map((artist) => artist.name).join(", ")}
            </CardDescription>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-base lg:gap-y-1 xl:gap-y-2">
            <div className="text-muted-foreground">Release Date:</div>
            <div className="lg:row-start-2 xl:row-start-auto">
              {album.release_date || "Unknown"}
            </div>
            <div className="text-muted-foreground lg:col-start-2 lg:row-start-1 xl:col-start-auto xl:row-start-auto">
              Total Tracks:
            </div>
            <div className="lg:col-start-2 lg:row-start-2 xl:col-start-auto xl:row-start-auto">
              {album.total_tracks || "Unknown"}
            </div>
            <div className="text-muted-foreground lg:col-start-1 lg:row-start-3 xl:col-start-auto xl:row-start-auto">
              Label:
            </div>
            <div className="lg:col-start-1 lg:row-start-4 xl:col-start-auto xl:row-start-auto">
              {album.label || "Unknown"}
            </div>
          </div>
          <Button
            className="bg-spotify hover:bg-spotify rounded-full text-base text-white"
            onClick={onOpenSpotify}
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
  );
} 