import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import * as React from "react"
import { Input } from "./input"

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isExpanded?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, isExpanded, ...props }, ref) => {
    return (
      <div className={cn(
        "relative transition-all duration-300 flex-grow",
        isExpanded ? "w-96" : "w-64"
      )}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          className={cn("pl-9", className)}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
