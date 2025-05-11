import { AlbumDetails } from "@/components/albums/album-details";
import { fetchAlbumFromSpotify } from "@/lib/spotifyService";
import { fetchQuery } from "convex/nextjs";
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
