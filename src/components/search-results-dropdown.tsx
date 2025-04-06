import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { SpotifySearchResults } from "@/types/spotify";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface SearchResultsDropdownProps {
  query: string;
  className?: string;
  show?: boolean;
  onMouseDown?: () => void;
}

export function SearchResultsDropdown({
  query,
  className,
  show = false,
  onMouseDown,
}: SearchResultsDropdownProps) {
  const [results, setResults] = useState<SpotifySearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { searchAlbums } = useApi();
  const debouncedQuery = useDebounce(query, 300);
  const [lastSearchQuery, setLastSearchQuery] = useState("");

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery) {
        setResults(null);
        setLastSearchQuery("");
        return;
      }
  
      // Check if the new query is just the previous query with added whitespace
      if (lastSearchQuery && debouncedQuery.trim() === lastSearchQuery.trim()) {
        return;
      }
  
      setIsLoading(true);
      try {
        const data = await searchAlbums(debouncedQuery);
        setResults(data);
        setLastSearchQuery(debouncedQuery);
      } catch (error) {
        console.error("Search failed:", error);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedQuery, lastSearchQuery, searchAlbums]);

  if (!debouncedQuery || !show) return null;

  return (
    <Card
      className={cn("absolute top-full left-0 z-50 mt-2 w-full", className)}
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent blur event on the input
        onMouseDown?.();
      }}
      data-search-dropdown
    >
      <div
        className={cn(
          "h-full overflow-y-auto px-4",
          "[&::-webkit-scrollbar]:w-2",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-accent",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent",
        )}
      >
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : results && results.albums && results.albums.items ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground ml-2.5">Albums</h3>
            <div className="flex flex-col gap-1.5">
              {results.albums.items.map((album) => {
                // Basic slugification - replace spaces and special chars
                const artistNameSlug = encodeURIComponent(
                  album.artists?.[0]?.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'unknown-artist'
                );
                const albumNameSlug = encodeURIComponent(
                  album.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'unknown-album'
                );
                const href = `/albums/${artistNameSlug}/${albumNameSlug}?id=${album.id}`;

                return (
                  <Link
                    key={album.id}
                    href={href}
                    className="hover:bg-accent flex items-center gap-4 rounded-md p-2 transition-colors"
                  >
                    <Image
                      src={album.images?.[0]?.url || "/placeholder.png"}
                      width={48}
                      height={48}
                      alt={album.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium">{album.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {album.artists?.[0]?.name}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground py-4 text-center">
            No albums found
          </div>
        )}
      </div>
    </Card>
  );
}
