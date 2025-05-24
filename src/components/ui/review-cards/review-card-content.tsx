import { PaginatedQueryItem } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback } from "../avatar";
import { RatingBadge } from "../rating-badge";
import { ExpandableReviewText } from "./components/expandable-review-text";
import { LikeButton } from "./components/like-button";

interface ReviewCardContentProps {
  review:
    | PaginatedQueryItem<typeof api.reviewsRead.getRecentReviewsForAlbum>
    | PaginatedQueryItem<typeof api.reviewsRead.getMostLikedReviewsForAlbum>;
}

export function ReviewCardContent({ review }: ReviewCardContentProps) {
  return (
    <div className="flex items-start gap-4 py-4 px-5">
      <Avatar className="mt-1 h-8 w-8">
        {review.userImageUrl ? (
          <div className="relative h-full w-full">
            <Image
              src={review.userImageUrl}
              alt={`${review.username}'s avatar`}
              fill
              sizes="100%"
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <AvatarFallback>
            {review.username ? review.username.slice(0, 2).toUpperCase() : "AN"}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center">
        <div className="flex-1 space-y-2">
          <div className="text-muted-foreground flex flex-col gap-2 text-sm">
            <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center">
              {review.rating !== undefined && review.rating !== 0 && (
                <div className="mr-1 hidden sm:block">
                  <RatingBadge rating={review.rating} />
                </div>
              )}
              <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
                <span>Review by</span>
                <span>
                  {review.username ? (
                    <Link
                      href={`/${review.username}`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      {review.userDisplayName}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium">
                      {review.userDisplayName}
                    </span>
                  )}
                </span>
                <div className="hidden items-center gap-1.5 sm:flex">
                  <span className="text-muted-foreground text-sm">•</span>
                  <p className="text-muted-foreground text-sm">
                    {new Date(review.lastUpdatedTime).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <LikeButton
                  reviewId={review._id}
                  likedByUser={review.likedByUser}
                  likeCount={review.likes}
                />
              </div>
            </div>
          </div>
          {review.review && <ExpandableReviewText text={review.review} />}
        </div>
      </div>
    </div>
  );
}
