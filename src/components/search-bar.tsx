"use client";

import { useState } from "react";
import { SearchResultsDropdown } from "./search-results-dropdown";
import { SearchInput } from "./ui/search-input";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative">
      <SearchInput
        placeholder="Search albums..."
        value={searchQuery}
        onChange={handleSearchChange}
        isExpanded={isSearchFocused}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={(e) => {
          if (!e.relatedTarget?.closest("[data-search-dropdown]")) {
            setIsSearchFocused(false);
          }
        }}
      />
      <SearchResultsDropdown
        query={searchQuery}
        show={isSearchFocused}
        onMouseDown={() => {
          setIsSearchFocused(true);
        }}
      />
    </div>
  );
}
