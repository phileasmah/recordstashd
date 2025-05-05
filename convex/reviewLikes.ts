// convex/likes.ts
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

export const likeReview = mutation({
  args: {
    reviewId: v.id("reviews"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    // Check if already liked
    const existing = await ctx.db
      .query("reviewLikes")
      .withIndex("by_user_review", (q) =>
        q.eq("userId", userId).eq("reviewId", args.reviewId),
      )
      .first();

    if (existing) return existing;

    // Create new like
    const [like, review] = await Promise.all([
      ctx.db.insert("reviewLikes", {
        userId,
        reviewId: args.reviewId,
      }),
      ctx.db.get(args.reviewId),
    ]);

    await ctx.db.patch(args.reviewId, {
      likes: review!.likes + 1,
    });

    return like;
  },
});

export const unlikeReview = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existing = await ctx.db
      .query("reviewLikes")
      .withIndex("by_user_review", (q) =>
        q.eq("userId", userId).eq("reviewId", args.reviewId),
      )
      .first();

    if (existing) {
      const review = await ctx.db.get(args.reviewId);
      await Promise.all([
        ctx.db.patch(args.reviewId, {
          likes: review!.likes - 1,
        }),
        ctx.db.delete(existing._id),
      ]);
      return true;
    }
    return false;
  },
});

export const reviewLikedByUser = query({
  args: { reviewId: v.id("reviews"), userId: v.string() },
  handler: async (ctx, args) => {
    return await checkReviewLikedByUser(ctx, args.userId, args.reviewId);
  },
});

export const checkReviewLikedByUser = async (
  ctx: QueryCtx,
  userId: string | undefined,
  reviewId: Id<"reviews">,
) => {
  if (!userId) return false;
  const like = await ctx.db
    .query("reviewLikes")
    .withIndex("by_user_review", (q) =>
      q.eq("userId", userId).eq("reviewId", reviewId),
    )
    .first();
  return !!like;
};

export const deleteAllReviewLikes = internalMutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const likesToDelete = await ctx.db
      .query("reviewLikes")
      .withIndex("by_review", (q) => q.eq("reviewId", args.reviewId))
      .collect();

    await Promise.all(likesToDelete.map((like) => ctx.db.delete(like._id)));
  },
});

export const deleteAllUserLikes = internalMutation({
  args: { userId: v.string() },
  async handler(ctx, args) {
    const allReviewLikes = await ctx.db
      .query("reviewLikes")
      .withIndex("by_user_review", (q) => q.eq("userId", args.userId))
      .collect();

    const allReviewsLiked = await Promise.all(
      allReviewLikes.map((reviewLike) => ctx.db.get(reviewLike.reviewId)),
    );

    await Promise.all(
      allReviewsLiked.map((review) => {
        if (review) {
          ctx.db.patch(review._id, {
            likes: review.likes - 1,
          });
        }
      }),
    );

    await ctx.scheduler.runAfter(
      0,
      internal.reviewLikes.removeAllUserLikeEntities,
      {
        allReviewLikes,
      },
    );
  },
});

export const removeAllUserLikeEntities = internalMutation({
  args: { allReviewLikes: v.array(v.any()) },
  handler: async (ctx, args) => {
    await Promise.all(
      args.allReviewLikes.map((reviewLike) => ctx.db.delete(reviewLike._id)),
    );
  },
});
