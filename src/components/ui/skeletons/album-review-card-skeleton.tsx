
export function AlbumReviewCardSkeleton({ showDivider = true, index = 0 }: { showDivider?: boolean, index?: number }) {
  return (
    <div className={`pb-4 ${showDivider ? "border-b" : ""} ${index > 0 ? "pt-4" : ""}`}>
      <div className="flex items-start gap-4">
        <div className="relative h-22 w-22 flex-shrink-0">
          <div className="bg-muted animate-pulse rounded-md h-full w-full" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-3 w-6 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-10 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              <div className="h-3 w-3 bg-muted animate-pulse rounded-full" />
              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
              <div className="h-5 w-5 bg-muted animate-pulse rounded-full" />
            </div>
          </div>
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
} 