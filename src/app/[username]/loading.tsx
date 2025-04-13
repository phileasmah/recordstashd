import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
              </div>
              {/* Username Skeleton */}
              <Skeleton className="mt-1 h-5 w-32" />
              {/* Join Date Skeleton */}
              <Skeleton className="mt-1 h-4 w-40" />
            </div>
            
            {/* Stats Skeletons */}
            <div className="my-auto flex gap-8 md:ml-auto">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5 text-center">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList>
          <TabsTrigger value="reviews" disabled>Reviews</TabsTrigger>
          <TabsTrigger value="liked" disabled>Liked Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {/* Review Skeletons */}
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      {/* Review Avatar */}
                      <Skeleton className="mt-1 h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {/* Rating Badge */}
                          <Skeleton className="h-5 w-16" />
                          {/* Username and Date */}
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        {/* Review Text */}
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="liked">
          <Card>
            <CardHeader>
              <CardTitle>Liked Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <Skeleton className="mx-auto h-6 w-32" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 