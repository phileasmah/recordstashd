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
        className={`${isExpanded ? "max-h-56" : "max-h-16"} overflow-hidden transition-[max-height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`}
      >
        {isExpanded && needsScroll ? (
          <ScrollArea className="h-56">
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
          className="text-primary h-auto p-0 text-xs hover:bg-transparent hover:underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
}
