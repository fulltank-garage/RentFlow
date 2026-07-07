import { Suspense } from "react";
import type { Metadata } from "next";
import BookingPage from "@/src/components/pages/BookingPage";
import BookingPageSkeleton from "@/src/components/booking/BookingPageSkeleton";
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
    pathname: "/booking",
    title: "จองรถ",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<BookingPageSkeleton />}>
      <BookingPage />
    </Suspense>
  );
}
