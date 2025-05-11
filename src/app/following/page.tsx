import FollowingActivityFull from "@/components/followingActivity/following-activity-full";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function FollowingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Following Activity</h1>
        <p className="text-muted-foreground mt-2">
          See what the people you follow are reviewing
        </p>
      </div>
      <FollowingActivityFull />
    </div>
  );
}
