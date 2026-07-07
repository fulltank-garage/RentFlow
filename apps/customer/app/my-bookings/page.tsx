import { Suspense } from "react";
import type { Metadata } from "next";
import MyBookingsPage from "@/src/components/pages/MyBookingsPage";
import MyBookingsPageSkeleton from "@/src/components/my-bookings/MyBookingsPageSkeleton";
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
    pathname: "/my-bookings",
    title: "การจองของฉัน",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<MyBookingsPageSkeleton />}>
      <MyBookingsPage />
    </Suspense>
  );
}
