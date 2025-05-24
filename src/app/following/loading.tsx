import { ReviewListSkeleton } from "@/components/ui/skeletons/review-list-skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Following Activity</h1>
        <p className="text-muted-foreground mt-2">
          See what the people you follow are reviewing
        </p>
      </div>
      <ReviewListSkeleton variant="full" />
    </div>
  );
}