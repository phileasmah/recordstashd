import { AlbumDetails } from "@/components/albums/album-details";
import { getAlbum } from "@/lib/apiRequests";

interface AlbumPageProps {
  params: Promise<{
    artistName: string;
    albumName: string;
  }>;
  searchParams: Promise<{
    id?: string;
  }>;
}

async function AlbumPageContent({ params, searchParams }: AlbumPageProps) {
  const { artistName, albumName } = await params;
  const { id } = await searchParams;

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

export default async function AlbumPage(props: AlbumPageProps) {
  const searchParams = props.searchParams;
  const params = props.params;
  return <AlbumPageContent params={params} searchParams={searchParams} />;
}
