import FollowingActivitySmall from "@/components/followingActivity/following-activity-small";
import { NewReleases } from "@/components/home/new-releases/NewReleases";
import { NewReleasesLoadingSkeleton } from "@/components/home/new-releases/NewReleasesLoadingSkeleton";
import { RecentReviews } from "@/components/home/RecentReviews";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="container mx-auto px-4 py-8">
      {userId && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">
            Activity from people you follow
          </h2>
          <FollowingActivitySmall />
        </section>
      )}

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">New Releases</h2>
        <Suspense fallback={<NewReleasesLoadingSkeleton />}>
          <NewReleases />
        </Suspense>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Recent Reviews</h2>
        <RecentReviews />
      </section>
    </div>
  );
}
