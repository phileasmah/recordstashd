import { createAlbumSlug, createArtistSlug } from "@/utils/slugify";
import { PaginatedQueryItem } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import { RatingBadge } from "../rating-badge";
import { ExpandableReviewText } from "./components/expandable-review-text";
import { LikeButton } from "./components/like-button";
import { SimpleReviewRating } from "./components/simple-review-rating";

interface AlbumReviewCardContentProps {
  review:
    | (PaginatedQueryItem<typeof api.reviewsRead.getAllUserReviews> & {
        username: string;
        userDisplayName: string | null;
      })
    | PaginatedQueryItem<typeof api.reviewsRead.getLatestPostsFromFollowing>
    | PaginatedQueryItem<typeof api.reviewsRead.getMostLikedReviewThisWeek>;
}

export function AlbumReviewCardContent({
  review,
}: AlbumReviewCardContentProps) {
  const hasReview = !!review.review;
  const albumUrl =
    review.artistName && review.albumName
      ? `/albums/${createArtistSlug(review.artistName)}/${createAlbumSlug(review.albumName)}`
      : "#";

  if (!hasReview && review.rating) {
    return <SimpleReviewRating review={review} albumUrl={albumUrl} />;
  }

  return (
    <div className="flex items-start gap-4 p-6">
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
          className="rounded object-cover"
        />
      </div>
      <div className="flex-1 space-y-2">
        <div className="text-muted-foreground flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href={albumUrl}
              className="text-primary font-medium hover:underline"
            >
              {review.albumName}
            </Link>
            <span>by</span>
            <span>{review.artistName}</span>
            {review.rating !== undefined && review.rating !== 0 && (
              <div className="block sm:hidden">
                <RatingBadge rating={review.rating} />
              </div>
            )}
          </div>
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
                className="mt-0.5"
              />
            </div>
          </div>
        </div>
        {review.review && <ExpandableReviewText text={review.review} />}
      </div>
    </div>
  );
}
