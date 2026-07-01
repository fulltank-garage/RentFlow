import { Suspense } from "react";
import type { Metadata } from "next";
import BookingPage from "@/src/components/pages/BookingPage";
import BookingPageSkeleton from "@/src/components/booking/BookingPageSkeleton";
import { buildRentFlowCarNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildRentFlowCarNoIndexMetadata("จองรถ");

export default function Page() {
  return (
    <Suspense fallback={<BookingPageSkeleton />}>
      <BookingPage />
    </Suspense>
  );
}
