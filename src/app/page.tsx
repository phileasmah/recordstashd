import FollowingActivitySmall from "@/components/followingActivity/following-activity-small";
import { NewReleases } from "@/components/home/new-releases/NewReleases";
import { NewReleasesLoadingSkeleton } from "@/components/home/new-releases/NewReleasesLoadingSkeleton";
import { MostPopularThisWeek } from "@/components/most-popular-this-week/most-popular-this-week";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default async function Home() {
  const { userId } = await auth();
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  oneMonthAgo.setHours(0, 0, 0, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {userId && (
        <section className="mb-12">
          <FollowingActivitySmall />
        </section>
      )}

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">New Releases</h2>
        <Suspense fallback={<NewReleasesLoadingSkeleton />}>
          <NewReleases />
        </Suspense>
      </section>

      <section className="mb-12">
        <MostPopularThisWeek oneWeekAgo={oneMonthAgo} />
      </section>
    </div>
  );
}
