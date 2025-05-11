import { cn } from "@/lib/utils";
import { PaginatedQueryItem } from "convex/react";
import { ComponentType } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import RecentReviewCardSkeleton from "../ui/skeletons/recent-review-card-skeleton";

type InlineReview = PaginatedQueryItem<typeof api.reviewsRead.getRecentReviewsForAlbum> | PaginatedQueryItem<typeof api.reviewsRead.getMostLikedReviewsForAlbum>;
type FullReview = PaginatedQueryItem<typeof api.reviewsRead.getLatestPostsFromFollowing> | PaginatedQueryItem<typeof api.reviewsRead.getMostLikedReviewThisWeek>;

interface ReviewListProps<T extends InlineReview | FullReview> {
  ReviewComponent: ComponentType<{
    review: T;
    index: number;
    showDivider: boolean;
  }>;
  reviews: T[];
  isLoadingFirstPage: boolean;
  canLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  emptyMessage?: string;
  className?: string;
  showLoadMore?: boolean;
}

export function ReviewList<T extends InlineReview | FullReview>({
  ReviewComponent,
  reviews,
  isLoadingFirstPage,
  canLoadMore = false,
  onLoadMore,
  isLoadingMore = false,
  emptyMessage = "No reviews yet",
  className,
  showLoadMore = true,
}: ReviewListProps<T>) {
  if (isLoadingFirstPage) {
    return (
      <div className={cn("flex flex-col", className)}>
        <RecentReviewCardSkeleton />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-[200px] items-center justify-center py-0",
          className,
        )}
      >
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {reviews.map((review, index) => (
        <ReviewComponent
          key={review._id}
          review={review}
          index={index}
          showDivider={index !== reviews.length - 1}
        />
      ))}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <svg
            className="text-muted-foreground size-6 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      {showLoadMore && canLoadMore && !isLoadingMore && onLoadMore && (
        <Button
          size="sm"
          variant="secondary"
          className="mx-auto"
          onClick={onLoadMore}
        >
          Load More
        </Button>
      )}
    </div>
  );
}
