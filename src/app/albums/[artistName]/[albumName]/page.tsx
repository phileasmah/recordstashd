"use client";

import { AlbumDetails } from "@/components/album-details";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/useApi";
import { SpotifyAlbum } from "@/types/spotify";
import { useSearchParams } from "next/navigation";
import { Fragment, use, useEffect, useState } from "react";

interface AlbumPageProps {
  params: Promise<{
    artistName: string;
    albumName: string;
  }>;
}

export default function AlbumPage({ params }: AlbumPageProps) {
  const { artistName, albumName } = use(params);
  const searchParams = useSearchParams();
  const albumId = searchParams.get("id");
  const [albumData, setAlbumData] = useState<SpotifyAlbum | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAlbum } = useApi();

  useEffect(() => {
    const fetchAlbum = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getAlbum(
          albumId
            ? { id: albumId }
            : { artist: artistName, album: albumName }
        );
        setAlbumData(data);
      } catch (err: unknown) {
        console.error("Error fetching album:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load album data."
        );
        setAlbumData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId, artistName, albumName, getAlbum]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Album Cover Skeleton */}
            <Card className="relative w-64 h-64 shrink-0 overflow-hidden">
              <Skeleton className="w-full h-full" />
            </Card>
            
            <div className="space-y-4 flex-grow">
              {/* Title and Artist Skeletons */}
              <div className="space-y-2">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>

              {/* Album Info Skeletons */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3].map((i) => (
                    <Fragment key={i}>
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-32" />
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tracks Section Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                  <Skeleton className="h-6 w-8" />
                  <div className="flex-grow space-y-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  if (!albumData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-muted-foreground">Album not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AlbumDetails album={albumData} />
    </div>
  );
}
