import type { Metadata } from "next";
import CarDetailPage from "@/src/components/pages/CarDetailPage";
import {
  buildRentFlowCarCarMetadata,
  buildRentFlowCarJsonLd,
} from "@/src/lib/seo";
import { getRentFlowCarSeoCarById } from "@/src/lib/seo-data";
import { getRentFlowCarRequestHost } from "@/src/lib/server-tenant";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const [{ id }, host] = await Promise.all([
    params,
    getRentFlowCarRequestHost(),
  ]);
  const car = await getRentFlowCarSeoCarById(id, { host });

  return buildRentFlowCarCarMetadata({
    host,
    car: car || {
      id,
      name: "รถเช่า",
    },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, host] = await Promise.all([
    params,
    getRentFlowCarRequestHost(),
  ]);
  const car = await getRentFlowCarSeoCarById(id, { host });
  const jsonLd = car ? buildRentFlowCarJsonLd({ host, car }) : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <CarDetailPage carId={id} />
    </>
  );
}
