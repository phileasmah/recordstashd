import { useEffect, useRef, useState } from "react";
import { Button } from "../button";
import { ScrollArea } from "../scroll-area";

interface ExpandableReviewTextProps {
  text: string;
}

export function ExpandableReviewText({ text }: ExpandableReviewTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setNeedsScroll(contentRef.current.scrollHeight > 224); // 14rem (224px)
    }
  }, [isExpanded, text]);

  return (
    <div className="space-y-2">
      <div
        className={`${
          isExpanded ? "max-h-lvh" : "max-h-36"
        } overflow-hidden transition-all duration-500 ease-in-out`}
      >
        {isExpanded && needsScroll ? (
          <ScrollArea className="h-56">
            <p className="text-muted-foreground pr-4 text-sm whitespace-pre-line">
              {text}
            </p>
          </ScrollArea>
        ) : (
          <p
            className={`text-muted-foreground pr-4 text-sm whitespace-pre-line ${!isExpanded ? "line-clamp-6" : ""}`}
          >
            {text}
          </p>
        )}
      </div>
      {text.split("\n").length > 3 && (
        <Button
          variant="ghost"
          className="text-primary h-auto p-0 text-xs hover:bg-transparent hover:underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
}
