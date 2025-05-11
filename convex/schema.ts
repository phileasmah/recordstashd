import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  spotifyToken: defineTable({
    accessToken: v.string(),
    expiresAt: v.number(),
  }),

  albums: defineTable({
    name: v.string(),
    artist: v.string(),
    spotifyAlbumUrl: v.optional(v.string()),
  }).index("by_name_artist", ["name", "artist"]),

  reviews: defineTable({
    albumId: v.id("albums"),
    userId: v.string(), 
    rating: v.optional(v.number()), 
    review: v.optional(v.string()),
    hasReview: v.boolean(),
    lastUpdatedTime: v.number(), 
    likes: v.number(),
  })
    .index("by_user_album", ["userId", "albumId"])
    .index("by_user", ["userId", "lastUpdatedTime"])
    .index("by_album_hasReview", ["albumId", "hasReview"])
    .index("by_hasReview_likes", ["hasReview", "likes"])
    .index("by_album_hasReview_likes", ["albumId", "hasReview", "likes"]),

  users: defineTable({
    username: v.string(),
    imageUrl: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_username", ["username"]),

  follows: defineTable({
    followerId: v.string(),
    followingId: v.string(),
  })
    .index("by_follower_following", ["followerId", "followingId"])
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"]),

  reviewLikes: defineTable({
    userId: v.string(),
    reviewId: v.id("reviews"),
  })
    .index("by_user_review", ["userId", "reviewId"])
    .index("by_review", ["reviewId"]),
});
