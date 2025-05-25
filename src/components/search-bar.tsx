import { cn } from "@/lib/utils";
import { ArrowUp, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SearchResultsDropdown } from "./search-results-dropdown";
import { SearchInput } from "./ui/search-input";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const openMobileSearch = () => {
    setIsMobileSearchOpen(true);
  };

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false);
  };

  useEffect(() => {
    if (isMobileSearchOpen) {
      // Timeout ensures the element is rendered before focusing
      setTimeout(() => mobileInputRef.current?.focus(), 0);
    }
  }, [isMobileSearchOpen]);

  const handleResultClickDesktop = () => {
    setIsSearchFocused(false);
    // Blur the input to remove focus from the navbar
    desktopInputRef.current?.blur();
  };

  return (
    <>
      {/* Desktop Search Bar (Hidden on small screens) */}
      <div className="relative hidden md:block">
        <SearchInput
          ref={desktopInputRef}
          placeholder="Search albums..."
          value={searchQuery}
          onChange={handleSearchChange}
          isExpanded={isSearchFocused}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={(e) => {
            // Delay check to allow clicking on dropdown
            setTimeout(() => {
              // Check if focus moved outside the input AND the dropdown
              // Assumes SearchResultsDropdown has data-search-dropdown on its root
              if (
                !e.relatedTarget?.closest(
                  "[data-search-input], [data-search-dropdown]",
                )
              ) {
                setIsSearchFocused(false);
              }
            }, 100);
          }}
          data-search-input
        />
        <SearchResultsDropdown
          query={searchQuery}
          show={isSearchFocused && searchQuery.length > 0}
          onMouseDown={() => {
            // The e.preventDefault() is handled within SearchResultsDropdown
            // No need to do anything here, but the prop is kept for potential future use
            // or to signal that the mousedown event is being handled.
          }}
          isMobile={false}
          onResultClick={handleResultClickDesktop}
        />
      </div>

      {/* Mobile Search Icon/Button (Visible only on small screens) */}
      <button
        onClick={openMobileSearch}
        className="hover:bg-accent hover:text-accent-foreground rounded-md p-2 md:hidden"
        aria-label="Open search"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Mobile Search Overlay (Visible only when open and on small screens) */}
      <div
        className={cn(
          "bg-background/80 fixed inset-0 z-50 flex flex-col p-4 backdrop-blur-sm md:hidden",
          !isMobileSearchOpen && "hidden",
        )}
      >
        <div className="mb-4 flex w-full items-center gap-2">
          <SearchInput
            ref={mobileInputRef}
            placeholder="Search albums..."
            value={searchQuery}
            onChange={handleSearchChange}
            isExpanded={true}
            className="flex-grow"
            data-search-input
          />
          <button
            onClick={closeMobileSearch}
            className="hover:bg-accent hover:text-accent-foreground flex-shrink-0 rounded-md p-2"
            aria-label="Close search"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Search Results Area */}
        <div className="flex-grow overflow-y-auto">
          <SearchResultsDropdown
            query={searchQuery}
            show={searchQuery.length > 0}
            isMobile={true}
            onResultClick={closeMobileSearch}
          />
        </div>
      </div>
    </>
  );
}
