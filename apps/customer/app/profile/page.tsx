import { Suspense } from "react";
import type { Metadata } from "next";
import ProfilePage from "@/src/components/pages/ProfilePage";
import ProfilePageSkeleton from "@/src/components/profile/ProfilePageSkeleton";
import { buildRentFlowCarNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildRentFlowCarNoIndexMetadata("โปรไฟล์");

export default function Page() {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePage />
    </Suspense>
  );
}
