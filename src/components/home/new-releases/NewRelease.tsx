import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";
import SpotifyAttribution from "@/components/ui/spotify-attribution";
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
      <Link
        href={`/albums/${createArtistSlug(album.artists[0].name)}/${createAlbumSlug(album.name)}?id=${album.id}`}
        className="block"
      >
        <Card className="hover:bg-accent overflow-hidden pt-0 transition-colors duration-200">
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
                sizes="100%"
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
            {album.external_urls?.spotify && (
              <div className="mb-2">
                <SpotifyAttribution
                  href={album.external_urls.spotify}
                  size="sm"
                  variant="badge"
                  asButton
                />
              </div>
            )}
            <Badge variant="secondary">New Release</Badge>
          </CardContent>
        </Card>
      </Link>
    </CarouselItem>
  );
}
