import { Suspense } from "react";
import MyBookingsPage from "@/src/components/pages/MyBookingsPage";
import MyBookingsPageSkeleton from "@/src/components/my-bookings/MyBookingsPageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<MyBookingsPageSkeleton />}>
      <MyBookingsPage />
    </Suspense>
  );
}
