"use client";

import { cn } from "@/lib/utils";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { RatingInput } from "../review-card/rating-input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
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
  albumIdInDb: Id<"albums"> | null;
  albumName: string;
  artistName: string;
  setAlbumIdInDb: Dispatch<SetStateAction<Id<"albums"> | null>>;
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

export function AlbumReview({
  albumIdInDb,
  albumName,
  artistName,
  setAlbumIdInDb,
}: AlbumReviewProps) {
  const { isAuthenticated } = useConvexAuth();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [cardState, setCardState] = useState<CardState>({ state: "default" });
  const [direction, setDirection] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const createReviewAndReturnAlbumId = useMutation(
    api.reviewsWrite.createReviewAndReturnAlbumId,
  );
  const updateReview = useMutation(api.reviewsWrite.updateReview);
  const deleteReview = useMutation(api.reviewsWrite.deleteReview);
  const existingReview = useQuery(
    api.reviewsRead.getUserReview,
    isAuthenticated ? { albumId: albumIdInDb } : "skip",
  );

  // Load existing review
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0);
      setReview(existingReview.review || "");
    }
  }, [existingReview]);

  // Handle rating change
  const handleRatingChange = async (newRating: number) => {
    const previousRating = rating;
    setRating(newRating);

    try {
      if (existingReview) {
        if (!newRating && !review) {
          await deleteReview({
            reviewId: existingReview._id,
          });
        } else {
          await updateReview({
            reviewId: existingReview._id,
            rating: newRating,
          });
        }
      } else {
        const albumId = await createReviewAndReturnAlbumId({
          albumId: albumIdInDb,
          albumName,
          artistName,
          rating: newRating,
        });
        setAlbumIdInDb(albumId);
      }
    } catch (error) {
      console.error("Failed to save review:", error);
      setRating(previousRating); // Revert to previous rating
      toast.error("Failed to save rating. Please try again.");
    }
  };

  // Handle review text change
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  // Handle review submission
  const handleSubmitReview = async () => {
    setIsSubmittingReview(true);
    try {
      if (existingReview) {
        if (rating === 0 && review === "") {
          await deleteReview({
            reviewId: existingReview._id,
          });
        } else {
          await updateReview({
            reviewId: existingReview._id,
            review,
          });
        }
      } else {
        const albumId = await createReviewAndReturnAlbumId({
          albumId: albumIdInDb,
          albumName,
          artistName,
          review,
        });
        setAlbumIdInDb(albumId);
      }
      toast.success("Review saved successfully!");
      setCardState({ state: "default" });
    } catch (error) {
      console.error("Failed to save review:", error);
      toast.error("Failed to save review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle review deletion
  const handleDeleteReview = async () => {
    if (!existingReview) {
      console.error("No review to delete");
      return;
    }

    try {
      if (!rating) {
        await deleteReview({
          reviewId: existingReview._id,
        });
      } else {
        await updateReview({
          reviewId: existingReview._id,
          review: "",
        });
      }
      toast.success("Review deleted successfully!");
      setCardState({ state: "default" });
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review. Please try again.");
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
                <div className="flex flex-1 flex-col gap-1">
                  <motion.div>
                    <CardTitle>
                      {existingReview?.hasReview
                        ? "Edit Your Review"
                        : "Write Your Review"}
                    </CardTitle>
                  </motion.div>
                  <motion.div>
                    <CardDescription>Share your thoughts</CardDescription>
                  </motion.div>
                </div>
                {existingReview?.hasReview && (
                  <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "group relative my-auto h-8 overflow-hidden rounded-full px-5",
                          "hover:bg-destructive/90 hover:text-destructive-foreground",
                          isDeleteDialogOpen &&
                            "bg-destructive/90 text-destructive-foreground",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4 shrink-0" />
                          <span
                            className={cn(
                              "-mt-0.5 overflow-hidden text-sm whitespace-nowrap transition-all duration-250",
                              "w-0 group-hover:w-[85px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                              isDeleteDialogOpen && "w-[85px]",
                            )}
                          >
                            Delete review
                          </span>
                        </span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this review? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteReview}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
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
                    className="w-full rounded-md py-5 hover:rounded-3xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
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
                <motion.div className="flex flex-col gap-0.5 mt-2">
                  <Button
                    onClick={() => {
                      setDirection(1);
                      setCardState({ state: "writing_review" });
                    }}
                    variant="outline"
                    className="w-full rounded-t-3xl rounded-b-sm py-6 hover:rounded-sm"
                  >
                    <span>{review ? "Edit Review" : "Write Your Review"}</span>
                  </Button>
                  <Button
                    disabled
                    variant="outline"
                    className="w-full rounded-sm py-6 hover:rounded-full"
                  >
                    <span>Coming soon...</span>
                  </Button>
                  <Button
                    disabled
                    variant="outline"
                    className="w-full rounded-t-sm rounded-b-3xl py-6 hover:rounded-full"
                  >
                    <span>Coming soon...</span>
                  </Button>
                </motion.div>
              </CardContent>
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <Card className="relative flex h-full flex-col rounded-3xl">
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
