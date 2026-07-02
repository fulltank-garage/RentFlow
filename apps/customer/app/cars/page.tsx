import { Suspense } from "react";
import type { Metadata } from "next";
import CarsPage from "@/src/components/pages/CarsPage";
import CarsPageSkeleton from "@/src/components/cars/CarsPageSkeleton";
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
    pathname: "/cars",
    title: "รถเช่าทั้งหมด",
    description:
      "ค้นหา เปรียบเทียบ และจองรถเช่าหลากหลายประเภท ทั้งรถเล็ก Sedan SUV และ Van ผ่าน RentFlowCar",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<CarsPageSkeleton />}>
      <CarsPage />
    </Suspense>
  );
}
