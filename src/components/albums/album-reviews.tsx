"use client";
import { usePaginatedQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ReviewCardContent } from "../ui/review-cards/review-card-content";
import { Skeleton } from "../ui/skeleton";
import RecentReviewCardSkeleton from "../ui/skeletons/recent-review-card-skeleton";
import { TransitionPanel } from "../ui/transition-panel";

interface AlbumReviews {
  albumIdInDb: Id<"albums"> | null;
}

export function AlbumReviews({ albumIdInDb }: AlbumReviews) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { results: recentReviews, isLoading: isLoadingRecents } =
    usePaginatedQuery(
      api.reviewsRead.getRecentReviewsForAlbum,
      {
        albumId: albumIdInDb,
      },
      { initialNumItems: 5 },
    );
  const { results: mostLikedReviews, isLoading: isLoadingMostLiked } =
    usePaginatedQuery(
      api.reviewsRead.getMostLikedReviewsForAlbum,
      {
        albumId: albumIdInDb,
      },
      { initialNumItems: 5 },
    );

  const TABS = [
    {
      title: "Recently Reviewed",
      content: () => {
        if (isLoadingRecents) {
          return <RecentReviewCardSkeleton />;
        }

        if (recentReviews.length === 0) {
          return (
            <div className="flex min-h-[200px] items-center justify-center py-0">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to write a review for this album!
              </p>
            </div>
          );
        }

        return (
          <div>
            {recentReviews.map((review, index) => (
              <ReviewCardContent
                key={review._id}
                review={review}
                index={index}
                showDivider={index !== recentReviews.length - 1}
              />
            ))}
          </div>
        );
      },
    },
    {
      title: "Most Liked",
      content: () => {
        if (isLoadingMostLiked) {
          return <RecentReviewCardSkeleton />;
        }

        if (mostLikedReviews.length === 0) {
          return (
            <div className="flex min-h-[200px] items-center justify-center py-0">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to write a review for this album!
              </p>
            </div>
          );
        }

        return (
          <div>
            {mostLikedReviews.map((review, index) => (
              <ReviewCardContent
                key={review._id}
                review={review}
                index={index}
                showDivider={index !== mostLikedReviews.length - 1}
              />
            ))}
          </div>
        );
      },
    },
  ];

  // Determine if the current tab is still loading
  const isLoadingTab = (activeIndex === 0 && isLoadingRecents) || (activeIndex === 1 && isLoadingMostLiked);

  return (
    <div>
      {isLoadingTab ? (
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded-md" />
          <div className="flex space-x-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-md" />
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <div className="flex space-x-2">
            {TABS.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeIndex === index
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="border-card-border overflow-hidden border-t px-5">
        <TransitionPanel
          activeIndex={activeIndex}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          variants={{
            enter: { opacity: 0, y: -20, filter: "blur(4px)" },
            center: { opacity: 1, y: 0, filter: "blur(0px)" },
            exit: { opacity: 0, y: 20, filter: "blur(4px)" },
          }}
        >
          {TABS.map((tab, index) => (
            <div key={index} className="py-4">
              {tab.content()}
            </div>
          ))}
        </TransitionPanel>
      </div>
    </div>
  );
}
