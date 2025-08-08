import { cn } from "@/lib/utils";
import { SpotifyAlbum, SpotifyTrack } from "@/types/spotify";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { motion } from "motion/react";
import { UIEvent, useCallback, useEffect, useRef, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import SpotifyAttribution from "../ui/spotify-attribution";

interface AlbumTracksProps {
  album: SpotifyAlbum;
}

// Define transition configuration according to Material You guidelines
// Using the 'Emphasized' easing curve: cubic-bezier(0.2, 0, 0, 1)
const transition = { duration: 0.2, ease: [0.2, 0, 0, 1] };

export function AlbumTracks({ album }: AlbumTracksProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [doesContentOverflow, setDoesContentOverflow] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const checkOverflow = useCallback(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.getBoundingClientRect().height;
      const wouldOverflow = contentHeight > 483;
      setDoesContentOverflow(wouldOverflow);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    
    // Initial check
    checkOverflow();

    return () => resizeObserver.disconnect();
  }, [checkOverflow]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 10);
  };

  return (
    <Card className="flex h-max max-h-[520px] flex-col gap-0 py-5 pb-0 rounded-3xl border-accent">
      <CardHeader
        className={cn(
          "bg-card sticky top-0 z-10 py-2 [.border-b]:-mt-3 [.border-b]:pb-3",
          isScrolled && "border-b",
        )}
      >
        <motion.div
          className="flex items-center"
          initial={false}
          animate={{
            flexDirection: isScrolled ? "row" : "column",
            alignItems: isScrolled ? "center" : "flex-start",
            gap: isScrolled ? 4 : 0,
          }}
          transition={transition}
        >
          <motion.div
            initial={false}
            animate={{
              fontSize: isScrolled ? "1rem" : "1.5rem",
            }}
            transition={transition}
          >
            <CardTitle className={cn(isScrolled ? "leading-tight" : "")}>
              Tracks
            </CardTitle>
          </motion.div>
          <motion.div
            initial={false}
            animate={{ marginTop: isScrolled ? 0 : 6 }}
            transition={transition}
            className={cn("text-sm")}
          >
            <CardDescription className={cn(isScrolled ? "mt-0.5" : "")}>
              {isScrolled && <span className="mx-1">-</span>}
              {album.total_tracks} songs,{" "}
              {formatTotalDuration(album.tracks?.items)}
            </CardDescription>
          </motion.div>
        </motion.div>
      </CardHeader>
      <ScrollAreaPrimitive.Root
        className={cn(
          "flex-grow overflow-hidden",
          doesContentOverflow && "h-[520px]",
        )}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          className="h-full w-full rounded-[inherit]"
          style={{ overflowY: "scroll" }}
          onScroll={handleScroll}
        >
          <CardContent ref={contentRef} className={cn("mb-5 px-5", isScrolled && "mt-[6.5rem]")}>
            <div className="space-y-1.5">
              {album.tracks?.items?.map((track, index) => (
                <div
                  key={track.id}
                  className="group relative hover:bg-accent flex items-center gap-4 rounded-md px-4 py-2.5 transition-colors overflow-hidden"
                >
                  <div className="text-muted-foreground w-4 text-center">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="font-medium">{track.name}</div>
                    <div className="text-muted-foreground truncate text-sm">
                      {track.artists?.map((artist) => artist.name).join(", ")}
                    </div>
                  </div>
                  <span className="text-muted-foreground ml-auto shrink-0 transition-opacity duration-200 group-hover:opacity-0">
                    {formatDuration(track.duration_ms)}
                  </span>
                  {track.external_urls?.spotify && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-2 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                      <SpotifyAttribution
                        href={track.external_urls.spotify}
                        size="sm"
                        variant="badge"
                        asButton
                        label="Open on Spotify"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </ScrollAreaPrimitive.Viewport>
        <ScrollAreaPrimitive.Scrollbar
          className="flex touch-none border-l border-l-transparent p-[1px] transition-colors duration-150 ease-out select-none data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:w-2.5"
          orientation="vertical"
        >
          <ScrollAreaPrimitive.Thumb className="bg-border relative flex-1 rounded-full" />
        </ScrollAreaPrimitive.Scrollbar>
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    </Card>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatTotalDuration(tracks?: SpotifyTrack[]): string {
  if (!tracks || tracks.length === 0) return "0 min";
  const totalMs = tracks.reduce(
    (acc: number, track: SpotifyTrack) => acc + (track.duration_ms || 0),
    0,
  );
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);

  if (totalMs === 0) return "0 min";

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  if (minutes === 0 && totalMs > 0) {
    return "< 1 min";
  }
  return `${minutes} min`;
}
