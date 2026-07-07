import { Suspense } from "react";
import type { Metadata } from "next";
import Register from "@/src/auth/Register";
import RegisterCardSkeleton from "@/src/components/auth/RegisterCardSkeleton";
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
    pathname: "/register",
    title: "สมัครสมาชิก",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<RegisterCardSkeleton />}>
      <Register />
    </Suspense>
  );
}
