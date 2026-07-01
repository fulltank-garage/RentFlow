import { Suspense } from "react";
import type { Metadata } from "next";
import MyBookingDetailPage from "@/src/components/pages/MyBookingDetailPage";
import MyBookingDetailPageSkeleton from "@/src/components/my-bookings/detail/MyBookingDetailPageSkeleton";
import { buildRentFlowCarNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata =
  buildRentFlowCarNoIndexMetadata("รายละเอียดการจอง");

export default function Page() {
  return (
    <Suspense fallback={<MyBookingDetailPageSkeleton />}>
      <MyBookingDetailPage />
    </Suspense>
  );
}
