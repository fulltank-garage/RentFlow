import { Suspense } from "react";
import type { Metadata } from "next";
import Login from "@/src/auth/Login";
import LoginCardSkeleton from "@/src/components/auth/LoginCardSkeleton";
import { buildRentFlowCarNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildRentFlowCarNoIndexMetadata("เข้าสู่ระบบ");

export default function Page() {
  return (
    <Suspense fallback={<LoginCardSkeleton />}>
      <Login />
    </Suspense>
  );
}
