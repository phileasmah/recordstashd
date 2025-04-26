import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

test("creating and retrieving a review", async () => {
  const t = convexTest(schema, modules);
  const testUser = t.withIdentity({ name: "Test User", subject: "test-user-id" });

  // Create a review
  await testUser.mutation(api.reviews.upsertReview, {
    albumName: "Test Album",
    artistName: "Test Artist",
    rating: 4,
    review: "Great album!"
  });

  // Get the user's review
  const retrievedReview = await testUser.query(api.reviews.getUserReview, {
    albumName: "Test Album",
    artistName: "Test Artist"
  });

  expect(retrievedReview).not.toBeNull();
  expect(retrievedReview!.rating).toBe(4);
  expect(retrievedReview!.review).toBe("Great album!");
});

test("updating an existing review", async () => {
  const t = convexTest(schema, modules);
  const testUser = t.withIdentity({ name: "Test User", subject: "test-user-id" });

  // Create initial review
  await testUser.mutation(api.reviews.upsertReview, {
    albumName: "Test Album",
    artistName: "Test Artist",
    rating: 3,
    review: "Good album"
  });

  // Update the review
  await testUser.mutation(api.reviews.upsertReview, {
    albumName: "Test Album",
    artistName: "Test Artist",
    rating: 5,
    review: "Amazing album!"
  });

  // Get the updated review
  const updatedReview = await testUser.query(api.reviews.getUserReview, {
    albumName: "Test Album",
    artistName: "Test Artist"
  });

  expect(updatedReview).not.toBeNull();
  expect(updatedReview!.rating).toBe(5);
  expect(updatedReview!.review).toBe("Amazing album!");
});

test("deleting a review", async () => {
  const t = convexTest(schema, modules);
  const testUser = t.withIdentity({ name: "Test User", subject: "test-user-id" });

  // Create a review
  await testUser.mutation(api.reviews.upsertReview, {
    albumName: "Test Album",
    artistName: "Test Artist",
    rating: 4,
    review: "Great album!"
  });

  // Delete the review
  await testUser.mutation(api.reviews.deleteReview, {
    albumName: "Test Album",
    artistName: "Test Artist"
  });

  // Verify review is deleted
  const retrievedReview = await testUser.query(api.reviews.getUserReview, {
    albumName: "Test Album",
    artistName: "Test Artist"
  });

  expect(retrievedReview).toBeNull();
});

test("getting recent reviews", async () => {
  const t = convexTest(schema, modules);
  const user1 = t.withIdentity({ name: "User 1", subject: "user-1-id" });
  const user2 = t.withIdentity({ name: "User 2", subject: "user-2-id" });

  // Create reviews from different users
  await user1.mutation(api.reviews.upsertReview, {
    albumName: "Test Album",
    artistName: "Test Artist",
    rating: 4,
    review: "Great!"
  });

  await user2.mutation(api.reviews.upsertReview, {
    albumName: "Test Album",
    artistName: "Test Artist",
    rating: 2,
    review: "Not my taste"
  });

  // Get recent reviews
  const recentReviews = await t.query(api.reviews.getRecentReviewsForAlbum, {
    albumName: "Test Album",
    artistName: "Test Artist",
    limit: 2
  });

  expect(recentReviews).toHaveLength(2);
  expect(recentReviews).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        review: "Great!",
        rating: 4
      }),
      expect.objectContaining({
        review: "Not my taste",
        rating: 2
      })
    ])
  );
});

test("creating review requires authentication", async () => {
  const t = convexTest(schema, modules);
  
  // Attempt to create review without authentication
  await expect(
    t.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      rating: 4,
      review: "Great album!"
    })
  ).rejects.toThrow("Not authenticated");
});

test("creating review requires at least rating or review", async () => {
  const t = convexTest(schema, modules);
  const testUser = t.withIdentity({ name: "Test User", subject: "test-user-id" });

  // Attempt to create review without rating or review
  await expect(
    testUser.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist"
    })
  ).rejects.toThrow("At least one of rating or review must be provided when creating a new review");
});

