"use client";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { UserMinus2, UserPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Button } from "./button";

interface FollowButtonProps {
  followingId: string;
  className?: string;
}

export function FollowButton({
  followingId,
  className,
}: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Get initial follow state
  const isFollowing = useQuery(api.follows.isFollowing, { followingId });
  const [followState, setFollowState] = useState(false);

  // Set initial state once query resolves
  useEffect(() => {
    if (isFollowing !== undefined) {
      setFollowState(isFollowing);
    }
  }, [isFollowing]);

  const followUser = useMutation(api.follows.followUser);
  const unfollowUser = useMutation(api.follows.unfollowUser);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (followState) {
        await unfollowUser({ userId: followingId });
      } else {
        await followUser({ userId: followingId });
      }
      setFollowState(!followState);
    } catch (error) {
      console.error("Failed to update follow state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={followState ? "outline" : "default"}
      size="sm"
      className={cn(
        "flex items-center gap-2",
        className
      )}
      onClick={handleClick}
      disabled={isLoading}
    >
      {followState ? (
        <>
          <UserMinus2 className="h-4 w-4" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus2 className="h-4 w-4" />
          <span>Follow</span>
        </>
      )}
    </Button>
  );
} 