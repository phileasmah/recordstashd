import { NewReleases } from "@/components/home/new-releases/NewReleases";
import { Loading } from "@/components/home/new-releases/loading";
import { RecentReviews } from "@/components/home/RecentReviews";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">New Releases</h2>
        <Suspense fallback={<Loading />}>
          <NewReleases />
        </Suspense>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recent Reviews</h2>
        <RecentReviews />
      </section>
    </div>
  );
}
