import HomePage from "@/src/main/HomePage";
import {
  getInitialRentFlowCarTenantProfile,
  getRentFlowCarRequestHost,
} from "@/src/lib/server-tenant";

export default async function Home() {
  const host = await getRentFlowCarRequestHost();
  const initialTenantProfile = await getInitialRentFlowCarTenantProfile(host);

  return (
    <HomePage
      initialHost={host}
      initialTenantProfile={initialTenantProfile}
    />
  );
}
