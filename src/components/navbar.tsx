"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { SearchResultsDropdown } from "./search-results-dropdown";
import { Button } from "./ui/button";
import { SearchInput } from "./ui/search-input";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              GigReview
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link href="/reviews" className="text-sm font-medium hover:text-primary">
                Reviews
              </Link>
              <Link href="/artists" className="text-sm font-medium hover:text-primary">
                Artists
              </Link>
              <Link href="/albums" className="text-sm font-medium hover:text-primary">
                Albums
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <SearchInput
                placeholder="Search artists and albums..."
                value={searchQuery}
                onChange={handleSearchChange}
                isExpanded={isSearchFocused}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <SearchResultsDropdown
                query={searchQuery} 
                show={isSearchFocused}
              />
            </div>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button variant="outline" className="cursor-pointer">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
} 