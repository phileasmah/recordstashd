import { mergedStream, stream } from "convex-helpers/server/stream";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { checkReviewLikedByUser } from "./reviewLikes";
import { findReviewByUserAndAlbum } from "./reviewsWrite";
import schema from "./schema";
import { getUserDisplayName } from "./users";

export const getUserReview = query({
  args: {
    albumId: v.union(v.id("albums"), v.null()),
  },
  async handler(ctx, args) {
    if (!args.albumId) {
      return null;
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // Find the album
    const album = await ctx.db.get(args.albumId);

    if (!album) {
      return null; // Album doesn't exist
    }

    // Get the user's review
    return await findReviewByUserAndAlbum(ctx, userId, album._id);
  },
});

export const getRecentReviewsForAlbum = query({
  args: {
    paginationOpts: paginationOptsValidator,
    albumId: v.union(v.id("albums"), v.null()),
  },
  async handler(ctx, args) {
    if (!args.albumId) {
      return {
        page: [],
        isDone: true,
        continueCursor: "null",
      };
    }
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    // Find the album
    const album = await ctx.db.get(args.albumId);

    if (!album) {
      throw new ConvexError("Album not found");
    }

    // Get recent reviews that have review text
    const paginatedReviews = await ctx.db
      .query("reviews")
      .withIndex("by_album_hasReview", (q) =>
        q.eq("albumId", album._id).eq("hasReview", true),
      )
      .order("desc")
      .paginate(args.paginationOpts);

    // Get user details for each review
    const reviewsWithUserInfo = await Promise.all(
      paginatedReviews.page.map(async (review) => {
        const [user, likedByUser] = await Promise.all([
          ctx.db
            .query("users")
            .withIndex("by_externalId", (q) =>
              q.eq("externalId", review.userId),
            )
            .unique(),
          checkReviewLikedByUser(ctx, userId, review._id),
        ]);

        return {
          ...review,
          username: user?.username ?? null,
          userDisplayName: user ? getUserDisplayName(user) : "Anonymous User",
          userImageUrl: user?.imageUrl ?? null,
          likedByUser,
        };
      }),
    );

    return {
      ...paginatedReviews,
      page: reviewsWithUserInfo,
    };
  },
});

export const getAllUserReviews = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    const currentUserId = identity?.subject;

    const paginatedReviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const reviewsWithAlbumInfo = await Promise.all(
      paginatedReviews.page.map(async (review) => {
        const [album, likedByUser] = await Promise.all([
          ctx.db.get(review.albumId),
          checkReviewLikedByUser(ctx, currentUserId, review._id),
        ]);
        return {
          ...review,
          albumName: album?.name,
          artistName: album?.artist,
          spotifyAlbumUrl: album?.spotifyAlbumUrl,
          likedByUser,
        };
      }),
    );

    return {
      ...paginatedReviews,
      page: reviewsWithAlbumInfo,
    };
  },
});

export const getLatestPostsFromFollowing = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }
    const userId = identity.subject;

    const following = await stream(ctx.db, schema)
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", userId))
      .order("desc")
      // TODO: Find a way to remove limit 
      .take(1000);

    if (following.length === 0) {
      return {
        page: [],
        isDone: true,
        continueCursor: "null",
      };
    }

    const perUserReviewStreams = await Promise.all(
      following.map(async (follow) => {
        const followingUser = await ctx.db
          .query("users")
          .withIndex("by_externalId", (q) =>
            q.eq("externalId", follow.followingId),
          )
          .unique();

        return stream(ctx.db, schema)
          .query("reviews")
          .withIndex("by_user", (q) => q.eq("userId", follow.followingId))
          .order("desc")
          .map(async (review) => {
            const [album, likedByUser] = await Promise.all([
              ctx.db.get(review.albumId),
              checkReviewLikedByUser(ctx, userId, review._id),
            ]);
            return {
              ...review,
              username: followingUser?.username || "Anonymous User",
              userDisplayName: followingUser
                ? getUserDisplayName(followingUser)
                : "Anonymous User",
              userImageUrl: followingUser?.imageUrl ?? null,
              albumName: album?.name,
              artistName: album?.artist,
              spotifyAlbumUrl: album?.spotifyAlbumUrl,
              likedByUser,
            };
          });
      }),
    );

    const merged = mergedStream(perUserReviewStreams, ["lastUpdatedTime"]);
    return merged.paginate(args.paginationOpts);
  },
});

export const getMostLikedReviewThisWeek = query({
  args: {
    oneWeekAgo: v.number(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_hasReview_likes", (q) => q.eq("hasReview", true))
      .order("desc")
      .filter((q) => q.gte(q.field("_creationTime"), args.oneWeekAgo))
      .paginate(args.paginationOpts);

    const reviewsWithMetadata = await Promise.all(
      reviews.page.map(async (review) => {
        const [user, likedByUser, album] = await Promise.all([
          ctx.db
            .query("users")
            .withIndex("by_externalId", (q) =>
              q.eq("externalId", review.userId),
            )
            .unique(),
          checkReviewLikedByUser(ctx, userId, review._id),
          ctx.db.get(review.albumId),
        ]);

        return {
          ...review,
          username: user?.username ?? null,
          userDisplayName: user ? getUserDisplayName(user) : "Anonymous User",
          userImageUrl: user?.imageUrl ?? null,
          albumName: album?.name,
          artistName: album?.artist,
          spotifyAlbumUrl: album?.spotifyAlbumUrl,
          likedByUser,
        };
      }),
    );

    return {
      ...reviews,
      page: reviewsWithMetadata,
    };
  },
});

export const getMostLikedReviewsForAlbum = query({
  args: {
    paginationOpts: paginationOptsValidator,
    albumId: v.union(v.id("albums"), v.null()),
  },
  async handler(ctx, args) {
    if (!args.albumId) {
      return {
        page: [],
        isDone: true,
        continueCursor: "null",
      };
    }

    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;

    const paginatedReviews = await ctx.db
      .query("reviews")
      .withIndex("by_album_hasReview_likes", (q) =>
        q.eq("albumId", args.albumId!).eq("hasReview", true),
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const reviewsWithMetadata = await Promise.all(
      paginatedReviews.page.map(async (review) => {
        const [user, likedByUser] = await Promise.all([
          ctx.db
            .query("users")
            .withIndex("by_externalId", (q) =>
              q.eq("externalId", review.userId),
            )
            .unique(),
          checkReviewLikedByUser(ctx, userId, review._id),
        ]);

        return {
          ...review,
          username: user?.username ?? null,
          userDisplayName: user ? getUserDisplayName(user) : "Anonymous User",
          userImageUrl: user?.imageUrl ?? null,
          likedByUser,
        };
      }),
    );

    return {
      ...paginatedReviews,
      page: reviewsWithMetadata,
    };
  },
});
