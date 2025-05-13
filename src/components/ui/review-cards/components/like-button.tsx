"use client";
import { cn } from "@/lib/utils";
import { useConvexAuth, useMutation } from "convex/react";
import { Heart } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "../../button";

interface LikeButtonProps {
  reviewId: Id<"reviews">;
  likedByUser: boolean;
  likeCount: number;
  className?: string;
}

export function LikeButton({
  reviewId,
  likedByUser,
  likeCount,
  className,
}: LikeButtonProps) {
  const { isAuthenticated } = useConvexAuth();

  const likeReview = useMutation(api.reviewLikes.likeReview);
  const unlikeReview = useMutation(api.reviewLikes.unlikeReview);

  const handleClick = async () => {
    if (likedByUser) {
      await unlikeReview({ reviewId });
    } else {
      await likeReview({ reviewId });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "sm:hover:bg-accent mt-0 !-ml-1.5 flex h-max items-center gap-1 pt-[3px] pb-[2px] hover:bg-transparent disabled:opacity-100 sm:mt-1 sm:mb-1 sm:!ml-0",
        className,
      )}
      onClick={handleClick}
      disabled={!isAuthenticated}
    >
      <Heart
        className={`h-3 w-3 ${likedByUser ? "fill-red-500 text-red-500" : "text-gray-500"}`}
      />
      <span className="text-accent-foreground text-sm">{likeCount}</span>
    </Button>
  );
}
