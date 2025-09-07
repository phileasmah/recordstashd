"use client";

import { SpotifyAlbum } from "@/types/spotify";
import Image from "next/image";
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { RatingBadge } from "../ui/rating-badge";

interface AlbumDetailsCardProps {
  album: SpotifyAlbum;
  averageRating?: number;
  ratingCount?: number;
  onOpenSpotify: () => void;
}

export function AlbumDetailsCard({
  album,
  averageRating,
  ratingCount,
  onOpenSpotify,
}: AlbumDetailsCardProps) {
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);

  useEffect(() => {
    const extractAndSetColor = async () => {
      if (album.images?.[0]?.url) {
        try {
          const palette = await Vibrant.from(album.images[0].url).getPalette();
          setBackgroundColor(palette.LightVibrant?.hex || "#505050");
        } catch (error) {
          console.error("Failed to extract colors:", error);
          // Set a default darker grey background on error
          setBackgroundColor("#505050");
        }
      } else {
        // Set a default darker grey background if no image URL
        setBackgroundColor("#505050");
      }
    };

    extractAndSetColor();
  }, [album.images]);

  const gradientStyle = backgroundColor
    ? {
        background: `radial-gradient(ellipse at center, ${backgroundColor}2a 0%, ${backgroundColor}15 32%, ${backgroundColor}08 50%, transparent 68%)`,
      }
    : {};

  return (
    <Card
      className="relative flex-grow flex-col overflow-hidden border-0 bg-transparent py-0 md:flex-row lg:w-2/3"
      style={gradientStyle}
    >
      <Image
        src={album.images?.[0]?.url || "/placeholder.png"}
        alt={album.name}
        width={330}
        height={330}
        sizes="100%"
        priority
        className="my-auto ml-0 w-full rounded-sm md:ml-8 md:h-[330px] md:w-[330px] lg:h-[320px] lg:w-[320px]"
      />
      <CardHeader className="my-auto flex-grow px-8 py-6">
        <div className="space-y-6">
          <div className="flex flex-col items-start gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">{album.name}</CardTitle>
              <CardDescription className="text-xl">
                {album.artists?.map((artist) => artist.name).join(", ")}
              </CardDescription>
            </div>
            <div className="xl:mt-1">
              {averageRating ? (
                <RatingBadge
                  rating={averageRating}
                  hoverText={`${ratingCount} ${
                    ratingCount === 1 ? "rating" : "ratings"
                  }`}
                  className="xl:mt-1"
                />
              ) : (
                <Badge variant="secondary">No ratings yet</Badge>
              )}
            </div>
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
            variant="default"
            size="lg"
            className="bg-spotify hover:bg-spotify/90 text-black rounded-3xl hover:rounded-md transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]"
            onClick={onOpenSpotify}
          >
            <Image src="/spotify_logo_black.svg" alt="" width={20} height={20} />
            <span>Open on Spotify</span>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
