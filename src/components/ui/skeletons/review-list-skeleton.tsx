import { cn } from "@/lib/utils";
import { Skeleton } from "../skeleton";

interface ReviewListSkeletonProps {
  count?: number;
  className?: string;
  variant?: "inline" | "full";
}

export function ReviewListSkeleton({
  count = 3,
  className,
  variant = "inline",
}: ReviewListSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  const SkeletonContent = () => {
    if (variant === "full") {
      return (
        <div className="flex items-start gap-4 p-4">
          {/* Album cover skeleton */}
          <div className="relative h-22 w-22 flex-shrink-0">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-6" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      );
    }

    // Inline variant (for reviews without album covers)
    return (
      <div className="flex items-start gap-4 p-4">
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
    );
  };

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {items.map((i) => {
        const isFirst = i === 0;
        const isLast = i === items.length - 1;
        const isMiddle = !isFirst && !isLast;

        return (
          <div
            key={i}
            className={cn(
              "bg-card",
              isFirst && "rounded-t-3xl rounded-b",
              isLast && "rounded rounded-b-3xl",
              isMiddle && "rounded",
              items.length === 1 && "rounded-3xl",
            )}
          >
            <SkeletonContent />
          </div>
        );
      })}
    </div>
  );
}
