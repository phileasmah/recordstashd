import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../card";
import { Skeleton } from "../skeleton";

export default function RecentReviewCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-3 w-48" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-border divide-y">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-start gap-4 py-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-12" /> {/* Badge */}
                  <Skeleton className="h-4 w-20" /> {/* Reviewed by */}
                  <Skeleton className="h-4 w-16" /> {/* Username */}
                  <Skeleton className="h-4 w-10" /> {/* Dot/date */}
                  <Skeleton className="h-4 w-16" /> {/* Date */}
                  <Skeleton className="h-4 w-8" /> {/* Like button */}
                </div>
                <Skeleton className="h-4 w-40" /> {/* Review text */}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
