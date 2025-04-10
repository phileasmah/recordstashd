import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Fragment } from "react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Album Info Section */}
          <Card className="flex-grow lg:w-2/3 py-0 flex-col md:flex-row">
            <div className="relative aspect-square w-full md:w-80">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <CardHeader className="flex-grow py-6 px-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {[1, 2, 3].map((i) => (
                    <Fragment key={i}>
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-32" />
                    </Fragment>
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Review Input Section */}
          <Card className="lg:w-1/3">
            <CardHeader>
              <Skeleton className="h-7 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tracks and Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tracks Section */}
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-24" />
            </CardHeader>
            <div className="h-[400px]">
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="hover:bg-accent flex items-center gap-4 rounded-md p-2 transition-colors">
                      <div className="w-8 text-center">
                        <Skeleton className="h-6 w-6 mx-auto" />
                      </div>
                      <div className="flex-grow">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32 mt-1" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 