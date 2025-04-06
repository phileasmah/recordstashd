import { NewReleases } from "@/components/home/NewReleases";
import { RecentReviews } from "@/components/home/RecentReviews";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">New Releases</h2>
        <NewReleases />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recent Reviews</h2>
        <RecentReviews />
      </section>
    </div>
  );
}
