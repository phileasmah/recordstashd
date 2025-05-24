"use client";

import { ReviewList } from "@/components/reviews/review-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/ui/follow-button";
import { FollowDialog } from "@/components/ui/follow-dialog";
import { AlbumReviewCardContent } from "@/components/ui/review-cards/album-review-card-content";
import { usePaginatedQuery, useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";

interface ProfilePageContentProps {
  isOwnProfile: boolean;
  userProfile: NonNullable<
    FunctionReturnType<typeof api.users.getUserByUsername>
  >;
  isSignedIn: boolean;
}

// TODO: Use preload from convex for reactivity when changing user info
export default function ProfilePageContent({
  isOwnProfile,
  userProfile,
  isSignedIn,
}: ProfilePageContentProps) {
  const {
    results: userReviews,
    status: userReviewsStatus,
    loadMore: loadMoreReviews,
  } = usePaginatedQuery(
    api.reviewsRead.getAllUserReviews,
    { userId: userProfile.externalId },
    { initialNumItems: 10 },
  );

  const userStats = useQuery(api.reviewAggregates.getUserStats, {
    userId: userProfile.externalId,
  });

  const followerCount = useQuery(api.follows.getFollowerCount, {
    userId: userProfile.externalId,
  });

  const followingCount = useQuery(api.follows.getFollowingCount, {
    userId: userProfile.externalId,
  });

  const paginatedFollowers = usePaginatedQuery(
    api.follows.getFollowers,
    { userId: userProfile.externalId },
    { initialNumItems: 10 },
  );

  const paginatedFollowing = usePaginatedQuery(
    api.follows.getFollowing,
    { userId: userProfile.externalId },
    { initialNumItems: 10 },
  );

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
                  {userProfile.userDisplayName}
                </h1>
                {isOwnProfile ? (
                  <Link href="/settings">
                    <Button variant="outline" size="sm" className="h-8">
                      Edit Profile
                    </Button>
                  </Link>
                ) : (
                  isSignedIn && (
                    <FollowButton followingId={userProfile.externalId} />
                  )
                )}
              </div>
              <p className="text-muted-foreground">@{userProfile.username}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Joined{" "}
                {new Date(userProfile._creationTime).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  },
                )}
              </p>
            </div>
            <div className="my-auto flex gap-8 md:ml-auto">
              <div className="flex flex-col gap-1.5 text-center">
                <span className="text-accent-foreground text-3xl font-bold tracking-tighter whitespace-pre-wrap">
                  {userStats ? userStats.totalReviews : 0}
                </span>
                <p className="text-muted-foreground text-sm">Reviews</p>
              </div>
              <div className="flex flex-col gap-1.5 text-center">
                <span className="text-accent-foreground text-3xl font-bold tracking-tighter whitespace-pre-wrap">
                  {userStats ? userStats.thisMonthReviews : 0}
                </span>
                <p className="text-muted-foreground text-sm">This Month</p>
              </div>
              <FollowDialog
                type="followers"
                count={followerCount ?? 0}
                {...paginatedFollowers}
              />
              <FollowDialog
                type="following"
                count={followingCount ?? 0}
                {...paginatedFollowing}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground mt-2">Recent activity</p>
        </div>
        <ReviewList
          ReviewComponent={AlbumReviewCardContent}
          reviews={userReviews}
          status={userReviewsStatus}
          onLoadMore={() => loadMoreReviews(10)}
          emptyMessage="No reviews yet"
        />
      </div>
    </div>
  );
}
