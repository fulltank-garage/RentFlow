import { Suspense } from "react";
import type { Metadata } from "next";

import ShopsPage from "@/src/components/pages/ShopsPage";
import ShopsPageSkeleton from "@/src/components/shops/ShopsPageSkeleton";
import { buildRentFlowCarPageMetadata } from "@/src/lib/seo";
import { getRentFlowCarRequestHost } from "@/src/lib/server-tenant";

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRentFlowCarRequestHost();

  return buildRentFlowCarPageMetadata({
    host,
    pathname: "/shops",
    title: "ร้านเช่ารถ",
    description:
      "รวมร้านเช่ารถบน RentFlowCar เลือกร้าน ดูรถที่พร้อมให้บริการ และจองรถกับร้านที่เหมาะกับคุณ",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<ShopsPageSkeleton />}>
      <ShopsPage />
    </Suspense>
  );
}
