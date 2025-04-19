import { PaginatedQueryItem } from "convex/react";
import { FunctionReturnType } from "convex/server";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import { Badge } from "../badge";
import { LikeButton } from "./like-button";

interface AlbumReviewCardContentProps {
  review:
    | (FunctionReturnType<typeof api.reviewsRead.getAllUserReviews>[number] & {
        username: string;
        userDisplayName: string | null;
      })
    | PaginatedQueryItem<typeof api.reviewsRead.getLatestPostsFromFollowing>;
  index?: number;
  showDivider?: boolean;
}

export function AlbumReviewCardContent({
  review,
  index = 0,
  showDivider = true,
}: AlbumReviewCardContentProps) {
  const albumUrl =
    review.artistName && review.albumName
      ? `/albums/${encodeURIComponent(review.artistName)}/${encodeURIComponent(review.albumName)}`
      : "#";

  return (
    <div
      className={`${index > 0 ? "pt-4" : ""} pb-4 ${showDivider ? "border-b" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`relative ${
            review.review ? "h-22 w-22" : "h-14 w-14"
          } flex-shrink-0`}
        >
          <Image
            src={review.spotifyAlbumUrl || "/placeholder.png"}
            alt={review.albumName || "Album cover"}
            fill
            sizes="100%"
            className="rounded-md object-cover"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Link href={albumUrl} className="font-medium hover:underline">
                {review.albumName}
              </Link>
              <span className="text-muted-foreground text-sm">by</span>
              <span className="text-muted-foreground font-medium">
                {review.artistName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {review.rating !== undefined && review.rating !== 0 && (
                <Badge variant="secondary">{review.rating} ★</Badge>
              )}
              <span className="text-muted-foreground text-sm">
                Reviewed by{" "}
                {"likedByUser" in review ? (
                  <span className="text-sm font-medium">
                    {review.userDisplayName
                      ? review.userDisplayName
                      : review.username}
                  </span>
                ) : (
                  <Link
                    href={`/${review.username}`}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    {review.userDisplayName
                      ? review.userDisplayName
                      : review.username}
                  </Link>
                )}
              </span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm">
                {new Date(review.lastUpdatedTime).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
              {"likedByUser" in review && (
                <LikeButton
                  reviewId={review._id}
                  initialLikedState={review.likedByUser}
                  initialLikeCount={review.likeCount}
                  className="-ml-0.5"
                />
              )}
            </div>
          </div>
          {review.review && (
            <p className="text-muted-foreground text-sm">{review.review}</p>
          )}
        </div>
      </div>
    </div>
  );
}
