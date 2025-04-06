import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  spotifyToken: defineTable({
    accessToken: v.string(),
    expiresAt: v.number(),
  }),
}); 