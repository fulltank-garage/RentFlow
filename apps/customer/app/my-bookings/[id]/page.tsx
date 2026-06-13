import { Suspense } from "react";
import MyBookingDetailPage from "@/src/components/pages/MyBookingDetailPage";
import MyBookingDetailPageSkeleton from "@/src/components/my-bookings/detail/MyBookingDetailPageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<MyBookingDetailPageSkeleton />}>
      <MyBookingDetailPage />
    </Suspense>
  );
}