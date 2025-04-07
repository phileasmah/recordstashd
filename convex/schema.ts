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
    rating: v.number(), // e.g., 1-5 stars
    review: v.optional(v.string()),
    createdAt: v.number(), // timestamp for sorting by recency
  })
    .index("by_album", ["albumId", "createdAt"])
    .index("by_user_album", ["userId", "albumId"])
    .index("by_user", ["userId", "createdAt"]),
}); 