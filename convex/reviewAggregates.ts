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
  sortKey: (doc) => doc.rating ?? 0,
  sumValue: (doc) => doc.rating ?? 0,
});

export const aggregateReviewsByUsers = new TableAggregate<{
  Namespace: string;
  Key: number;
  DataModel: DataModel;
  TableName: "reviews";
}>(components.aggregateReviewsByUsers, {
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
        lower: { key: 0.1, inclusive: true },
      },
    };
    const count = await aggregateReviewsByAlbum.count(ctx, bounds);
    const sum = await aggregateReviewsByAlbum.sum(ctx, bounds);

    // Calculate and return the average
    if (count === 0) return null;
    return { average: sum / count, count };
  },
});

export const getUserStats = query({
  args: {
    userId: v.string(),
  },
  async handler(ctx, args) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayTimestamp = firstDayOfMonth.getTime();

    // Get first day of next month (upper bound)
    const firstDayOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
    );
    const nextMonthTimestamp = firstDayOfNextMonth.getTime();

    const [count, thisMonthCount] = await Promise.all([
      aggregateReviewsByUsers.count(ctx, {
        namespace: args.userId,
        bounds: {},
      }),
      aggregateReviewsByUsers.count(ctx, {
        namespace: args.userId,
        bounds: {
          lower: { key: firstDayTimestamp, inclusive: true },
          upper: { key: nextMonthTimestamp, inclusive: false },
        },
      }),
    ]);

    return { totalReviews: count, thisMonthReviews: thisMonthCount };
  },
});
