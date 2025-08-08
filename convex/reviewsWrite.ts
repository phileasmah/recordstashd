import { SpotifySearchResults } from "@/types/spotify";
import { WithoutSystemFields } from "convex/server";
import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import {
    MutationCtx,
    QueryCtx,
    internalAction,
    internalMutation,
    mutation,
} from "./_generated/server";
import {
    aggregateReviewsByAlbum,
    aggregateReviewsByUsers,
} from "./reviewAggregates";

// Helper function to find or create an album
async function findOrCreateAlbum(
  ctx: MutationCtx,
  albumName: string,
  artistName: string,
) {
  const album = await ctx.db
    .query("albums")
    .withIndex("by_name_artist", (q) =>
      q.eq("name", albumName).eq("artist", artistName),
    )
    .first();

  if (!album) {
    await ctx.scheduler.runAfter(0, internal.reviewsWrite.getSpotifyImageUrlAndSave, {
      albumName,
      artistName,
    });
    const albumId = await ctx.db.insert("albums", {
      name: albumName,
      artist: artistName,
    });
    return albumId;
  }
  return album._id;
}

// Helper function to find a review by user and album
export async function findReviewByUserAndAlbum(
  ctx: QueryCtx,
  userId: string,
  albumId: Id<"albums">,
) {
  return await ctx.db
    .query("reviews")
    .withIndex("by_user_album", (q) =>
      q.eq("userId", userId).eq("albumId", albumId),
    )
    .first();
}

// Helper function to update review aggregates
async function updateReviewAggregates(
  ctx: MutationCtx,
  oldDoc: Doc<"reviews"> | null,
  newDoc: Doc<"reviews"> | null,
  operation: "insert" | "update" | "delete",
) {
  if (operation === "insert" && newDoc) {
    await aggregateReviewsByAlbum.insert(ctx, newDoc);
    await aggregateReviewsByUsers.insert(ctx, newDoc);
  } else if (operation === "update" && oldDoc && newDoc) {
    await aggregateReviewsByAlbum.replace(ctx, oldDoc, newDoc);
    await aggregateReviewsByUsers.replace(ctx, oldDoc, newDoc);
  } else if (operation === "delete" && oldDoc) {
    await aggregateReviewsByAlbum.delete(ctx, oldDoc);
    await aggregateReviewsByUsers.delete(ctx, oldDoc);
  }
}

// Create a new review for an album
export const createReviewAndReturnAlbumId = mutation({
  args: {
    albumId: v.union(v.id("albums"), v.null()),
    albumName: v.string(),
    artistName: v.string(),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    let albumId: Id<"albums">;
    if (!args.albumId) {
      albumId = await findOrCreateAlbum(ctx, args.albumName, args.artistName);
    } else {
      albumId = args.albumId;
    }

    // Check if user already has a review for this album
    const existingReview = await findReviewByUserAndAlbum(ctx, userId, albumId);

    if (existingReview) {
      throw new Error(
        "Review already exists for this album. Use updateReview to modify it.",
      );
    }

    // For new reviews, require at least one field (rating or review)
    if (args.rating === undefined && args.review === undefined) {
      throw new Error(
        "At least one of rating or review must be provided when creating a new review",
      );
    }

    // Create new review
    const newReview: WithoutSystemFields<Doc<"reviews">> = {
      albumId,
      userId,
      lastUpdatedTime: Date.now(),
      hasReview: args.review !== undefined,
      rating: args.rating,
      review: args.review?.trim(),
      likes: 0,
    };

    // Insert the review
    const insertedReview = await ctx.db.insert("reviews", newReview);

    // Update the aggregate
    const doc = await ctx.db.get(insertedReview);
    await updateReviewAggregates(ctx, null, doc!, "insert");
    return albumId  ;
  },
});

// Update an existing review
export const updateReview = mutation({
  args: {
    reviewId: v.id("reviews"),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // Get the existing review
    const existingReview = await ctx.db.get(args.reviewId);
    if (!existingReview) {
      throw new Error("Review not found");
    }

    // Verify the user owns this review
    if (existingReview.userId !== userId) {
      throw new Error("Not authorized to update this review");
    }

    // Prepare update fields
    const updateFields: Partial<WithoutSystemFields<Doc<"reviews">>> = {
      lastUpdatedTime: Date.now(),
      hasReview: existingReview.hasReview,
    };

    if (args.rating !== undefined) {
      updateFields.rating = args.rating;
    }

    if (args.review !== undefined) {
      updateFields.review = args.review.trim() || undefined;
      updateFields.hasReview = updateFields.review !== undefined;
    }

    // Update the review
    await ctx.db.patch(args.reviewId, updateFields);

    // Update the aggregate
    const newDoc = { ...existingReview, ...updateFields };
    await updateReviewAggregates(ctx, existingReview, newDoc, "update");
    return newDoc;
  },
});

// Delete a review
export const deleteReview = mutation({
  args: {
    reviewId: v.id("reviews"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // Find the review
    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    // Verify the user owns this review
    if (review.userId !== userId) {
      throw new Error("Not authorized to delete this review");
    }

    // Delete from the aggregate first
    await updateReviewAggregates(ctx, review, null, "delete");
    // Then delete from the database
    await ctx.db.delete(args.reviewId);

    await ctx.scheduler.runAfter(0, internal.reviewLikes.deleteAllReviewLikes, {
      reviewId: args.reviewId,
    });
  },
});

// Used by the admin to delete a review
export const deleteReviewInternal = internalMutation({
  args: {
    reviewId: v.id("reviews"),
  },
  async handler(ctx, args) {
    // Find the review
    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    // Delete from the aggregate first
    await updateReviewAggregates(ctx, review, null, "delete");
    // Then delete from the database
    await ctx.db.delete(args.reviewId);

    await ctx.scheduler.runAfter(0, internal.reviewLikes.deleteAllReviewLikes, {
      reviewId: args.reviewId,
    });
  },
});

export const getSpotifyImageUrlAndSave = internalAction({
  args: { albumName: v.string(), artistName: v.string() },
  handler: async (ctx, args) => {
    const spotifyToken = await ctx.runQuery(api.spotify.getStoredToken);
    const searchQuery = `album:${args.albumName} artist:${args.artistName}`;
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=album&limit=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${spotifyToken!.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const searchResults = (await response.json()) as SpotifySearchResults;
    if (!searchResults.albums?.items?.[0]) {
      throw new ConvexError("Image not found");
    }

    const album = searchResults.albums.items[0];
    await ctx.scheduler.runAfter(0, internal.reviewsWrite.saveSpotifyAlbumUrl, {
      albumName: args.albumName,
      artistName: args.artistName,
      spotifyAlbumUrl: album.images?.[0]?.url ?? "",
      spotifyAlbumId: album.id,
      spotifyExternalUrl: album.external_urls?.spotify ?? "",
    });
  },
});

export const saveSpotifyAlbumUrl = internalMutation({
  args: {
    albumName: v.string(),
    artistName: v.string(),
    spotifyAlbumUrl: v.string(),
    spotifyAlbumId: v.string(),
    spotifyExternalUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const album = await ctx.db
      .query("albums")
      .withIndex("by_name_artist", (q) =>
        q.eq("name", args.albumName).eq("artist", args.artistName),
      )
      .first();

    if (!album) {
      throw new ConvexError("Album not found");
    }

    await ctx.db.patch(album._id, {
      spotifyAlbumUrl: args.spotifyAlbumUrl,
      spotifyAlbumId: args.spotifyAlbumId,
      spotifyExternalUrl: args.spotifyExternalUrl,
    });
  },
});
