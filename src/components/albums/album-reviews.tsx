"use client";
import { usePaginatedQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ReviewList } from "../reviews/review-list";
import { ReviewCardContent } from "../ui/review-cards/review-card-content";
import { TransitionPanel } from "../ui/transition-panel";

interface AlbumReviews {
  albumIdInDb: Id<"albums"> | null;
}

export function AlbumReviews({ albumIdInDb }: AlbumReviews) {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    results: recentReviews,
    loadMore: loadMoreRecentReviews,
    status: recentReviewsStatus,
  } = usePaginatedQuery(
    api.reviewsRead.getRecentReviewsForAlbum,
    {
      albumId: albumIdInDb,
    },
    { initialNumItems: 5 },
  );
  const {
    results: mostLikedReviews,
    loadMore: loadMoreMostLikedReviews,
    status: mostLikedReviewsStatus,
  } = usePaginatedQuery(
    api.reviewsRead.getMostLikedReviewsForAlbum,
    {
      albumId: albumIdInDb,
    },
    { initialNumItems: 5 },
  );

  const TABS = [
    {
      title: "Most Liked",
      content: () => (
        <ReviewList
          ReviewComponent={ReviewCardContent}
          reviews={mostLikedReviews}
          isLoadingFirstPage={mostLikedReviewsStatus === "LoadingFirstPage"}
          canLoadMore={mostLikedReviewsStatus === "CanLoadMore"}
          onLoadMore={() => loadMoreMostLikedReviews(5)}
          isLoadingMore={mostLikedReviewsStatus === "LoadingMore"}
        />
      ),
    },
    {
      title: "Recently Reviewed",
      content: () => (
        <ReviewList
          ReviewComponent={ReviewCardContent}
          reviews={recentReviews}
          isLoadingFirstPage={recentReviewsStatus === "LoadingFirstPage"}
          canLoadMore={recentReviewsStatus === "CanLoadMore"}
          onLoadMore={() => loadMoreRecentReviews(5)}
          isLoadingMore={recentReviewsStatus === "LoadingMore"}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="flex space-x-2">
          {TABS.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`py-1.5 text-sm font-medium transition-all duration-200 ease-in-out ${
                activeIndex === index
                  ? "bg-accent text-accent-foreground rounded-full px-4"
                  : "text-muted-foreground hover:bg-muted rounded-md px-2"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
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
