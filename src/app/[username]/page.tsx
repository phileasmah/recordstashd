import { currentUser } from "@clerk/nextjs/server";
import NotFound from "../not-found";
import ProfilePageContent from "./profile-content";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserPage({ params }: ProfilePageProps) {
  const { username } = await params;
  const currentUserDetails = await currentUser();
  const userProfile = await fetchQuery(api.users.getUserByUsername, {
    username: username,
  });
  const isOwnProfile = username === currentUserDetails?.username;

  if (!userProfile) {
    return <NotFound />;
  }

  return (
    <ProfilePageContent
      userProfile={userProfile}
      isOwnProfile={isOwnProfile}
      isSignedIn={!!currentUserDetails}
    />
  );
}
