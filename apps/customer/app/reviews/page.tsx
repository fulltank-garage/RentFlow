import type { Metadata } from "next";
import ReviewsPage from "@/src/components/pages/ReviewsPage";
import { buildRentFlowCarPageMetadata } from "@/src/lib/seo";
import { getRentFlowCarRequestHost } from "@/src/lib/server-tenant";

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRentFlowCarRequestHost();

  return buildRentFlowCarPageMetadata({
    host,
    pathname: "/reviews",
    title: "รีวิวจากผู้เช่ารถ",
    description:
      "อ่านรีวิวและประสบการณ์จากผู้ใช้ RentFlowCar ก่อนเลือกรถและร้านเช่ารถที่เหมาะกับคุณ",
  });
}

export default function Page() {
  return <ReviewsPage />;
}
