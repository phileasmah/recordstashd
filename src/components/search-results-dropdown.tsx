"use client"

import { useDebounce } from "@/hooks/useDebounce"
import { useSpotify } from "@/hooks/useSpotify"
import { cn } from "@/lib/utils"
import { SpotifySearchResults } from "@/types/spotify"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

interface SearchResultsDropdownProps {
  query: string
  className?: string
  show?: boolean
}

export function SearchResultsDropdown({ query, className, show = false }: SearchResultsDropdownProps) {
  const [results, setResults] = useState<SpotifySearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { searchArtistAndAlbums } = useSpotify()
  const debouncedQuery = useDebounce(query, 300)
  const [lastSearchQuery, setLastSearchQuery] = useState("")

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery) {
        setResults(null)
        setLastSearchQuery("")
        return
      }

      // Check if the new query is just the previous query with added whitespace
      if (lastSearchQuery && debouncedQuery.trim() === lastSearchQuery.trim()) {
        return
      }

      setIsLoading(true)
      try {
        const data = await searchArtistAndAlbums(debouncedQuery)
        setResults(data)
        setLastSearchQuery(debouncedQuery)
      } catch (error) {
        console.error('Search failed:', error)
        setResults(null)
      } finally {
        setIsLoading(false)
      }
    }

    search()
  }, [debouncedQuery, searchArtistAndAlbums, lastSearchQuery])

  if (!debouncedQuery || !show) return null

  return (
    <Card className={cn(
      "absolute top-full left-0 w-full mt-2 max-h-96 z-50",
      className
    )}>
      <div className={cn(
        "overflow-y-auto h-full max-h-96 px-4 py-4",
        "[&::-webkit-scrollbar]:w-2",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-accent",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent"
      )}>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : results ? (
          <div className="space-y-6">
            {results.artists?.items?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Artists</h3>
                <div className="space-y-2">
                  {results.artists.items.map((artist) => (
                    <Link
                      key={artist.id}
                      href={`/artists/${artist.id}`}
                      className="flex items-center gap-4 p-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <Image
                        src={artist.images?.[0]?.url || '/placeholder.png'}
                        width={48}
                        height={48}
                        alt={artist.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{artist.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {artist.genres?.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results.albums?.items?.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Albums</h3>
                <div className="space-y-2">
                  {results.albums.items.map((album) => (
                    <Link
                      key={album.id}
                      href={`/albums/${album.id}`}
                      className="flex items-center gap-4 p-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <Image
                        src={album.images?.[0]?.url || '/placeholder.png'}
                        width={48}
                        height={48}
                        alt={album.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium">{album.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {album.artists?.[0]?.name}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            No results found
          </div>
        )}
      </div>
    </Card>
  )
}