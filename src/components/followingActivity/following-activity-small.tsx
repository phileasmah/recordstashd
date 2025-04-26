"use client";
import { useUser } from "@clerk/nextjs";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AlbumReviewCardContent } from "../ui/review-cards/album-review-card-content";
import { ScrollArea } from "../ui/scroll-area";
import { AlbumReviewCardSkeleton } from "../ui/skeletons/album-review-card-skeleton";

export default function FollowingActivitySmall() {
  // TODO: This is a hack because we determine to load this component in a server component 
  // and when this is rendered, the user might not be loaded.
  const { isLoaded } = useUser();

  const { results: reviews, isLoading } = usePaginatedQuery(
    api.reviewsRead.getLatestPostsFromFollowing,
    isLoaded ? {} : "skip",
    { initialNumItems: 5 },
  );

  return (
    <ScrollArea className="max-h-[600px]">
      <div className="space-y-1">
        {!isLoaded || isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <AlbumReviewCardSkeleton
                key={i}
                showDivider={i !== 2}
                index={i}
              />
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
    </ScrollArea>
  );
}
