"use client"
import { SpotifyAlbum } from "@/types/spotify";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { RatingInput } from "./rating-input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";

interface AlbumDetailsProps {
  album: SpotifyAlbum;
}

export function AlbumDetails({ album }: AlbumDetailsProps) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const upsertReview = useMutation(api.reviews.upsertReview);
  const existingReview = useQuery(api.reviews.getUserReview, {
    albumName: album.name,
    artistName: album.artists?.[0]?.name || "",
  });

  // Load existing review
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReview(existingReview.review || "");
    }
  }, [existingReview]);

  // Handle rating change
  const handleRatingChange = (newRating: number) => {
    const previousRating = rating;
    setRating(newRating);
    
    upsertReview({
      albumName: album.name,
      artistName: album.artists?.[0]?.name || "",
      rating: newRating,
      review: review,
    }).catch(error => {
      console.error("Failed to save review:", error);
      setRating(previousRating); // Revert to previous rating
      toast.error("Failed to save rating. Please try again.");
    });
  };

  // Handle review text change
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  // Handle review submission
  const handleSubmitReview = async () => {
    setIsSubmittingReview(true);
    try {
      await upsertReview({
        albumName: album.name,
        artistName: album.artists?.[0]?.name || "",
        rating,
        review,
      });
      toast.success("Review saved successfully!");
    } catch (error) {
      console.error("Failed to save review:", error);
      toast.error("Failed to save review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

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
        
        <div className="space-y-4 flex-grow">
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

        {/* Review Section */}
        <div className="w-80 space-y-4 border-l pl-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Rate this Album</h2>
            <RatingInput 
              value={rating}
              onChange={handleRatingChange}
              className="mb-4"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="review" className="text-sm font-medium">
              Your Review (Optional)
            </label>
            <Textarea
              id="review"
              placeholder="Write your thoughts about this album..."
              value={review}
              onChange={handleReviewChange}
              className="min-h-[100px]"
            />
            <Button
              onClick={handleSubmitReview}
              className="w-full mt-2"
              disabled={isSubmittingReview || !review.trim()}
            >
              {isSubmittingReview ? "Saving..." : "Save Review"}
            </Button>
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