import { Suspense } from "react";
import type { Metadata } from "next";
import ProfilePage from "@/src/components/pages/ProfilePage";
import ProfilePageSkeleton from "@/src/components/profile/ProfilePageSkeleton";
import { buildRentFlowCarNoIndexMetadata } from "@/src/lib/seo";
import {
  getInitialRentFlowCarTenantProfile,
  getRentFlowCarRequestHost,
} from "@/src/lib/server-tenant";

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRentFlowCarRequestHost();
  const tenant = await getInitialRentFlowCarTenantProfile(host);
  return buildRentFlowCarNoIndexMetadata({
    host,
    tenant,
    pathname: "/profile",
    title: "โปรไฟล์",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePage />
    </Suspense>
  );
}
