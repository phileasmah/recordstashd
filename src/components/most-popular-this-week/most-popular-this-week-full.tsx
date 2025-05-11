"use client";

import { ReviewList } from "@/components/reviews/review-list";
import { AlbumReviewCardContent } from "@/components/ui/review-cards/album-review-card-content";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function MostPopularThisWeekFull({ oneWeekAgo }: { oneWeekAgo: Date }) {
  const {
    results: reviews,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.reviewsRead.getMostLikedReviewThisWeek,
    { oneWeekAgo: oneWeekAgo.getTime() },
    { initialNumItems: 10 },
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Popular Reviews This Week</h1>
        <p className="text-muted-foreground mt-2">
          The most liked reviews from the past week
        </p>
      </div>
      <ReviewList
        ReviewComponent={AlbumReviewCardContent}
        reviews={reviews}
        isLoadingFirstPage={status === "LoadingFirstPage"}
        canLoadMore={status === "CanLoadMore"}
        onLoadMore={() => loadMore(10)}
        isLoadingMore={status === "LoadingMore"}
        emptyMessage="No reviews yet"
      />
    </div>
  );
}
