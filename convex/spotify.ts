import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getStoredToken = query({
  handler: async (ctx) => {
    const tokens = await ctx.db
      .query("spotifyToken")
      .order("desc")
      .take(1);

    if (tokens.length === 0) {
      return null;
    }

    const token = tokens[0];
    if (Date.now() >= token.expiresAt) {
      return null;
    }

    return token;
  },
});

export const storeToken = mutation({
  args: {
    accessToken: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Clear any existing tokens
    const existingTokens = await ctx.db
      .query("spotifyToken")
      .collect();
    
    for (const token of existingTokens) {
      await ctx.db.delete(token._id);
    }

    // Store the new token
    await ctx.db.insert("spotifyToken", {
      accessToken: args.accessToken,
      expiresAt: args.expiresAt,
    });
  },
}); 