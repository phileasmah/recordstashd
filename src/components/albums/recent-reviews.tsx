import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { MagicCard } from "../magicui/magic-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ReviewCardContent } from "../ui/review-cards/review-card-content";

interface RecentReviewsProps {
  albumName: string;
  artistName: string;
}

export function RecentReviews({ albumName, artistName }: RecentReviewsProps) {
  const recentReviews = useQuery(api.reviewsRead.getRecentReviews, {
    albumName,
    artistName,
    limit: 5,
  });

  if (!recentReviews || recentReviews.length === 0) {
    return (
      <MagicCard className="flex min-h-[200px] items-center justify-center rounded-xl py-0">
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to write a review for this album!
          </p>
        </CardContent>
      </MagicCard>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
        <CardDescription>
          What others are saying about this album
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-border divide-y">
          {recentReviews.map((review, index) => (
            <ReviewCardContent
              key={review._id}
              review={review}
              index={index}
              showDivider={true}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
