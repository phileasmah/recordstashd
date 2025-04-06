"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useApi } from "@/hooks/useApi";
import { SpotifyAlbum } from "@/types/spotify";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export function NewReleases() {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getNewReleases } = useApi();

  useEffect(() => {
    async function fetchNewReleases() {
      try {
        const data = await getNewReleases({ limit: 6 });
        setAlbums(data.albums.items);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch new releases:", error);
        setError("Failed to load new releases");
      } finally {
        setLoading(false);
      }
    }

    fetchNewReleases();
  }, [getNewReleases]);

  if (loading) {
    return (
      <Carousel className="w-full">
        <CarouselContent>
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/5">
              <Card className="overflow-hidden pt-0">
                <Skeleton className="aspect-square w-full" />
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {albums.map((album) => (
          <CarouselItem key={album.id} className="md:basis-1/3 lg:basis-1/5">
            <Link
              href={`/albums/${encodeURIComponent(album.artists[0].name)}/${encodeURIComponent(album.name)}?id=${album.id}`}
              className="block"
            >
              <Card className="overflow-hidden pt-0 transition-colors duration-200 hover:bg-accent">
                {album.images[0] && (
                  <div className="relative aspect-square w-full">
                    <Image
                      src={
                        album.images.reduce((prev, curr) =>
                          prev.width > curr.width ? prev : curr,
                        ).url
                      }
                      alt={album.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-base">
                    {album.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-1 text-sm">
                    {album.artists.map((a) => a.name).join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">New Release</Badge>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
