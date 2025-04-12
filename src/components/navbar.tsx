"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { SearchBar } from "./search-bar";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              GigReview
            </Link>
            {/* <div className="hidden md:flex items-center gap-4">
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
            </div> */}
          </div>
          <div className="flex items-center gap-4">
            <SearchBar />
            <SignedIn>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="View profile"
                    labelIcon={<UserIcon className="w-4 h-4" />}
                    href="/album"
                  />
                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
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
