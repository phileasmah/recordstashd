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
      <div
        className={`${isExpanded ? "max-h-48" : "max-h-16"} overflow-hidden transition-[max-height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`}
      >
        {isExpanded ? (
          <ScrollArea className="h-48">
            <p className="text-muted-foreground pr-4 text-sm whitespace-pre-line">
              {text}
            </p>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground pr-4 text-sm whitespace-pre-line">
            {text}
          </p>
        )}
      </div>
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
