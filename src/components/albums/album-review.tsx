"use client";

import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { MagicCard } from "../magicui/magic-card";
import { RatingInput } from "../rating-input";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "../ui/textarea";

interface AlbumReviewProps {
  albumName: string;
  artistName: string;
}

export function AlbumReview({ albumName, artistName }: AlbumReviewProps) {
  const { isSignedIn } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const upsertReview = useMutation(api.reviews.upsertReview);
  const existingReview = useQuery(
    api.reviews.getUserReview,
    isSignedIn ? { albumName, artistName } : "skip",
  );

  // Load existing review
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0);
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
    }).catch((error) => {
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
    <MagicCard>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your thoughts about this album</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <SignedIn>
          <RatingInput
            value={rating}
            onChange={handleRatingChange}
            className="mb-4"
          />
          <div className="space-y-2">
            <label htmlFor="review" className="text-sm font-medium">
              Your Review (Optional)
            </label>
            <Textarea
              id="review"
              placeholder="Write your thoughts about this album..."
              value={review}
              onChange={handleReviewChange}
            />
            <Button
              onClick={handleSubmitReview}
              className="mt-2 w-full"
              disabled={isSubmittingReview || !review.trim()}
            >
              {isSubmittingReview ? "Saving..." : "Save Review"}
            </Button>
          </div>
        </SignedIn>
        <SignedOut>
          <div className="-mt-6 flex h-full flex-col items-center justify-center gap-3 space-y-4 text-center">
            <p className="text-muted-foreground my-0">
              Sign in to rate and review this album
            </p>
            <SignInButton>
              <Button variant="default">Sign In</Button>
            </SignInButton>
          </div>
        </SignedOut>
        </CardContent>
      </Card>
    </MagicCard>
  );
}
