import { Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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

const StarRating = ({
  filled,
  onLeftClick,
  onRightClick,
  onMouseEnter,
  size = 24,
}: StarProps) => {
  return (
    <div className="relative flex cursor-pointer">
      {/* Left half star clickable area */}
      <div
        className="absolute left-0 z-10 h-full w-1/2"
        onClick={onLeftClick}
        onMouseEnter={() => onMouseEnter(false)}
      />

      {/* Right half star clickable area */}
      <div
        className="absolute right-0 z-10 h-full w-1/2"
        onClick={onRightClick}
        onMouseEnter={() => onMouseEnter(true)}
      />

      {/* Background star (always shown) */}
      <Star className="text-gray-300" fill="currentColor" size={size} />

      {/* Filled overlay */}
      <div
        className="pointer-events-none absolute top-0 left-0 overflow-hidden text-yellow-400"
        style={{ width: `${filled * 100}%` }}
      >
        <Star className="text-yellow-400" fill="currentColor" size={size} />
      </div>
    </div>
  );
};

export function RatingInput({
  value,
  onChange,
  size = 32,
  className = "",
}: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isComponentHovered, setIsComponentHovered] = useState(false);

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

  const handleClearRating = () => {
    onChange(0);
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
    <div 
      className={className}
      onMouseEnter={() => setIsComponentHovered(true)}
      onMouseLeave={() => {
        setIsComponentHovered(false);
        handleMouseLeave();
      }}
    >
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
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
        <AnimatePresence>
          {value > 0 && isComponentHovered && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ 
                duration: 0.3,
                ease: [0.2, 0, 0, 1]
              }}
              onClick={handleClearRating}
              className="ml-1 rounded-full p-1 text-gray-400 hover:bg-muted hover:text-muted-foreground transition-colors duration-300"
              aria-label="Clear rating"
            >
              <X size={size * 0.52} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
