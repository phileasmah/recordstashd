import { ShineBorder } from "@/components/magicui/shine-border";
import { Card } from "@/components/ui/card";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <Card className="mt-40 relative mx-auto max-w-[460px] border-zinc-800 bg-zinc-950 p-8">
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold text-white">GigReview</h1>
        <p className="text-center text-sm text-zinc-400">
          Sign in to start reviewing albums
        </p>
      </div>
      <div className="flex justify-center">
        <SignIn path="/sign-in" routing="path" />
      </div>
    </Card>
  );
}
