"use client";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AlbumReviewCardContent } from "../ui/review-cards/album-review-card-content";
import { ScrollArea } from "../ui/scroll-area";

export default function FollowingActivitySmall() {
  const { results: reviews, isLoading } = usePaginatedQuery(
    api.reviewsRead.getLatestPostsFromFollowing,
    {},
    { initialNumItems: 5 },
  );

  return (
    <ScrollArea className="max-h-[600px]">
      <div className="space-y-1">
        {isLoading ? (
          <div>Loading...</div>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground p-10 text-center">
            No reviews yet
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
    </ScrollArea>
  );
}
