"use client"

import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { RatingInput } from "./rating-input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface AlbumReviewProps {
  albumName: string;
  artistName: string;
}

export function AlbumReview({ albumName, artistName }: AlbumReviewProps) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const upsertReview = useMutation(api.reviews.upsertReview);
  const existingReview = useQuery(api.reviews.getUserReview, {
    albumName,
    artistName,
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
      albumName,
      artistName,
      rating: newRating,
      review,
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
        albumName,
        artistName,
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
    <div className="w-80 space-y-4 md:border-l md:pl-8 pl-0">
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
  );
} 