import HomePage from "@/src/main/HomePage";
import {
  getInitialRentFlowTenantProfile,
  getRentFlowRequestHost,
} from "@/src/lib/server-tenant";

export default async function Home() {
  const host = await getRentFlowRequestHost();
  const initialTenantProfile = await getInitialRentFlowTenantProfile(host);

  return (
    <HomePage
      initialHost={host}
      initialTenantProfile={initialTenantProfile}
    />
  );
}
