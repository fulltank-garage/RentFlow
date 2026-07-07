import { Suspense } from "react";
import type { Metadata } from "next";
import ForgotPassword from "@/src/auth/ForgotPassword";
import ForgotPasswordCardSkeleton from "@/src/components/auth/ForgotPasswordCardSkeleton";
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
    pathname: "/forgot-password",
    title: "ลืมรหัสผ่าน",
  });
}

export default function Page() {
  return (
    <Suspense fallback={<ForgotPasswordCardSkeleton />}>
      <ForgotPassword />
    </Suspense>
  );
}
