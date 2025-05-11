import { SignInButton } from "@clerk/nextjs";
import { ShineBorder } from "../magicui/shine-border";
import { Button } from "../ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function SignedOutReview() {
  return (
    <>
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}/>
      <CardHeader>
        <CardTitle>Rate & Review</CardTitle>
        <CardDescription>
          Share your thoughts about this album
        </CardDescription>
      </CardHeader>
      <CardContent className="-mt-6 flex h-full min-h-32 flex-col items-center justify-center gap-3 space-y-4 text-center">
        <p className="text-muted-foreground my-0">
          Sign in to rate and review this album
        </p>
        <SignInButton>
          <Button variant="default">Sign In</Button>
        </SignInButton>
      </CardContent>
    </>
  );
} 