import { Suspense } from "react";
import type { Metadata } from "next";
import Login from "@/src/auth/Login";
import LoginCardSkeleton from "@/src/components/auth/LoginCardSkeleton";
import { buildRentFlowCarNoIndexMetadata } from "@/src/lib/seo";
import {
  getInitialRentFlowCarTenantProfile,
  getRentFlowCarRequestHost,
} from "@/src/lib/server-tenant";

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRentFlowCarRequestHost();
  const tenant = await getInitialRentFlowCarTenantProfile(host);
  return buildRentFlowCarNoIndexMetadata({
    host,
    tenant,
    pathname: "/login",
    title: "เข้าสู่ระบบ",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<LoginCardSkeleton />}>
      <Login />
    </Suspense>
  );
}
