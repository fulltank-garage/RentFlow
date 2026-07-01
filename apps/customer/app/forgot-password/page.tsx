import { Suspense } from "react";
import type { Metadata } from "next";
import ForgotPassword from "@/src/auth/ForgotPassword";
import ForgotPasswordCardSkeleton from "@/src/components/auth/ForgotPasswordCardSkeleton";
import { buildRentFlowCarNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata =
  buildRentFlowCarNoIndexMetadata("ลืมรหัสผ่าน");

export default function Page() {
  return (
    <Suspense fallback={<ForgotPasswordCardSkeleton />}>
      <ForgotPassword />
    </Suspense>
  );
}
