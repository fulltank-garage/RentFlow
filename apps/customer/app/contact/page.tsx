import { Suspense } from "react";
import type { Metadata } from "next";
import ContactPage from "@/src/components/pages/ContactPage";
import ContactPageSkeleton from "@/src/components/contact/ContactPageSkeleton";
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
    pathname: "/contact",
    title: "ติดต่อ RentFlowCar",
    description:
      "ติดต่อ RentFlowCar หรือร้านเช่ารถที่คุณสนใจเพื่อสอบถามข้อมูลรถ การจอง และบริการเช่ารถ",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactPage />
    </Suspense>
  );
}
