import { Suspense } from "react";
import type { Metadata } from "next";
import HelpPage from "@/src/components/pages/HelpPage";
import HelpPageSkeleton from "@/src/components/help/HelpPageSkeleton";
import { buildRentFlowCarPageMetadata } from "@/src/lib/seo";
import { getRentFlowCarRequestHost } from "@/src/lib/server-tenant";

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRentFlowCarRequestHost();

  return buildRentFlowCarPageMetadata({
    host,
    pathname: "/help",
    title: "ศูนย์ช่วยเหลือ",
    description:
      "คำแนะนำการค้นหา จอง และจัดการการเช่ารถผ่าน RentFlowCar สำหรับผู้เช่ารถ",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<HelpPageSkeleton />}>
      <HelpPage />
    </Suspense>
  );
}
