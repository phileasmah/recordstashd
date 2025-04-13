import { FunctionReturnType } from "convex/server";
import Image from "next/image";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";

interface ReviewCardContentProps {
  review: FunctionReturnType<typeof api.reviews.getRecentReviews>[number];
  index?: number;
  showDivider?: boolean;
}

export function ReviewCardContent({
  review,
  index = 0,
  showDivider = true,
}: ReviewCardContentProps) {
  return (
    <div
      className={`${index > 0 ? "pt-4" : ""} pb-4 ${showDivider ? "border-b" : ""}`}
    >
      <div className="flex items-start gap-4">
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
              {review.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                {review.rating !== undefined && review.rating !== 0 && (
                  <Badge variant="secondary">{review.rating} ★</Badge>
                )}
                <span className="text-muted-foreground text-sm">
                  Reviewed by
                </span>
                <p className="text-sm font-medium">{review.username}</p>
                <span className="text-muted-foreground text-sm">•</span>
                <p className="text-muted-foreground text-sm">
                  {new Date(review.lastUpdatedTime).toLocaleDateString()}
                </p>
              </div>
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
