import { Suspense } from "react";
import FeaturesPage from "@/src/components/pages/FeaturesPage";
import FeaturesPageSkeleton from "@/src/components/feature/FeaturesPageSkeleton";
import {
  getInitialRentFlowCarTenantProfile,
  getRentFlowCarRequestHost,
} from "@/src/lib/server-tenant";

export default async function Page() {
  const host = await getRentFlowCarRequestHost();
  const initialTenantProfile = await getInitialRentFlowCarTenantProfile(host);

  return (
    <Suspense fallback={<FeaturesPageSkeleton />}>
      <FeaturesPage
        initialHost={host}
        initialTenantProfile={initialTenantProfile}
      />
    </Suspense>
  );
}
