import { Badge } from "./badge";

interface RatingBadgeProps {
  rating: number;
  hoverText?: string;
  className?: string;
}

export function RatingBadge({
  rating,
  hoverText,
  className = "",
}: RatingBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={`group flex items-center gap-0 overflow-hidden text-sm transition-all duration-300 ease-in-out hover:pr-2 ${className}`}
    >
      <span>
        {rating.toFixed(1)} <span className="text-yellow-400">★</span>
      </span>
      {hoverText && (
        <span className="max-w-0 opacity-0 transition-all duration-300 ease-in-out group-hover:ml-1 group-hover:max-w-xs group-hover:opacity-100">
          ({hoverText})
        </span>
      )}
    </Badge>
  );
}
