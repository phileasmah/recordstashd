// convex/follows.ts
import { TableAggregate } from "@convex-dev/aggregate";
import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { Triggers } from "convex-helpers/server/triggers";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query, mutation as rawMutation } from "./_generated/server";

// Set up triggers to keep aggregates in sync
const triggers = new Triggers<DataModel>();

// Aggregate for counting followers (grouped by followeeId)
export const followerCount = new TableAggregate<{
  Namespace: string;
  Key: null;
  DataModel: DataModel;
  TableName: "follows";
}>(components.followerCount, {
  namespace: (doc) => doc.followingId,
  sortKey: () => null,
});

// Aggregate for counting following (grouped by followerId)
export const followingCount = new TableAggregate<{
  Namespace: string;
  Key: null;
  DataModel: DataModel;
  TableName: "follows";
}>(components.followingCount, {
  namespace: (doc) => doc.followerId,
  sortKey: () => null,
});

// Register triggers to update aggregates when follows table changes
triggers.register("follows", followerCount.trigger());
triggers.register("follows", followingCount.trigger());

// Use custom mutation to ensure triggers run
const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));

// Follow a user
export const followUser = mutation({
  args: { followingId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const followerId = identity.subject;
    if (followerId === args.followingId)
      throw new Error("Cannot follow yourself");

    // Check if already following
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) =>
        q.eq("followerId", followerId).eq("followingId", args.followingId),
      )
      .first();

    if (existing) return existing;

    // Create new follow relationship
    return await ctx.db.insert("follows", {
      followerId,
      followingId: args.followingId,
    });
  },
});

// Unfollow a user
export const unfollowUser = mutation({
  args: { followingId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const followerId = identity.subject;

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) =>
        q.eq("followerId", followerId).eq("followingId", args.followingId),
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return true;
    }
    return false;
  },
});

// Get follower count for a user
export const getFollowerCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await followerCount.count(ctx, {
      namespace: args.userId,
      bounds: {},
    });
  },
});

// Get following count for a user
export const getFollowingCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await followingCount.count(ctx, {
      namespace: args.userId,
      bounds: {},
    });
  },
});

// Check if current user is following a user
export const isFollowing = query({
  args: { followingId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }
    const followerId = identity.subject;

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) =>
        q.eq("followerId", followerId).eq("followingId", args.followingId),
      )
      .first();

    return !!existing;
  },
});
