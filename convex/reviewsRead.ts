import { stream } from "convex-helpers/server/stream";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { checkReviewLikedByUser, reviewLikeCount } from "./reviewLikes";
import { findReviewByUserAndAlbum } from "./reviewsWrite";
import schema from "./schema";

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
        q.eq("name", args.albumName).eq("artist", args.artistName),
      )
      .first();

    if (!album) {
      return null; // Album doesn't exist
    }

    // Get the user's review
    return await findReviewByUserAndAlbum(ctx, userId, album._id);
  },
});

// TODO: Make this take an albumId instead of albumName and artistName
// Get recent reviews for an album
export const getRecentReviews = query({
  args: {
    albumName: v.string(),
    artistName: v.string(),
    limit: v.number(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    // Find the album
    const album = await ctx.db
      .query("albums")
      .withIndex("by_name_artist", (q) =>
        q.eq("name", args.albumName).eq("artist", args.artistName),
      )
      .first();

    if (!album) {
      return []; // Album doesn't exist
    }

    // Get recent reviews that have review text
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_album_hasReview", (q) =>
        q.eq("albumId", album._id).eq("hasReview", true),
      )
      .order("desc")
      .take(args.limit);

    // Get user details for each review
    const reviewsWithUserInfo = await Promise.all(
      reviews.map(async (review) => {
        const [user, likeCount, likedByUser] = await Promise.all([
          ctx.db
            .query("users")
            .withIndex("by_externalId", (q) =>
              q.eq("externalId", review.userId),
            )
            .unique(),
          reviewLikeCount.count(ctx, {
            namespace: review._id,
            bounds: {},
          }),
          checkReviewLikedByUser(ctx, userId, review._id),
        ]);

        if (!user) {
          return {
            ...review,
            username: "Anonymous User",
            userDisplayName: null,
            userImageUrl: null,
            likeCount,
            likedByUser,
          };
        }

        return {
          ...review,
          username: user.username || "Anonymous User",
          userDisplayName:
            `${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""}`.trim(),
          userImageUrl: user.imageUrl,
          likeCount,
          likedByUser,
        };
      }),
    );

    return reviewsWithUserInfo;
  },
});

export const getAllUserReviews = query({
  args: {
    userId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    const currentUserId = identity?.subject;

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(10);

    const reviewsWithAlbumInfo = await Promise.all(
      reviews.map(async (review) => {
        const [album, likeCount, likedByUser] = await Promise.all([
          ctx.db.get(review.albumId),
          reviewLikeCount.count(ctx, {
            namespace: review._id,
            bounds: {},
          }),
          checkReviewLikedByUser(ctx, currentUserId, review._id),
        ]);
        return {
          ...review,
          albumName: album?.name,
          artistName: album?.artist,
          spotifyAlbumUrl: album?.spotifyAlbumUrl,
          likeCount,
          likedByUser,
        };
      }),
    );

    return reviewsWithAlbumInfo;
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

    const followingStream = stream(ctx.db, schema)
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", userId))
      .order("desc")  ;

    const followingUsersStream = followingStream.flatMap(
      async (followingUser) =>
        stream(ctx.db, schema)
          .query("users")
          .withIndex("by_externalId", (q) =>
            q.eq("externalId", followingUser.followingId),
          )
          .order("desc"),
      ["externalId"],
    );

    const reviewsStream = followingUsersStream.flatMap(
      async (followingUser) =>
        stream(ctx.db, schema)
          .query("reviews")
          .withIndex("by_user", (q) => q.eq("userId", followingUser.externalId))
          .order("desc")
          .map(async (review) => {
            const album = await ctx.db.get(review.albumId);
            return {
              ...review,
              username: followingUser.username || "Anonymous User",
              userDisplayName:
                `${followingUser.firstName ? followingUser.firstName : ""} ${followingUser.lastName ? followingUser.lastName : ""}`.trim(),
              userImageUrl: followingUser.imageUrl,
              albumName: album?.name,
              artistName: album?.artist,
              spotifyAlbumUrl: album?.spotifyAlbumUrl,
            };
          }),
      ["userId", "lastUpdatedTime"],
    );

    return reviewsStream.paginate(args.paginationOpts);
  },
});
