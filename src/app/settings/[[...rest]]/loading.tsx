import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="mx-auto w-full max-w-[800px] p-8">
      <Skeleton className="h-[700px] w-full rounded-xl" />
    </div>
  );
}
