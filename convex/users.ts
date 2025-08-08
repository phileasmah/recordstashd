import { UserJSON } from "@clerk/nextjs/server";
import {
    customCtx,
    customMutation,
} from "convex-helpers/server/customFunctions";
import { Triggers } from "convex-helpers/server/triggers";
import { v, Validator } from "convex/values";
import { internal } from "./_generated/api";
import { DataModel, Doc } from "./_generated/dataModel";
import { mutation, query, internalMutation as rawInternalMutation } from "./_generated/server";

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

    await ctx.scheduler.runAfter(0, internal.reviewAggregates.deleteReviewAggregates, {
      reviews: allReviews,
    });

    await ctx.scheduler.runAfter(0, internal.follows.deleteFollowAggregates, {
      followers: allFollows,
      following: allFollowing,
    });

    await ctx.scheduler.runAfter(0, internal.reviewLikes.deleteAllUserLikes, {
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
      // keep existing consent fields if present; webhook won't set them
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

export const recordLegalConsent = mutation({
  args: {
    termsVersion: v.string(),
    privacyPolicyVersion: v.string(),
    acceptedAt: v.number(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return;

    const needsUpdate =
      !user.termsAcceptedAt ||
      user.termsVersion !== args.termsVersion ||
      user.privacyPolicyVersion !== args.privacyPolicyVersion;

    if (needsUpdate) {
      await ctx.db.patch(user._id, {
        termsAcceptedAt: args.acceptedAt,
        termsVersion: args.termsVersion,
        privacyPolicyVersion: args.privacyPolicyVersion,
      });
    }
  },
});
