// convex/follows.ts
import { TableAggregate } from "@convex-dev/aggregate";
import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { Triggers } from "convex-helpers/server/triggers";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { internalMutation, query, mutation as rawMutation } from "./_generated/server";
import { getUserDisplayName } from "./users";

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
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const followerId = identity.subject;
    if (followerId === args.userId)
      throw new Error("Cannot follow yourself");

    // Check if already following
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) =>
        q.eq("followerId", followerId).eq("followingId", args.userId),
      )
      .first();

    if (existing) return existing;

    // Create new follow relationship
    return await ctx.db.insert("follows", {
      followerId,
      followingId: args.userId,
    });
  },
});

// Unfollow a user
export const unfollowUser = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const followerId = identity.subject;

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) =>
        q.eq("followerId", followerId).eq("followingId", args.userId),
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

// Get all followers for a user
export const getFollowers = query({
  args: { paginationOpts: paginationOptsValidator, userId: v.string() },
  handler: async (ctx, args) => {
    const userId = args.userId;

    const followers = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const pagePromises = followers.page.map((follower) =>
      ctx.db
        .query("users")
        .withIndex("by_externalId", (q) =>
          q.eq("externalId", follower.followerId),
        )
        .first()
        .then((user) => {
          if (!user) {
            throw new ConvexError("User not found");
          }
          return {
            ...follower,
            user,
            userDisplayName: getUserDisplayName(user),
          };
        }),
    );

    const followersWithUserInfo = await Promise.all(pagePromises);

    return {
      ...followers,
      page: followersWithUserInfo,
    };
  },
});

// Get all following for a user
export const getFollowing = query({
  args: { paginationOpts: paginationOptsValidator, userId: v.string() },
  handler: async (ctx, args) => {
    const userId = args.userId;

    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const pagePromises = following.page.map((followingItem) =>
      ctx.db
        .query("users")
        .withIndex("by_externalId", (q) =>
          q.eq("externalId", followingItem.followingId),
        )
        .first()
        .then((user) => {
          if (!user) {
            throw new ConvexError("User not found");
          }
          return {
            ...followingItem,
            user,
            userDisplayName: getUserDisplayName(user),
          };
        }),
    );

    const followingWithUserInfo = await Promise.all(pagePromises);

    return {
      ...following,
      page: followingWithUserInfo,
    };
  },
});

export const deleteFollowAggregates = internalMutation({
  args: { followers: v.array(v.any()), following: v.array(v.any()) },
  async handler(ctx, args) {
    await Promise.all([
      ...args.followers.map((follower) => followerCount.delete(ctx, follower)),
      ...args.following.map((following) =>
        followingCount.delete(ctx, following),
      ),
    ]);
  },
});