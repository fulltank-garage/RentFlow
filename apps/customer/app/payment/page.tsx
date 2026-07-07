import { Suspense } from "react";
import type { Metadata } from "next";
import PaymentPage from "@/src/components/pages/PaymentPage";
import PaymentPageSkeleton from "@/src/components/payment/PaymentPageSkeleton";
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
    pathname: "/payment",
    title: "ชำระเงิน",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<PaymentPageSkeleton />}>
      <PaymentPage />
    </Suspense>
  );
}
