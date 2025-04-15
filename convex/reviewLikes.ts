// convex/likes.ts
import { TableAggregate } from "@convex-dev/aggregate";
import { customCtx, customMutation } from "convex-helpers/server/customFunctions";
import { Triggers } from "convex-helpers/server/triggers";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { DataModel, Id } from "./_generated/dataModel";
import { query, mutation as rawMutation } from "./_generated/server";

// Set up triggers to keep aggregates in sync
const triggers = new Triggers<DataModel>();

// Aggregate for counting likes per content item
export const reviewLikeCount = new TableAggregate<{
  Namespace: Id<"reviews">; 
  Key: null;
  DataModel: DataModel;
  TableName: "reviewLikes";
}>(components.reviewLikeCount, {
  namespace: (doc) => doc.reviewId,
  sortKey: () => null, // Just counting, no sorting needed
});


// Register triggers to update aggregates when likes table changes
triggers.register("reviewLikes", reviewLikeCount.trigger());

// Use custom mutation to ensure triggers run
const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));

// Like content
export const likeContent = mutation({
  args: { 
    reviewId: v.id('reviews'),
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
      .withIndex("by_user_review", q => 
        q.eq("userId", userId).eq("reviewId", args.reviewId)
      )
      .first();
    
    if (existing) return existing;
    
    // Create new like
    return await ctx.db.insert("reviewLikes", {
      userId,
      reviewId: args.reviewId,
    });
  },
});

// Unlike content
export const unlikeContent = mutation({
  args: { reviewId: v.id('reviews') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    
    const existing = await ctx.db
      .query("reviewLikes")
      .withIndex("by_user_review", q => 
        q.eq("userId", userId).eq("reviewId", args.reviewId)
      )
      .first();
    
    if (existing) {
      await ctx.db.delete(existing._id);
      return true;
    }
    return false;
  },
});

// Get like count for content
export const getContentLikeCount = query({
  args: { reviewId: v.id('reviews') },
  handler: async (ctx, args) => {
    return await reviewLikeCount.count(ctx, { 
      namespace: args.reviewId,
      bounds: {}
    });
  },
});

