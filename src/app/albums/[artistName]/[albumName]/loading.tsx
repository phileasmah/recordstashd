import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import RecentReviewCardSkeleton from "@/components/ui/skeletons/recent-review-card-skeleton";
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Album Info Section */}
          <Card className="flex w-full flex-col py-0 md:flex-row lg:w-2/3 bg-transparent border-none">
            <div className="relative aspect-square w-full md:w-80 flex-shrink-0">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <CardHeader className="flex-grow px-4 py-6 md:px-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-end gap-3">
                    <CardTitle className="text-3xl font-bold">
                      <Skeleton className="h-10 w-48" />
                    </CardTitle>
                    <Skeleton className="h-6 w-24 rounded" />
                  </div>
                  <CardDescription className="text-xl">
                    <Skeleton className="h-6 w-32" />
                  </CardDescription>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-base pr-8">
                  <div className="text-muted-foreground">Release Date:</div>
                  <Skeleton className="h-5 w-24" />
                  <div className="text-muted-foreground">Total Tracks:</div>
                  <Skeleton className="h-5 w-16" />
                  <div className="text-muted-foreground">Label:</div>
                  <Skeleton className="h-5 w-32" />
                  <div className="text-muted-foreground">Average Rating:</div>
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Review Input Section */}
          <Card className="w-full lg:w-1/3">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-7 w-32 mb-2" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-5 w-48" />
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-4 flex flex-col gap-4">
              <Skeleton className="h-8 w-40" /> {/* Rating input */}
              <Skeleton className="h-10 w-full" /> {/* Button */}
            </CardContent>
          </Card>
        </div>

        {/* Tracks and Reviews Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Tracks Section */}
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-7 w-24" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-5 w-32" />
              </CardDescription>
            </CardHeader>
            <div className="h-[400px]">
              <CardContent>
                <div className="space-y-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="hover:bg-accent flex items-center gap-4 rounded-md py-2.5 transition-colors px-4"
                    >
                      <div className="text-muted-foreground text-center">
                        <Skeleton className="h-5 w-5 mx-auto" />
                      </div>
                      <div className="flex-grow">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-24 mt-1" />
                      </div>
                      <Skeleton className="h-5 w-12" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Reviews Section */}
          <RecentReviewCardSkeleton />
        </div>
      </div>
    </div>
  );
} 