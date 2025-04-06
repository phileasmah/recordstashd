import { Star } from "lucide-react";
import { useState } from "react";

interface StarProps {
  filled: number;
  onLeftClick: () => void;
  onRightClick: () => void;
  onMouseEnter: (isRight: boolean) => void;
  size?: number;
}

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
  className?: string;
}

const StarRating = ({ filled, onLeftClick, onRightClick, onMouseEnter, size = 24 }: StarProps) => {
  return (
    <div className="relative cursor-pointer flex">
      {/* Left half star clickable area */}
      <div 
        className="absolute left-0 w-1/2 h-full z-10"
        onClick={onLeftClick}
        onMouseEnter={() => onMouseEnter(false)}
      />
      
      {/* Right half star clickable area */}
      <div 
        className="absolute right-0 w-1/2 h-full z-10"
        onClick={onRightClick}
        onMouseEnter={() => onMouseEnter(true)}
      />
      
      {/* Background star (always shown) */}
      <Star 
        className="text-gray-300" 
        fill="currentColor"
        size={size}
      />
      
      {/* Filled overlay */}
      <div 
        className="absolute top-0 left-0 overflow-hidden text-yellow-400 pointer-events-none"
        style={{ width: `${filled * 100}%` }}
      >
        <Star 
          className="text-yellow-400" 
          fill="currentColor"
          size={size}
        />
      </div>
    </div>
  );
};

export function RatingInput({ value, onChange, size = 32, className = "" }: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleStarClick = (starIndex: number, isRightHalf: boolean) => {
    const baseValue = starIndex + 1;
    const newValue = isRightHalf ? baseValue : baseValue - 0.5;
    onChange(newValue);
  };

  const handleStarHover = (starIndex: number, isRightHalf: boolean) => {
    const baseValue = starIndex + 1;
    const value = isRightHalf ? baseValue : baseValue - 0.5;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const getStarFilled = (index: number): number => {
    const currentRating = hoverRating || value;
    const starPosition = index + 1;
    
    if (currentRating >= starPosition) return 1;
    if (currentRating > index && currentRating < starPosition) return 0.5;
    return 0;
  };

  return (
    <div className={className}>
      <div 
        className="flex gap-1" 
        onMouseLeave={handleMouseLeave}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <div key={index} className="w-9">
            <StarRating
              filled={getStarFilled(index)}
              onLeftClick={() => handleStarClick(index, false)}
              onRightClick={() => handleStarClick(index, true)}
              onMouseEnter={(isRight) => handleStarHover(index, isRight)}
              size={size}
            />
          </div>
        ))}
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        {value ? `Your rating: ${value} stars` : 'Click to rate'}
      </div>
    </div>
  );
} 