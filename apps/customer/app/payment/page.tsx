import { Suspense } from "react";
import type { Metadata } from "next";
import PaymentPage from "@/src/components/pages/PaymentPage";
import PaymentPageSkeleton from "@/src/components/payment/PaymentPageSkeleton";
import { buildRentFlowCarNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildRentFlowCarNoIndexMetadata("ชำระเงิน");

export default function Page() {
  return (
    <Suspense fallback={<PaymentPageSkeleton />}>
      <PaymentPage />
    </Suspense>
  );
}
