import { Suspense } from "react";
import type { Metadata } from "next";
import FeaturesPage from "@/src/components/pages/FeaturesPage";
import FeaturesPageSkeleton from "@/src/components/feature/FeaturesPageSkeleton";
import {
  getInitialRentFlowCarTenantProfile,
  getRentFlowCarRequestHost,
} from "@/src/lib/server-tenant";
import { buildRentFlowCarPageMetadata } from "@/src/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRentFlowCarRequestHost();
  const tenant = await getInitialRentFlowCarTenantProfile(host);

  return buildRentFlowCarPageMetadata({
    host,
    tenant,
    pathname: "/features",
    title: "ฟีเจอร์การจองรถเช่า",
    description:
      "ดูฟีเจอร์ของ RentFlowCar สำหรับค้นหารถ เช็กรถว่าง เลือกวันเวลา และจองรถเช่าออนไลน์",
  });
}

export default async function Page() {
  const host = await getRentFlowCarRequestHost();
  const initialTenantProfile = await getInitialRentFlowCarTenantProfile(host);

  return (
    <Suspense fallback={<FeaturesPageSkeleton />}>
      <FeaturesPage
        initialHost={host}
        initialTenantProfile={initialTenantProfile}
      />
    </Suspense>
  );
}
