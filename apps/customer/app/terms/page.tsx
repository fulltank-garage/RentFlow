import { Suspense } from "react";
import type { Metadata } from "next";
import TermsPage from "@/src/components/pages/TermsPage";
import TermsPageSkeleton from "@/src/components/terms/TermsPageSkeleton";
import { buildRentFlowCarPageMetadata } from "@/src/lib/seo";
import {
  getInitialRentFlowCarTenantProfile,
  getRentFlowCarRequestHost,
} from "@/src/lib/server-tenant";

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRentFlowCarRequestHost();
  const tenant = await getInitialRentFlowCarTenantProfile(host);

  return buildRentFlowCarPageMetadata({
    host,
    tenant,
    pathname: "/terms",
    title: "ข้อกำหนดการใช้งาน",
    description:
      "ข้อกำหนดและเงื่อนไขการใช้งาน RentFlowCar สำหรับการค้นหาและจองรถเช่าออนไลน์",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<TermsPageSkeleton />}>
      <TermsPage />
    </Suspense>
  );
}
