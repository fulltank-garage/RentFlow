import { Suspense } from "react";
import type { Metadata } from "next";
import PrivacyPage from "@/src/components/pages/PrivacyPage";
import PrivacyPageSkeleton from "@/src/components/privacy/PrivacyPageSkeleton";
import { buildRentFlowCarPageMetadata } from "@/src/lib/seo";
import { getRentFlowCarRequestHost } from "@/src/lib/server-tenant";

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRentFlowCarRequestHost();

  return buildRentFlowCarPageMetadata({
    host,
    pathname: "/privacy",
    title: "นโยบายความเป็นส่วนตัว",
    description:
      "อ่านนโยบายความเป็นส่วนตัวของ RentFlowCar เกี่ยวกับการเก็บ ใช้ และดูแลข้อมูลในการจองรถเช่า",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<PrivacyPageSkeleton />}>
      <PrivacyPage />
    </Suspense>
  );
}
