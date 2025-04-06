import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getNewReleases } from "@/lib/apiRequests";
import { NewRelease } from "./NewRelease";

export async function NewReleases() {
  const data = await getNewReleases({ limit: 6 });
  const albums = data.albums.items;

  if (!albums || albums.length === 0) {
    return <p className="text-center text-muted-foreground">No new releases found.</p>;
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {albums.map((album) => (
          <NewRelease key={album.id} album={album} />
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

