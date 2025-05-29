import { AlbumDetails } from "@/components/albums/album-details";
import { fetchAlbumFromSpotify } from "@/lib/spotifyService";
import { createAlbumSlug, createArtistSlug } from "@/utils/slugify";
import { fetchQuery } from "convex/nextjs";
import Link from "next/link";
import { api } from "../../../../../convex/_generated/api";

interface AlbumPageProps {
  params: Promise<{
    artistName: string;
    albumName: string;
  }>;
  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function AlbumPage({
  params,
  searchParams,
}: AlbumPageProps) {
  const { artistName, albumName } = await params;
  const { id } = await searchParams;

  try {
    const albumData = await fetchAlbumFromSpotify(
      id ? { id } : { artist: artistName, album: albumName },
    );

    // If we fetched by ID, validate that the returned album matches the expected artist and album names
    if (id) {
      const expectedArtistSlug = artistName; // This is already a slug from the URL
      const expectedAlbumSlug = albumName; // This is already a slug from the URL
      const actualArtistName = albumData.artists[0]?.name || '';
      const actualAlbumName = albumData.name || '';

      // Convert the actual Spotify data to slugs for comparison
      const actualArtistSlug = createArtistSlug(actualArtistName);
      const actualAlbumSlug = createAlbumSlug(actualAlbumName);

      if (
        expectedArtistSlug !== actualArtistSlug ||
        expectedAlbumSlug !== actualAlbumSlug
      ) {
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-destructive mb-6">Wrong Album Found</h1>
              <p className="text-lg text-muted-foreground mb-6">
                The ID led to a different album than expected.
              </p>
              
              <div className="bg-muted p-4 rounded-lg text-sm mb-8">
                <p><strong>Expected:</strong> "{decodeURIComponent(expectedAlbumSlug)}" by {decodeURIComponent(expectedArtistSlug)}</p>
                <p><strong>Found:</strong> "{actualAlbumName}" by {actualArtistName}</p>
              </div>

              <Link
                href={`/albums/${artistName}/${albumName}`}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors shadow-lg hover:shadow-xl"
              >
                Find the Right Album
              </Link>
            </div>
          </div>
        );
      }
    }
  
    const albumIdInDb = await fetchQuery(api.album.getAlbumIdIfExists, {
      artistName: albumData.artists[0].name,
      albumName: albumData.name,
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <AlbumDetails album={albumData} albumIdInDb={albumIdInDb} />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load album data."}
        </div>
      </div>
    );
  }
}
