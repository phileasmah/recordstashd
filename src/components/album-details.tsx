"use client";

import { SpotifyAlbum } from "@/types/spotify";
import { useQuery } from "convex/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { AlbumReview } from "./album-review";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AlbumDetailsProps {
  album: SpotifyAlbum;
}

export function AlbumDetails({ album }: AlbumDetailsProps) {
  const [showAllTracks, setShowAllTracks] = useState(false);
  const recentReviews = useQuery(api.reviews.getRecentReviews, {
    albumName: album.name,
    artistName: album.artists?.[0]?.name || "",
    limit: 50,
  });

  const displayedTracks = showAllTracks
    ? album.tracks?.items
    : album.tracks?.items?.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Album Info Section */}
        <Card className="flex-grow lg:w-2/3 py-0 flex-col md:flex-row">
          <div className="relative aspect-square w-full md:w-80">
            <Image
              src={album.images?.[0]?.url || "/placeholder.png"}
              alt={album.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <CardHeader className="flex-grow py-6 px-8">
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

      {/* Tabs Section */}
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recentReviews?.map((review, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {review.userId.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">User Review</CardTitle>
                      <CardDescription>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary">{review.rating} ★</Badge>
                    {review.review && (
                      <p className="text-muted-foreground text-sm">
                        {review.review}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!recentReviews || recentReviews.length === 0) && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">
                    No reviews yet. Be the first to review this album!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tracks" className="mt-6">
          <Card>
            <ScrollArea className="h-[400px]">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {displayedTracks?.map((track, index) => (
                    <div
                      key={track.id}
                      className="hover:bg-accent flex items-center gap-4 rounded-md p-2 transition-colors"
                    >
                      <div className="text-muted-foreground w-8 text-center">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">{track.name}</div>
                        <div className="text-muted-foreground text-sm">
                          {track.artists
                            ?.map((artist) => artist.name)
                            .join(", ")}
                        </div>
                      </div>
                      <div className="text-muted-foreground">
                        {formatDuration(track.duration_ms)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </ScrollArea>
            {album.tracks?.items && album.tracks.items.length > 5 && (
              <CardContent className="pt-2 pb-4">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowAllTracks(!showAllTracks)}
                >
                  {showAllTracks ? "Show Less" : "Show All Tracks"}
                  <ChevronDown
                    className={`ml-2 h-4 w-4 transition-transform ${showAllTracks ? "rotate-180" : ""}`}
                  />
                </Button>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
