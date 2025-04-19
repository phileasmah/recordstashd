"use client";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Heart } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "../button";

interface LikeButtonProps {
  reviewId: Id<"reviews">;
  initialLikedState: boolean;
  initialLikeCount: number;
  className?: string;
}

export function LikeButton({
  reviewId,
  initialLikedState,
  initialLikeCount,
  className,
}: LikeButtonProps) {
  const { isSignedIn } = useAuth();
  const [isLiked, setIsLiked] = useState(initialLikedState);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const likeReview = useMutation(api.reviewLikes.likeReview);
  const unlikeReview = useMutation(api.reviewLikes.unlikeReview);

  const handleClick = async () => {
    if (isLiked) {
      await unlikeReview({ reviewId });
      setLikeCount((prev) => prev - 1);
    } else {
      await likeReview({ reviewId });
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex h-7 items-center gap-1 pt-0.5 disabled:opacity-100",
        className,
      )}
      onClick={handleClick}
      disabled={!isSignedIn}
    >
      <Heart
        className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`}
      />
      <span className="text-sm">{likeCount}</span>
    </Button>
  );
}
