import { AlbumDetails } from "@/components/album-details";
import { getAlbum } from "@/lib/apiRequests";
import { Suspense } from "react";
import Loading from "./loading";

interface AlbumPageProps {
  params: {
    artistName: string;
    albumName: string;
  };
  searchParams: {
    id?: string;
  };
}

async function AlbumPageContent({ params, searchParams }: AlbumPageProps) {
  const { artistName, albumName } = params;
  const { id } = searchParams;

  try {
    const albumData = await getAlbum(
      id ? { id } : { artist: artistName, album: albumName },
    );

    return (
      <div className="container mx-auto px-4 py-8">
        <AlbumDetails album={albumData} />
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

export default function AlbumPage({ params, searchParams }: AlbumPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <AlbumPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
