import { FunctionReturnType } from "convex/server";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { Badge } from "./badge";

interface AlbumReviewCardContentProps {
  review: FunctionReturnType<typeof api.reviews.getAllUserReviews>[number] & {
    username: string;
  };
  index?: number;
  showDivider?: boolean;
}

export function AlbumReviewCardContent({
  review,
  index = 0,
  showDivider = true,
}: AlbumReviewCardContentProps) {
  const albumUrl = review.artistName && review.albumName 
    ? `/albums/${encodeURIComponent(review.artistName)}/${encodeURIComponent(review.albumName)}`
    : "#";

  return (
    <div className={`${index > 0 ? "pt-4" : ""} pb-4 ${showDivider ? "border-b" : ""}`}>
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Link 
                href={albumUrl}
                className="font-medium hover:underline"
              >
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
                Reviewed by {review.username}
              </span>
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm">
                {new Date(review.lastUpdatedTime).toLocaleDateString()}
              </span>
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
