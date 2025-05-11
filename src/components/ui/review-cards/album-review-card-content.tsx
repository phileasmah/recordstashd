import { createAlbumSlug, createArtistSlug } from "@/utils/slugify";
import { PaginatedQueryItem } from "convex/react";
import { FunctionReturnType } from "convex/server";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import { RatingBadge } from "../rating-badge";
import { ExpandableReviewText } from "./expandable-review-text";
import { LikeButton } from "./like-button";
import { SimpleReviewRating } from "./simple-review-rating";

interface AlbumReviewCardContentProps {
  review:
    | (FunctionReturnType<typeof api.reviewsRead.getAllUserReviews>[number] & {
        username: string;
        userDisplayName: string | null;
      })
    | PaginatedQueryItem<typeof api.reviewsRead.getLatestPostsFromFollowing>
    | PaginatedQueryItem<typeof api.reviewsRead.getMostLikedReviewThisWeek>;
  index?: number;
  showDivider?: boolean;
}

export function AlbumReviewCardContent({
  review,
  index = 0,
  showDivider = true,
}: AlbumReviewCardContentProps) {
  const hasReview = !!review.review;
  const albumUrl =
    review.artistName && review.albumName
      ? `/albums/${createArtistSlug(review.artistName)}/${createAlbumSlug(review.albumName)}`
      : "#";

  if (!hasReview && review.rating) {
    return (
      <div
        className={`${index > 0 ? "pt-4" : ""} pb-4 ${showDivider ? "border-b" : ""}`}
      >
        <SimpleReviewRating review={review} albumUrl={albumUrl} />
      </div>
    );
  }

  return (
    <div
      className={`${index > 0 ? "pt-4" : ""} pb-4 ${showDivider ? "border-b" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`relative ${
            hasReview ? "h-22 w-22" : "h-14 w-14"
          } flex-shrink-0`}
        >
          <Image
            src={review.spotifyAlbumUrl || "/placeholder.png"}
            alt={review.albumName || `Album cover for ${review.albumName}`}
            fill
            sizes="100%"
            className="rounded-md object-cover"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-muted-foreground flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Link
                href={albumUrl}
                className="text-primary font-medium hover:underline"
              >
                {review.albumName}
              </Link>
              <span>by</span>
              <span>{review.artistName}</span>
            </div>
            <div className="flex items-center gap-2">
              {review.rating !== undefined && review.rating !== 0 && (
                <RatingBadge rating={review.rating} />
              )}
              <span className="text-muted-foreground text-sm">
                Reviewed by{" "}
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
              <span>•</span>
              <span>
                {new Date(review.lastUpdatedTime).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
              <LikeButton
                reviewId={review._id}
                likedByUser={review.likedByUser}
                likeCount={review.likes}
              />
            </div>
          </div>
          {review.review && <ExpandableReviewText text={review.review} />}
        </div>
      </div>
    </div>
  );
}
