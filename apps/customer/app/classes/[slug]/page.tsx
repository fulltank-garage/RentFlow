import type { Metadata } from "next";
import ClassPage from "@/src/components/pages/ClassPage";
import { buildRentFlowCarClassMetadata } from "@/src/lib/seo";
import { getRentFlowCarRequestHost } from "@/src/lib/server-tenant";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, host] = await Promise.all([
    params,
    getRentFlowCarRequestHost(),
  ]);

  return buildRentFlowCarClassMetadata({ host, slug });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ClassPage slug={slug} />;
}
