import { SpotifyAlbum } from "@/types/spotify";
import Image from "next/image";
import { Card } from "./ui/card";

interface AlbumDetailsProps {
  album: SpotifyAlbum;
}

export function AlbumDetails({ album }: AlbumDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="relative w-64 h-64 shrink-0 overflow-hidden">
          <Image
            src={album.images?.[0]?.url || "/placeholder.png"}
            alt={album.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 256px"
            priority
          />
        </Card>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold">{album.name}</h1>
            <p className="text-xl text-muted-foreground">
              {album.artists?.map(artist => artist.name).join(", ")}
            </p>
          </div>

          {/* Add more album metadata here when available from the API */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">About this Album</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Release Date:</div>
              <div>{album.release_date || "Unknown"}</div>
              <div className="text-muted-foreground">Total Tracks:</div>
              <div>{album.total_tracks || "Unknown"}</div>
              <div className="text-muted-foreground">Label:</div>
              <div>{album.label || "Unknown"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks section - we'll need to extend the SpotifyAlbum type to include tracks */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tracks</h2>
        <div className="space-y-2">
          {album.tracks?.items?.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-4 p-2 hover:bg-accent rounded-md transition-colors"
            >
              <div className="w-8 text-center text-muted-foreground">
                {index + 1}
              </div>
              <div className="flex-grow">
                <div className="font-medium">{track.name}</div>
                <div className="text-sm text-muted-foreground">
                  {track.artists?.map(artist => artist.name).join(", ")}
                </div>
              </div>
              <div className="text-muted-foreground">
                {formatDuration(track.duration_ms)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
} 