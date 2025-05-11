import { Skeleton } from "../skeleton";

export default function RecentReviewCardSkeleton() {
  return (
    <div className="divide-border divide-y">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-4 py-4">
          {/* Avatar skeleton */}
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            {/* Header row skeletons: badge, reviewer, date, like */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-1 w-1 rounded-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8 rounded-full" />
            </div>
            {/* Review text lines skeleton */}
            <div className="space-y-1">
              <Skeleton className="h-4 w-full max-w-[80%]" />
              <Skeleton className="h-4 w-full max-w-[60%]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
