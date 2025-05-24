import { ReviewListSkeleton } from "@/components/ui/skeletons/review-list-skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Popular Reviews This Week</h1>
        <p className="text-muted-foreground mt-2">
          The most liked reviews from the past week
        </p>
      </div>
      <ReviewListSkeleton variant="full" />
    </div>
  );
}
