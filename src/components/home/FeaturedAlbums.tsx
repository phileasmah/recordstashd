import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Image from "next/image";

export function FeaturedAlbums() {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold">Featured Albums</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {[1, 2, 3, 4, 5].map((index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
              <HoverCard openDelay={0} closeDelay={0}>
                <HoverCardTrigger>
                  <Card className="cursor-pointer pt-0 transition-colors duration-200 hover:bg-accent/20">
                    <div className="relative aspect-square w-full">
                      <Image
                        src="/cover.png"
                        alt={`Album ${index} cover`}
                        fill
                        className="object-contain rounded-t-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index === 0}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>Album Title {index}</CardTitle>
                      <CardDescription>Artist Name</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">4.5 ★</Badge>
                        <Badge variant="outline">2024</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Album Title {index}</h4>
                    <p className="text-sm">Artist Name</p>
                    <p className="text-sm text-muted-foreground">
                      Brief description of the album...
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
} 