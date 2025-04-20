import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlbumReviewCardSkeleton } from "@/components/ui/skeletons/album-review-card-skeleton";

export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-8 md:flex-row">
        <div className="flex w-full flex-col items-center gap-6 md:flex-row">
          {/* Avatar Skeleton */}
          <Skeleton className="h-32 w-32 shrink-0 rounded-full" />

          <div className="flex flex-grow flex-col items-center gap-4 md:flex-row md:items-start">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-4">
                {/* Name Skeleton */}
                <Skeleton className="h-9 w-48" />
                {/* Button Skeleton */}
                <Skeleton className="h-8 w-24" />
              </div>
              {/* Username Skeleton */}
              <Skeleton className="mt-1 h-5 w-32" />
              {/* Join Date Skeleton */}
              <Skeleton className="mt-1 h-4 w-40" />
            </div>

            {/* Stats Skeletons */}
            <div className="my-auto flex gap-8 md:ml-auto">
              {/* Reviews */}
              <div className="flex flex-col gap-1.5 text-center">
                <Skeleton className="h-9 w-16 text-3xl font-bold tracking-tighter" />
                <Skeleton className="h-4 w-14 text-sm" />
              </div>
              {/* This Month */}
              <div className="flex flex-col gap-1.5 text-center">
                <Skeleton className="h-9 w-16 text-3xl font-bold tracking-tighter" />
                <Skeleton className="h-4 w-20 text-sm" />
              </div>
              {/* Followers */}
              <div className="flex flex-col gap-1.5 text-center">
                <Skeleton className="h-9 w-16 text-3xl font-bold tracking-tighter" />
                <Skeleton className="h-4 w-16 text-sm" />
              </div>
              {/* Following */}
              <div className="flex flex-col gap-1.5 text-center">
                <Skeleton className="h-9 w-16 text-3xl font-bold tracking-tighter" />
                <Skeleton className="h-4 w-16 text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>Recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="divide-border space-y-1 divide-y">
              {/* Review Skeletons */}
              {[...Array(3)].map((_, i) => (
                <AlbumReviewCardSkeleton
                  key={i}
                  showDivider={i !== 2}
                  index={i}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
