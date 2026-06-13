import { Suspense } from "react";
import PaymentPage from "@/src/components/pages/PaymentPage";
import PaymentPageSkeleton from "@/src/components/payment/PaymentPageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<PaymentPageSkeleton />}>
      <PaymentPage />
    </Suspense>
  );
}