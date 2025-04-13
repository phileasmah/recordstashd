import { ShineBorder } from "@/components/magicui/shine-border";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="relative mx-auto mt-40 max-w-[460px] border-zinc-800 bg-zinc-950 p-8">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-[200px] w-full" />
      </div>
    </Card>
  );
}
