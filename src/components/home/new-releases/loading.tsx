import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "../../ui/card";

export function Loading() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/5">
            <Card className="overflow-hidden pt-0">
              <Skeleton className="aspect-square w-full" />
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-24" />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
} 