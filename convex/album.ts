import { v } from "convex/values";
import { query } from "./_generated/server";

export const getAlbumIdIfExists = query({
  args: {
    artistName: v.string(),
    albumName: v.string(),
  },
  handler: async (ctx, args) => {
    const album = await ctx.db
      .query("albums")
      .withIndex("by_name_artist", (q) =>
        q.eq("name", args.albumName).eq("artist", args.artistName),
      )
      .first();
    if (!album) {
      return null;
    }
    return album._id;
  },
});
