"use client";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { AlbumReviewCardContent } from "@/components/ui/album-review-card-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import ProfileLoading from "./loading";

interface ProfilePageContentProps {
  isOwnProfile: boolean;
  userProfile: Doc<"users">;
}

export default function ProfilePageContent({
  isOwnProfile,
  userProfile,
}: ProfilePageContentProps) {
  const userReviews = useQuery(api.reviews.getAllUserReviews, {
    userId: userProfile.externalId,
  });

  const userStats = useQuery(api.reviewAggregates.getUserStats, {
    userId: userProfile.externalId,
  });

  if (!userReviews) {
    return <ProfileLoading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-8 md:flex-row">
        <div className="flex w-full flex-col items-center gap-6 md:flex-row">
          <Avatar className="h-32 w-32 shrink-0">
            <AvatarImage
              src={userProfile.imageUrl}
              alt={userProfile.username}
            />
            <AvatarFallback>
              {userProfile.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-grow flex-col items-center gap-4 md:flex-row md:items-start">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold">
                  {userProfile.firstName || userProfile.username}
                </h1>
                {isOwnProfile && (
                  <Link href="/settings">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 cursor-pointer"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                )}
              </div>
              <p className="text-muted-foreground">@{userProfile.username}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Joined{" "}
                {new Date(userProfile._creationTime).toLocaleDateString()}
              </p>
            </div>
            <div className="my-auto flex gap-8 md:ml-auto">
              <div className="flex flex-col gap-1.5 text-center">
                <NumberTicker
                  value={userStats ? userStats.totalReviews : 0}
                  className="text-accent-foreground text-3xl font-bold tracking-tighter whitespace-pre-wrap"
                />
                <p className="text-muted-foreground text-sm">Reviews</p>
              </div>
              <div className="flex flex-col gap-1.5 text-center">
                <NumberTicker
                  value={userStats ? userStats.thisMonthReviews : 0}
                  className="text-accent-foreground text-3xl font-bold tracking-tighter whitespace-pre-wrap"
                />
                <p className="text-muted-foreground text-sm">This Month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            Recent activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-1">
              {userReviews.map((review, index) => (
                <AlbumReviewCardContent
                  key={review._id}
                  review={{
                    ...review,
                    username: userProfile.username,
                  }}
                  index={index}
                  showDivider={index !== userReviews.length - 1}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
