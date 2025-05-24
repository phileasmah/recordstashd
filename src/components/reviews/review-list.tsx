import { cn } from "@/lib/utils";
import { PaginatedQueryItem, PaginationStatus } from "convex/react";
import { ComponentType } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { ReviewListSkeleton } from "./review-list-skeleton";

type InlineReview =
  | PaginatedQueryItem<typeof api.reviewsRead.getRecentReviewsForAlbum>
  | PaginatedQueryItem<typeof api.reviewsRead.getMostLikedReviewsForAlbum>;
type FullReview =
  | PaginatedQueryItem<typeof api.reviewsRead.getLatestPostsFromFollowing>
  | PaginatedQueryItem<typeof api.reviewsRead.getMostLikedReviewThisWeek>
  | (PaginatedQueryItem<typeof api.reviewsRead.getAllUserReviews> & {
      username: string;
      userDisplayName: string | null;
    });

interface ReviewListProps<T extends InlineReview | FullReview> {
  ReviewComponent: ComponentType<{
    review: T;
    index?: number;
    showDivider?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
  }>;
  reviews: T[];
  emptyMessage?: string;
  className?: string;
  showLoadMore?: boolean;
  skeletonVariant?: "inline" | "full";
  // Pagination-aware props (when used with usePaginatedQuery)
  status?: PaginationStatus;
  onLoadMore?: (numItems?: number) => void;
}

export function ReviewList<T extends InlineReview | FullReview>({
  ReviewComponent,
  reviews,
  emptyMessage = "No reviews yet",
  className,
  onLoadMore,
  showLoadMore = true,
  status,
  skeletonVariant = "full",
}: ReviewListProps<T>) {
  // Derive loading states from pagination status
  const isLoadingFirst = status === "LoadingFirstPage";
  const isLoadingMorePages = status === "LoadingMore";
  const canLoadMorePages = status === "CanLoadMore";

  if (isLoadingFirst) {
    return (
      <div className={cn("flex flex-col", className)}>
        <ReviewListSkeleton variant={skeletonVariant} />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div
        className={cn(
          "bg-card opacity-50 flex min-h-[100px] items-center justify-center rounded-3xl py-0",
          className,
        )}
      >
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const handleLoadMore = () => {
    if (onLoadMore) {
      // Call with default numItems (20) when used with pagination
      onLoadMore(20);
    }
  };

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {reviews.map((review, index) => {
        const isFirst = index === 0;
        const isLast = index === reviews.length - 1;
        const isMiddle = !isFirst && !isLast;

        return (
          <div
            key={review._id}
            className={cn(
              "bg-card",
              isFirst && "rounded-t-3xl rounded-b",
              isLast && "rounded rounded-b-3xl",
              isMiddle && "rounded",
              reviews.length === 1 && "rounded-3xl",
            )}
          >
            <ReviewComponent review={review} />
          </div>
        );
      })}
      {isLoadingMorePages && (
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
      {showLoadMore &&
        canLoadMorePages &&
        !isLoadingMorePages &&
        onLoadMore && (
          <Button
            size="sm"
            variant="secondary"
            className="mx-auto mt-4"
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        )}
    </div>
  );
}
