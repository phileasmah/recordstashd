import { ReviewListSkeleton } from "@/components/reviews/review-list-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TransitionPanel } from "@/components/ui/transition-panel";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Album Info Section */}
          <Card className="flex w-full flex-col border-none bg-transparent py-0 md:flex-row lg:w-2/3">
            <div className="relative aspect-square w-full flex-shrink-0 md:w-80">
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
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 pr-8 text-base">
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
          <Card className="w-full rounded-3xl lg:w-1/3">
            <CardHeader>
              <CardTitle>
                <Skeleton className="mb-2 h-7 w-32" />
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
        <div className="border-accent grid grid-cols-1 gap-6 rounded-3xl lg:grid-cols-[1fr_2fr]">
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
                      className="hover:bg-accent flex items-center gap-4 rounded-md px-4 py-2.5 transition-colors"
                    >
                      <div className="text-muted-foreground text-center">
                        <Skeleton className="mx-auto h-5 w-5" />
                      </div>
                      <div className="flex-grow">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="mt-1 h-4 w-24" />
                      </div>
                      <Skeleton className="h-5 w-12" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Reviews Section */}
          <div>
            {/* Skeleton header & tabs */}
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-md" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-20 rounded-r rounded-l-3xl" />
                <Skeleton className="h-8 w-20 rounded-l rounded-r-3xl" />
              </div>
            </div>
            <div className="border-card-border overflow-hidden border-t px-5">
              <TransitionPanel
                activeIndex={0}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                variants={{
                  enter: { opacity: 0, y: -20, filter: "blur(4px)" },
                  center: { opacity: 1, y: 0, filter: "blur(0px)" },
                  exit: { opacity: 0, y: 20, filter: "blur(4px)" },
                }}
              >
                {[0, 1].map((i) => (
                  <div key={i} className="py-4">
                    <ReviewListSkeleton variant="inline" />
                  </div>
                ))}
              </TransitionPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
