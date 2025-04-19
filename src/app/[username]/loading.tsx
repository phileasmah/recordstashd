import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

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
                <Skeleton className="text-3xl font-bold tracking-tighter h-9 w-16" />
                <Skeleton className="text-sm h-4 w-14" />
              </div>
              {/* This Month */}
              <div className="flex flex-col gap-1.5 text-center">
                <Skeleton className="text-3xl font-bold tracking-tighter h-9 w-16" />
                <Skeleton className="text-sm h-4 w-20" />
              </div>
              {/* Followers */}
              <div className="flex flex-col gap-1.5 text-center">
                <Skeleton className="text-3xl font-bold tracking-tighter h-9 w-16" />
                <Skeleton className="text-sm h-4 w-16" />
              </div>
              {/* Following */}
              <div className="flex flex-col gap-1.5 text-center">
                <Skeleton className="text-3xl font-bold tracking-tighter h-9 w-16" />
                <Skeleton className="text-sm h-4 w-16" />
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
            <div className="divide-border divide-y space-y-1">
              {/* Review Skeletons */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`${i > 0 ? "pt-4" : ""} pb-4`}>
                  <div className="flex items-start gap-4">
                    {/* Review Avatar */}
                    <Skeleton className="mt-1 h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      {/* Album Info */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <Skeleton className="h-5 w-32" /> {/* Album name */}
                          <Skeleton className="h-4 w-8" /> {/* "by" text */}
                          <Skeleton className="h-5 w-24" /> {/* Artist name */}
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-16" /> {/* Rating badge */}
                          <Skeleton className="h-4 w-20" /> {/* "Reviewed by" */}
                          <Skeleton className="h-4 w-24" /> {/* Username */}
                          <Skeleton className="h-4 w-4" /> {/* Bullet */}
                          <Skeleton className="h-4 w-24" /> {/* Date */}
                          <Skeleton className="h-6 w-16" /> {/* Like button */}
                        </div>
                      </div>
                      {/* Review Text */}
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 