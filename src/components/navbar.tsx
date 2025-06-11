"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { SearchBar } from "./search-bar";
import { Button } from "./ui/button";

export function Navbar() {
  const { user } = useUser();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              RecordStashd
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
            <Link
              href="https://github.com/phileasmah/album-review-app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gray-800"
            >
              <SiGithub className="h-6 w-6" />
            </Link>
            <SearchBar />
            <SignedIn>
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="View profile"
                    labelIcon={<UserIcon className="h-4 w-4" />}
                    href={`/${user?.username}`}
                  />
                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button variant="outline">
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