describe("upsertReview edge cases", () => {
  test("creating review with only rating", async () => {
    const t = convexTest(schema, modules);
    const testUser = t.withIdentity({ name: "Test User", subject: "test-user-id" });

    await testUser.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      rating: 4
    });

    const review = await testUser.query(api.reviews.getUserReview, {
      albumName: "Test Album",
      artistName: "Test Artist"
    });

    expect(review).not.toBeNull();
    expect(review!.rating).toBe(4);
    expect(review!.review).toBeUndefined();
  });

  test("creating review with only text review", async () => {
    const t = convexTest(schema, modules);
    const testUser = t.withIdentity({ name: "Test User", subject: "test-user-id" });

    await testUser.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      review: "Great album!"
    });

    const review = await testUser.query(api.reviews.getUserReview, {
      albumName: "Test Album",
      artistName: "Test Artist"
    });

    expect(review).not.toBeNull();
    expect(review!.rating).toBeUndefined();
    expect(review!.review).toBe("Great album!");
  });

  test("updating only rating preserves existing review text", async () => {
    const t = convexTest(schema, modules);
    const testUser = t.withIdentity({ name: "Test User", subject: "test-user-id" });

    // Create initial review with both rating and review
    await testUser.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      rating: 4,
      review: "Good album"
    });

    // Update only the rating
    await testUser.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      rating: 5
    });

    const review = await testUser.query(api.reviews.getUserReview, {
      albumName: "Test Album",
      artistName: "Test Artist"
    });

    expect(review).not.toBeNull();
    expect(review!.rating).toBe(5);
    expect(review!.review).toBe("Good album");  // Review text should be preserved
  });

  test("updating only review text preserves existing rating", async () => {
    const t = convexTest(schema, modules);
    const testUser = t.withIdentity({ name: "Test User", subject: "test-user-id" });

    // Create initial review with both rating and review
    await testUser.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      rating: 4,
      review: "Initial review"
    });

    // Update only the review text
    await testUser.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      review: "Updated review"
    });

    const review = await testUser.query(api.reviews.getUserReview, {
      albumName: "Test Album",
      artistName: "Test Artist"
    });

    expect(review).not.toBeNull();
    expect(review!.rating).toBe(4);  // Rating should be preserved
    expect(review!.review).toBe("Updated review");
  });

  test("empty review text removes review field but preserves rating", async () => {
    const t = convexTest(schema, modules);
    const testUser = t.withIdentity({ name: "Test User", subject: "test-user-id" });

    // Create initial review
    await testUser.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      rating: 4,
      review: "Initial review"
    });

    // Update with empty review text
    await testUser.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      rating: 4,
      review: "   "  // Just whitespace
    });

    const review = await testUser.query(api.reviews.getUserReview, {
      albumName: "Test Album",
      artistName: "Test Artist"
    });

    expect(review).not.toBeNull();
    expect(review!.rating).toBe(4);  // Rating should be preserved
    expect(review!.review).toBeUndefined();  // Review should be removed
  });

  test("review text should be trimmed", async () => {
    const t = convexTest(schema, modules);
    const testUser = t.withIdentity({ name: "Test User", subject: "test-user-id" });

    await testUser.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      review: "  Great album!  \n  "
    });

    const review = await testUser.query(api.reviews.getUserReview, {
      albumName: "Test Album",
      artistName: "Test Artist"
    });

    expect(review).not.toBeNull();
    expect(review!.review).toBe("Great album!");
  });

  test("multiple users can review the same album", async () => {
    const t = convexTest(schema, modules);
    const user1 = t.withIdentity({ name: "User 1", subject: "user-1-id" });
    const user2 = t.withIdentity({ name: "User 2", subject: "user-2-id" });

    // First user's review
    await user1.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      rating: 4,
      review: "Great!"
    });

    // Second user's review
    await user2.mutation(api.reviews.upsertReview, {
      albumName: "Test Album",
      artistName: "Test Artist",
      rating: 2,
      review: "Not my taste"
    });

    // Check first user's review
    const review1 = await user1.query(api.reviews.getUserReview, {
      albumName: "Test Album",
      artistName: "Test Artist"
    });

    // Check second user's review
    const review2 = await user2.query(api.reviews.getUserReview, {
      albumName: "Test Album",
      artistName: "Test Artist"
    });

    expect(review1).not.toBeNull();
    expect(review2).not.toBeNull();
    expect(review1!.rating).toBe(4);
    expect(review1!.review).toBe("Great!");
    expect(review2!.rating).toBe(2);
    expect(review2!.review).toBe("Not my taste");
  });

  test("same album name but different artists should be treated as different albums", async () => {
    const t = convexTest(schema, modules);
    const testUser = t.withIdentity({ name: "Test User", subject: "test-user-id" });

    // Review for first artist
    await testUser.mutation(api.reviews.upsertReview, {
      albumName: "Greatest Hits",
      artistName: "Artist 1",
      rating: 4,
      review: "Great compilation!"
    });

    // Review for second artist
    await testUser.mutation(api.reviews.upsertReview, {
      albumName: "Greatest Hits",
      artistName: "Artist 2",
      rating: 3,
      review: "Decent compilation"
    });

    // Check first review
    const review1 = await testUser.query(api.reviews.getUserReview, {
      albumName: "Greatest Hits",
      artistName: "Artist 1"
    });

    // Check second review
    const review2 = await testUser.query(api.reviews.getUserReview, {
      albumName: "Greatest Hits",
      artistName: "Artist 2"
    });

    expect(review1).not.toBeNull();
    expect(review2).not.toBeNull();
    expect(review1!.rating).toBe(4);
    expect(review1!.review).toBe("Great compilation!");
    expect(review2!.rating).toBe(3);
    expect(review2!.review).toBe("Decent compilation");
  });
}); 