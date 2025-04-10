import { SpotifyAlbum, SpotifyTrack } from "@/types/spotify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

interface AlbumTracksProps {
  album: SpotifyAlbum;
}

export function AlbumTracks({ album }: AlbumTracksProps) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Tracks</CardTitle>
        <CardDescription>{album.total_tracks} songs, {formatTotalDuration(album.tracks?.items)}</CardDescription>
      </CardHeader>
      <ScrollArea className="h-[400px]">
        <CardContent>
          <div className="space-y-1.5">
            {album.tracks?.items?.map((track, index) => (
              <div
                key={track.id}
                className="hover:bg-accent flex items-center gap-4 rounded-md py-2.5 transition-colors px-4"
              >
                <div className="text-muted-foreground text-center">
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
    </Card>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatTotalDuration(tracks?: SpotifyTrack[]): string {
  if (!tracks) return '';
  const totalMs = tracks.reduce((acc: number, track: SpotifyTrack) => acc + track.duration_ms, 0);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
} 