import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Create or update a review for an album
export const upsertReview = mutation({
  args: {
    albumName: v.string(),
    artistName: v.string(),
    rating: v.number(),
    review: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // First, find or create the album
    const album = await ctx.db
      .query("albums")
      .withIndex("by_name_artist", (q) => 
        q.eq("name", args.albumName).eq("artist", args.artistName)
      )
      .first();

    let albumId: Id<"albums">;
    if (!album) {
      albumId = await ctx.db.insert("albums", {
        name: args.albumName,
        artist: args.artistName,
      });
    } else {
      albumId = album._id;
    }

    // Check if user already has a review for this album
    const existingReview = await ctx.db
      .query("reviews")
      .withIndex("by_user_album", (q) => 
        q.eq("userId", userId).eq("albumId", albumId)
      )
      .first();

    if (existingReview) {
      // Update existing review
      return await ctx.db.patch(existingReview._id, {
        rating: args.rating,
        review: args.review,
      });
    } else {
      // Create new review
      return await ctx.db.insert("reviews", {
        albumId,
        userId,
        rating: args.rating,
        review: args.review,
        createdAt: Date.now(),
      });
    }
  },
});

// Delete a review
export const deleteReview = mutation({
  args: {
    albumName: v.string(),
    artistName: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // Find the album
    const album = await ctx.db
      .query("albums")
      .withIndex("by_name_artist", (q) => 
        q.eq("name", args.albumName).eq("artist", args.artistName)
      )
      .first();

    if (!album) {
      return null; // Album doesn't exist, so no review to delete
    }

    // Find and delete the user's review
    const review = await ctx.db
      .query("reviews")
      .withIndex("by_user_album", (q) => 
        q.eq("userId", userId).eq("albumId", album._id)
      )
      .first();

    if (review) {
      await ctx.db.delete(review._id);
    }
    return review;
  },
});

// Get a user's review for a specific album
export const getUserReview = query({
  args: {
    albumName: v.string(),
    artistName: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // Find the album
    const album = await ctx.db
      .query("albums")
      .withIndex("by_name_artist", (q) => 
        q.eq("name", args.albumName).eq("artist", args.artistName)
      )
      .first();

    if (!album) {
      return null; // Album doesn't exist
    }

    // Get the user's review
    return await ctx.db
      .query("reviews")
      .withIndex("by_user_album", (q) => 
        q.eq("userId", userId).eq("albumId", album._id)
      )
      .first();
  },
});

// Get recent reviews for an album
export const getRecentReviews = query({
  args: {
    albumName: v.string(),
    artistName: v.string(),
    limit: v.number(),
  },
  async handler(ctx, args) {
    // Find the album
    const album = await ctx.db
      .query("albums")
      .withIndex("by_name_artist", (q) => 
        q.eq("name", args.albumName).eq("artist", args.artistName)
      )
      .first();

    if (!album) {
      return []; // Album doesn't exist
    }

    // Get recent reviews
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_album", (q) => q.eq("albumId", album._id))
      .order("desc")
      .take(args.limit);

    // Get user details for each review
    const reviewsWithUserInfo = await Promise.all(
      reviews.map(async (review) => {
        const user = await ctx.db
          .query("users")
          .withIndex("byExternalId", (q) => q.eq("externalId", review.userId))
          .unique();
        
        return {
          ...review,
          username: user?.username || 'Anonymous User',
          imageUrl: user?.imageUrl
        };
      })
    );

    return reviewsWithUserInfo;
  },
}); 