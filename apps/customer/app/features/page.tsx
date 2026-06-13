import { Suspense } from "react";
import FeaturesPage from "@/src/components/pages/FeaturesPage";
import FeaturesPageSkeleton from "@/src/components/feature/FeaturesPageSkeleton";
import {
  getInitialRentFlowTenantProfile,
  getRentFlowRequestHost,
} from "@/src/lib/server-tenant";

export default async function Page() {
  const host = await getRentFlowRequestHost();
  const initialTenantProfile = await getInitialRentFlowTenantProfile(host);

  return (
    <Suspense fallback={<FeaturesPageSkeleton />}>
      <FeaturesPage
        initialHost={host}
        initialTenantProfile={initialTenantProfile}
      />
    </Suspense>
  );
}
