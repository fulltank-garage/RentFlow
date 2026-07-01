import { Suspense } from "react";
import type { Metadata } from "next";
import MyBookingsPage from "@/src/components/pages/MyBookingsPage";
import MyBookingsPageSkeleton from "@/src/components/my-bookings/MyBookingsPageSkeleton";
import { buildRentFlowCarNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata =
  buildRentFlowCarNoIndexMetadata("การจองของฉัน");

export default function Page() {
  return (
    <Suspense fallback={<MyBookingsPageSkeleton />}>
      <MyBookingsPage />
    </Suspense>
  );
}
