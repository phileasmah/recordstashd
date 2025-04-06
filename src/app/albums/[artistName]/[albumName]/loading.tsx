import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Fragment } from "react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Album Cover Skeleton */}
          <Card className="relative w-64 h-64 shrink-0 overflow-hidden">
            <Skeleton className="w-full h-full" />
          </Card>
          
          <div className="space-y-4 flex-grow">
            {/* Title and Artist Skeletons */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>

            {/* Album Info Skeletons */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3].map((i) => (
                  <Fragment key={i}>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tracks Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-2">
                <Skeleton className="h-6 w-8" />
                <div className="flex-grow space-y-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 