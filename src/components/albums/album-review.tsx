"use client";

import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { RatingInput } from "../review-card/rating-input";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { SignedOutReview } from "./signed-out-review";

interface AlbumReviewProps {
  albumName: string;
  artistName: string;
}

// Define all possible states the card can be in
type CardState =
  | {
      state: "default";
    }
  | {
      state: "writing_review";
    };

// Define variants for main card sliding animation
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    scale: 1,
    opacity: 1,
  },
  exit: () => ({
    zIndex: 0,
    scale: 0.95,
    opacity: 0,
  }),
};

export function AlbumReview({ albumName, artistName }: AlbumReviewProps) {
  const { isSignedIn } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [cardState, setCardState] = useState<CardState>({ state: "default" });
  const [direction, setDirection] = useState(0);

  const upsertReview = useMutation(api.reviewsWrite.upsertReview);
  const existingReview = useQuery(
    api.reviewsRead.getUserReview,
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
      setCardState({ state: "default" });
    } catch (error) {
      console.error("Failed to save review:", error);
      toast.error("Failed to save review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderCard = () => {
    switch (cardState.state) {
      case "writing_review":
        return (
          <motion.div className="bg-card flex flex-1 flex-col overflow-hidden rounded-lg">
            <motion.div
              className="flex h-full flex-col"
              initial="hidden"
              animate="visible"
            >
              <CardHeader className="items mb-4 flex gap-3">
                <motion.div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDirection(-1);
                      setCardState({ state: "default" });
                    }}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </motion.div>
                <div className="flex flex-col gap-1">
                  <motion.div>
                    <CardTitle>Write Your Review</CardTitle>
                  </motion.div>
                  <motion.div>
                    <CardDescription>
                      What others are saying about this album
                    </CardDescription>
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <motion.div className="flex-1">
                  <Textarea
                    id="review"
                    placeholder="Write your thoughts about this album..."
                    value={review}
                    onChange={handleReviewChange}
                    className="h-full resize-none"
                  />
                </motion.div>
                <motion.div>
                  <Button
                    onClick={handleSubmitReview}
                    className="w-full"
                    disabled={isSubmittingReview || !review.trim()}
                  >
                    {isSubmittingReview ? "Saving..." : "Save Review"}
                  </Button>
                </motion.div>
              </CardContent>
            </motion.div>
          </motion.div>
        );

      case "default":
      default:
        return (
          <motion.div
            className="flex flex-1 flex-col"
            initial="hidden"
            animate="visible"
          >
            <CardHeader>
              <motion.div>
                <CardTitle>Rate & Review</CardTitle>
                <CardDescription>
                  Share your thoughts about this album
                </CardDescription>
              </motion.div>
            </CardHeader>
            <motion.div>
              <CardContent className="mt-4 flex flex-1 flex-col gap-4">
                <RatingInput
                  value={rating}
                  onChange={handleRatingChange}
                  className=""
                />
                <motion.div className="flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      setDirection(1);
                      setCardState({ state: "writing_review" });
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <span>Write Your Review</span>
                  </Button>
                </motion.div>
              </CardContent>
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <Card className="relative flex h-full flex-col">
      <SignedOut>
        <SignedOutReview />
      </SignedOut>
      <SignedIn>
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={cardState.state}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-1 flex-col"
          >
            {renderCard()}
          </motion.div>
        </AnimatePresence>
      </SignedIn>
    </Card>
  );
}
