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
import { Loader2, Users } from "lucide-react";
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
  status,
  results,
  loadMore,
  isLoading,
}: FollowDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (status !== "CanLoadMore" || isLoading) return;
    const target = event.target as HTMLDivElement;
    const scrollPosition = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    const scrollPercentage =
      (scrollPosition / (scrollHeight - clientHeight)) * 100;

    if (status === "CanLoadMore" && scrollPercentage >= 75) {
      loadMore(10);
    }
  };

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
      <DialogContent className="px-1 pb-1 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">
            {type === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>
        {results.length === 0 ? (
          <div className="text-muted-foreground -mt-4 flex min-h-[400px] flex-col items-center justify-center gap-4">
            <Users className="h-12 w-12" />
            <p className="text-sm">
              No {type === "followers" ? "followers" : "following"} yet
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[350px]" onScrollCapture={handleScroll}>
            <div className="mx-4 mb-4">
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
              {status === "LoadingMore" && (
                <div className="mt-3 mb-6 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
