import { Suspense } from "react";
import BookingPage from "@/src/components/pages/BookingPage";
import BookingPageSkeleton from "@/src/components/booking/BookingPageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<BookingPageSkeleton />}>
      <BookingPage />
    </Suspense>
  );
}
