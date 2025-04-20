import { UserProfile } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const UserProfilePage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <div className="mt-40 flex justify-center">
      <UserProfile />
    </div>
  );
};

export default UserProfilePage;
