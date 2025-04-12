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
  }).index("by_name_artist", ["name", "artist"]),

  reviews: defineTable({
    albumId: v.id("albums"),
    userId: v.string(), // Clerk user ID
    rating: v.optional(v.number()), // e.g., 1-5 stars
    review: v.optional(v.string()),
    hasReview: v.boolean(),
    lastUpdatedTime: v.number(), // timestamp for sorting by recency
  })
    .index("by_album", ["albumId", "lastUpdatedTime"])
    .index("by_user_album", ["userId", "albumId"])
    .index("by_user", ["userId", "lastUpdatedTime"])
    .index("by_album_hasReview", ["albumId", "hasReview"]),

  users: defineTable({
    username: v.string(),
    imageUrl: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
});
