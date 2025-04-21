import { UserJSON } from "@clerk/nextjs/server";
import {
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { Triggers } from "convex-helpers/server/triggers";
import { v, Validator } from "convex/values";
import { internal } from "./_generated/api";
import { DataModel, Doc } from "./_generated/dataModel";
import {
  query,
  internalMutation as rawInternalMutation,
} from "./_generated/server";
import { followerCount, followingCount } from "./follows";
import {
  aggregateReviewsByAlbum,
  aggregateReviewsByUsers,
} from "./reviewAggregates";

const triggers = new Triggers<DataModel>();
//TODO batch this
triggers.register("users", async (ctx, change) => {
  if (change.operation === "delete") {
    const [allFollows, allFollowing, allReviews] = await Promise.all([
      ctx.db
        .query("follows")
        .withIndex("by_follower", (q) =>
          q.eq("followerId", change.oldDoc.externalId),
        )
        .collect(),
      ctx.db
        .query("follows")
        .withIndex("by_following", (q) =>
          q.eq("followingId", change.oldDoc.externalId),
        )
        .collect(),
      ctx.db
        .query("reviews")
        .withIndex("by_user", (q) => q.eq("userId", change.oldDoc.externalId))
        .collect(),
    ]);

    await Promise.all([
      ...allFollows.map((follow) => ctx.db.delete(follow._id)),
      ...allFollowing.map((follow) => ctx.db.delete(follow._id)),
      ...allReviews.map((review) => ctx.db.delete(review._id)),
    ]);

    await ctx.scheduler.runAfter(0, internal.users.deleteReviewAggregates, {
      reviews: allReviews,
    });

    await ctx.scheduler.runAfter(0, internal.users.deleteFollowAggregates, {
      followers: allFollows,
      following: allFollowing,
    });

    await ctx.scheduler.runAfter(0, internal.users.deleteReviewLikes, {
      userId: change.oldDoc.externalId,
    });
  }
});

const internalMutation = customMutation(
  rawInternalMutation,
  customCtx(triggers.wrapDB),
);

export const getUserDisplayName = (user: Doc<"users">) => {
  return user.firstName || user.lastName
    ? `${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""}`.trim()
    : user.username;
};

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      username: data.username ?? "",
      imageUrl: data.image_url,
      externalId: data.id,
      firstName: data.first_name ?? undefined,
      lastName: data.last_name ?? undefined,
    };

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", data.id))
      .unique();

    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", clerkUserId))
      .unique();

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

export const deleteReviewAggregates = rawInternalMutation({
  args: { reviews: v.array(v.any()) },
  async handler(ctx, args) {
    await Promise.all(
      args.reviews.map(async (review) => {
        await aggregateReviewsByAlbum.delete(ctx, review);
        await aggregateReviewsByUsers.delete(ctx, review);
      }),
    );
  },
});

export const deleteFollowAggregates = rawInternalMutation({
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

export const deleteReviewLikes = rawInternalMutation({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const allReviewLikes = await ctx.db
      .query("reviewLikes")
      .withIndex("by_user_review", (q) => q.eq("userId", args.userId))
      .collect();

    await Promise.all(
      allReviewLikes.map((reviewLike) => ctx.db.delete(reviewLike._id)),
    );
  },
});

export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) {
      return null;
    }

    return {
      ...user,
      userDisplayName: getUserDisplayName(user),
    };
  },
});
