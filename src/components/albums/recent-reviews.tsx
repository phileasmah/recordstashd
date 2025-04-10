import { AvatarImage } from "@radix-ui/react-avatar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface RecentReviewsProps {
  albumName: string;
  artistName: string;
}

export function RecentReviews({ albumName, artistName }: RecentReviewsProps) {
  const recentReviews = useQuery(api.reviews.getRecentReviews, {
    albumName,
    artistName,
    limit: 50,
  });

  if (!recentReviews || recentReviews.length === 0) {
    return (
      <Card className="flex items-center justify-center py-0 min-h-[200px]">
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to review this album!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
        <CardDescription>What others are saying about this album</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {recentReviews.map((review, index) => (
            <div key={index} className={`${index > 0 ? 'pt-4' : ''} pb-4`}>
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={review.userImageUrl} />
                  <AvatarFallback>
                    {review.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{review.username}</p>
                        <Badge variant="secondary">
                          {review.rating} ★
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {review.review && (
                    <p className="text-sm text-muted-foreground">
                      {review.review}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 