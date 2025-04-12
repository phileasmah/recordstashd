import { TableAggregate } from "@convex-dev/aggregate";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { DataModel, Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

// Define an aggregate for review ratings grouped by album
export const aggregateReviewsByAlbum = new TableAggregate<{
  Namespace: Id<"albums">;
  Key: number;
  DataModel: DataModel;
  TableName: "reviews";
}>(components.aggregateReviewsByAlbum, {
  namespace: (doc) => doc.albumId,
  sortKey: (doc) => doc.lastUpdatedTime,
  sumValue: (doc) => doc.rating ?? 0,
});

export const aggregateReviewsByUsers = new TableAggregate<{
  Namespace: string;
  Key: number;
  DataModel: DataModel;
  TableName: "reviews";
}>(components.aggregateReviewsByAlbum, {
  namespace: (doc) => doc.userId,
  sortKey: (doc) => doc._creationTime ?? 0,
  sumValue: (doc) => doc.rating ?? 0,
});

// TODO: Make this take an albumId instead of albumName and artistName
// Get the average rating for a specific album
export const getAlbumAverageRating = query({
  args: {
    albumName: v.string(),
    artistName: v.string(),
  },
  async handler(ctx, args) {
    // First find the album
    const album = await ctx.db
      .query("albums")
      .withIndex("by_name_artist", (q) =>
        q.eq("name", args.albumName).eq("artist", args.artistName),
      )
      .first();

    if (!album) {
      return null; // Album doesn't exist
    }

    // Get the count of ratings and sum of ratings for this album
    const bounds = {
      namespace: album._id,
      bounds: {
        lower: { key: 0.1, inclusive: false },
      },
    };
    const count = await aggregateReviewsByAlbum.count(ctx, bounds);
    const sum = await aggregateReviewsByAlbum.sum(ctx, bounds);

    // Calculate and return the average
    if (count === 0) return null;
    return { average: sum / count, count };
  },
});

export const getUserReviewCount = query({
  args: {
    userId: v.string(),
  },
  async handler(ctx, args) {
    const bounds = {
      namespace: args.userId,
      bounds: {
        lower: { key: 0.1, inclusive: false },
      },
    };
    const count = await aggregateReviewsByUsers.count(ctx, bounds);
    return count;
  },
});