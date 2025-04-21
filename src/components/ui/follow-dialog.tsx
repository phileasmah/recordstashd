import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UsePaginatedQueryReturnType } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

type FollowDialogProps = {
  type: "followers" | "following";
  count: number;
} & (
  | UsePaginatedQueryReturnType<typeof api.follows.getFollowers>
  | UsePaginatedQueryReturnType<typeof api.follows.getFollowing>
);

export function FollowDialog({
  type,
  count,
  results,
  status,
  isLoading,
  loadMore,
}: FollowDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // const { results, status, isLoading, loadMore } = usePaginatedQuery(
  //   api.follows.getFollowers,
  //   { userId },
  //   { initialNumItems: 10 },
  // );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col gap-1.5 text-center hover:opacity-80">
          <span className="text-accent-foreground text-3xl font-bold tracking-tighter whitespace-pre-wrap">
            {count}
          </span>
          <p className="text-muted-foreground text-sm">
            {type === "followers" ? "Followers" : "Following"}
          </p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {type === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {results.map((follow) => (
            <div
              key={follow._id}
              className="flex items-center justify-between py-4"
            >
              <Link
                href={`/${follow.user.username}`}
                className="flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={follow.user.imageUrl} />
                  <AvatarFallback>
                    {follow.user.username?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {follow.userDisplayName}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    @{follow.user.username}
                  </span>
                </div>
              </Link>
              {/* <FollowButton
                followingId={
                  type === "followers" ? follow.followerId : follow.followingId
                }
              /> */}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
