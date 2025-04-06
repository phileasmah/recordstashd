import { ActivityFeed } from "@/components/home/ActivityFeed";
import { FeaturedAlbums } from "@/components/home/FeaturedAlbums";
import { PopularAlbums } from "@/components/home/PopularAlbums";
import { RecentReviews } from "@/components/home/RecentReviews";
import { TrendingArtists } from "@/components/home/TrendingArtists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <FeaturedAlbums />

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-6">
          <RecentReviews />
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          <PopularAlbums />
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <TrendingArtists />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
}
