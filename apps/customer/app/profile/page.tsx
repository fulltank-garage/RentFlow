import { Suspense } from "react";
import ProfilePage from "@/src/components/pages/ProfilePage";
import ProfilePageSkeleton from "@/src/components/profile/ProfilePageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePage />
    </Suspense>
  );
}