"use client";

import { SpotifyAlbum } from "@/types/spotify";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AlbumReview } from "./album-review";
import { AlbumTracks } from "./album-tracks";
import { RecentReviews } from "./recent-reviews";

interface AlbumDetailsProps {
  album: SpotifyAlbum;
}

export function AlbumDetails({ album }: AlbumDetailsProps) {
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
              className="rounded-lg object-cover"
            />
          </div>
          <CardHeader className="flex-grow px-8 py-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold">
                  {album.name}
                </CardTitle>
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
            </div>
          </CardHeader>
        </Card>

        {/* Review Input Section */}
        <Card className="lg:w-1/3">
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>
              Share your thoughts about this album
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlbumReview
              albumName={album.name}
              artistName={album.artists?.[0]?.name || ""}
            />
          </CardContent>
        </Card>
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
