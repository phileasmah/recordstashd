import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../button";
import { ScrollArea } from "../scroll-area";

interface ExpandableReviewTextProps {
  text: string;
}

export function ExpandableReviewText({ text }: ExpandableReviewTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <motion.div
        animate={{ maxHeight: isExpanded ? "12rem" : "4rem" }}
        transition={{ 
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="overflow-hidden"
      >
        {isExpanded ? (
          <div className="h-[12rem]">
            <ScrollArea className="h-full w-full">
              <div className="pr-4">
                <p className="text-muted-foreground text-sm whitespace-pre-line">
                  {text}
                </p>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <p className="text-muted-foreground pr-4 text-sm whitespace-pre-line">
            {text}
          </p>
        )}
      </motion.div>
      {text.split("\n").length > 3 && (
        <Button
          variant="ghost"
          className="text-primary h-auto cursor-pointer p-0 text-xs hover:bg-transparent hover:underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
}
