import { Badge } from "./badge";

interface RatingBadgeProps {
  rating: number;
  hoverText?: string;
  className?: string;
  prefix?: string;
}

export function RatingBadge({
  rating,
  hoverText,
  className = "",
  prefix = "",
}: RatingBadgeProps) {
  return (
    <div>
      <Badge
        variant="secondary"
        className={`group flex flex-wrap items-center gap-0 overflow-hidden text-sm ${className}`}
      >
        <span>
          {prefix}
          {rating.toFixed(1)} <span className="text-yellow-400">★</span>
        </span>
        {hoverText && (
          <span className="ml-1 xl:ml-0 xl:max-w-0 xl:opacity-0 xl:transition-all xl:duration-300 xl:ease-in-out xl:group-hover:ml-1 xl:group-hover:max-w-xs xl:group-hover:opacity-100">
            ({hoverText})
          </span>
        )}
      </Badge>
    </div>
  );
}
