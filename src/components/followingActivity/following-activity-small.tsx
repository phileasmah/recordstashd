"use client";
import { useUser } from "@clerk/nextjs";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ReviewList } from "../reviews/review-list";
import { AlbumReviewCardContent } from "../ui/review-cards/album-review-card-content";
import { ScrollArea } from "../ui/scroll-area";
import { ViewAllButton } from "../ui/view-all-button";

export default function FollowingActivitySmall() {
  // TODO: This is a hack because we determine to load this component in a server component
  // and when this is rendered, the user might not be loaded.
  const { isLoaded } = useUser();

  const { results: reviews, status } = usePaginatedQuery(
    api.reviewsRead.getLatestPostsFromFollowing,
    isLoaded ? {} : "skip",
    { initialNumItems: 5 },
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-bold">
          Activity from people you follow
        </h2>
        <ViewAllButton href="/following" />
      </div>
      <ScrollArea className="max-h-[600px]">
        <ReviewList
          ReviewComponent={AlbumReviewCardContent}
          reviews={reviews}
          isLoadingFirstPage={status === "LoadingFirstPage"}
          emptyMessage="Follow some users to see their reviews here"
          showLoadMore={false}
        />
      </ScrollArea>
    </div>
  );
}
