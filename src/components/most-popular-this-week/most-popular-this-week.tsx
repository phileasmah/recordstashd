"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ReviewList } from "../reviews/review-list";
import { AlbumReviewCardContent } from "../ui/review-cards/album-review-card-content";
import { ViewAllButton } from "../ui/view-all-button";

export function MostPopularThisWeek({ oneWeekAgo }: { oneWeekAgo: Date }) {
  const { results: reviews, status } = usePaginatedQuery(
    api.reviewsRead.getMostLikedReviewThisWeek,
    { oneWeekAgo: oneWeekAgo.getTime() },
    { initialNumItems: 5 },
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-bold">Popular Reviews This Week</h2>
        <ViewAllButton href="/reviews/popular" />
      </div>
      <ReviewList
        ReviewComponent={AlbumReviewCardContent}
        reviews={reviews}
        isLoadingFirstPage={status === "LoadingFirstPage"}
        emptyMessage="No reviews yet"
        showLoadMore={false}
      />
    </div>    
  );
}
