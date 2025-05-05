"use client";
import { cn } from "@/lib/utils";
import { useConvexAuth, useMutation } from "convex/react";
import { Heart } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "../button";

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
        "pt-[3px] pb-[2px] h-max flex items-center gap-1 disabled:opacity-100",
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
