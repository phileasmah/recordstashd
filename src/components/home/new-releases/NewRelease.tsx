import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import { SpotifyAlbum } from "@/types/spotify";
import { createAlbumSlug, createArtistSlug } from "@/utils/slugify";
import Image from "next/image";
import Link from "next/link";

interface NewReleaseProps {
  album: SpotifyAlbum;
}

export function NewRelease({ album }: NewReleaseProps) {
  return (
    <CarouselItem className="md:basis-1/3 lg:basis-1/5 py-1">
      <Card className="hover:bg-accent overflow-hidden pt-0 transition-colors duration-200">
        {album.images[0] && (
          <Link
            href={`/albums/${createArtistSlug(album.artists[0].name)}/${createAlbumSlug(album.name)}?id=${album.id}`}
            className="block"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={
                  album.images.reduce((prev, curr) =>
                    prev.width > curr.width ? prev : curr,
                  ).url
                }
                alt={album.name}
                fill
                sizes="100%"
                className="object-cover"
              />
            </div>
          </Link>
        )}
        <CardHeader>
          <Link
            href={`/albums/${createArtistSlug(album.artists[0].name)}/${createAlbumSlug(album.name)}?id=${album.id}`}
            className="block"
          >
            <CardTitle className="line-clamp-1 text-base">
              {album.name}
            </CardTitle>
            <CardDescription className="line-clamp-1 text-sm">
              {album.artists.map((a) => a.name).join(", ")}
            </CardDescription>
          </Link>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Button asChild variant="outline" size="sm" className="rounded-3xl hover:rounded-md transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]">
            <Link
              href={album.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${album.name} on Spotify`}
            >
              <Image
                src="/spotify_logo_green.svg"
                alt=""
                width={16}
                height={16}
              />
              <span>Open on Spotify</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </CarouselItem>
  );
}
