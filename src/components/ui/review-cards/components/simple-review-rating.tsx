import { PaginatedQueryItem } from "convex/react";
import { FunctionReturnType } from "convex/server";
import Link from "next/link";
import { api } from "../../../../../convex/_generated/api";
import { RatingBadge } from "../../rating-badge";

interface SimpleReviewRatingProps {
  review:
    | (FunctionReturnType<typeof api.reviewsRead.getAllUserReviews>[number] & {
        username: string;
        userDisplayName: string | null;
      })
    | PaginatedQueryItem<typeof api.reviewsRead.getLatestPostsFromFollowing>
    | PaginatedQueryItem<typeof api.reviewsRead.getMostLikedReviewThisWeek>;
  albumUrl: string;
}

export function SimpleReviewRating({
  review,
  albumUrl,
}: SimpleReviewRatingProps) {
  if (review.rating === undefined) return null;
  const date = new Date(review.lastUpdatedTime).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="text-muted-foreground flex items-center gap-1.5 text-sm py-4 px-6">
      <span className="font-medium">
        {review.username ? (
          <Link
            href={`/${review.username}`}
            className="text-primary text-sm font-medium hover:underline"
          >
            {review.userDisplayName}
          </Link>
        ) : (
          <span className="text-sm font-medium">{review.userDisplayName}</span>
        )}
      </span>{" "}
      gave <RatingBadge rating={review.rating} className="-mb-0.5" /> to{" "}
      <Link
        href={albumUrl}
        className="text-primary font-medium hover:underline"
      >
        {review.albumName}
      </Link>
      by {review.artistName}
      <div className="hidden items-center gap-1 sm:flex">
        <span className="text-muted-foreground text-sm">•</span>
        <p className="text-muted-foreground text-sm">{date}</p>
      </div>
    </div>
  );
}
