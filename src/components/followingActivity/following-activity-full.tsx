"use client";
import { useUser } from "@clerk/nextjs";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ReviewList } from "../reviews/review-list";
import { AlbumReviewCardContent } from "../ui/review-cards/album-review-card-content";

export default function FollowingActivityFull() {
  // TODO stop unauthorised user
  const { isLoaded } = useUser();

  const {
    results: reviews,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.reviewsRead.getLatestPostsFromFollowing,
    isLoaded ? {} : "skip",
    { initialNumItems: 10 },
  );

  return (
    <ReviewList
      ReviewComponent={AlbumReviewCardContent}
      reviews={reviews}
      isLoadingFirstPage={status === "LoadingFirstPage"}
      canLoadMore={status === "CanLoadMore"}
      onLoadMore={() => loadMore(10)}
      isLoadingMore={status === "LoadingMore"}
      emptyMessage="Follow some users to see their reviews here"
    />
  );
}
