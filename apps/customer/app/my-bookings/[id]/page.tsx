import { Suspense } from "react";
import type { Metadata } from "next";
import MyBookingDetailPage from "@/src/components/pages/MyBookingDetailPage";
import MyBookingDetailPageSkeleton from "@/src/components/my-bookings/detail/MyBookingDetailPageSkeleton";
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
    title: "รายละเอียดการจอง",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<MyBookingDetailPageSkeleton />}>
      <MyBookingDetailPage />
    </Suspense>
  );
}
