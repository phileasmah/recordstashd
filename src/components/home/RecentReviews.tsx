"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AlbumReviewCardContent } from "../ui/review-cards/album-review-card-content";
import { AlbumReviewCardSkeleton } from "../ui/skeletons/album-review-card-skeleton";

export function RecentReviews() {
  const { results: reviews, isLoading } = usePaginatedQuery(
    api.reviewsRead.getRecentReviews,
    {},
    { initialNumItems: 5 },
  );

  return (
    <div className="space-y-1">
      {isLoading ? (
        <>
          {[...Array(3)].map((_, i) => (
            <AlbumReviewCardSkeleton key={i} showDivider={i !== 2} index={i} />
          ))}
        </>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground p-10 text-center">
          Follow some users to see their reviews here
        </p>
      ) : (
        reviews.map((review, index) => (
          <AlbumReviewCardContent
            key={review._id}
            review={review}
            index={index}
            showDivider={index !== reviews.length - 1}
          />
        ))
      )}
    </div>
  );
}
