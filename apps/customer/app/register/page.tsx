import { Suspense } from "react";
import type { Metadata } from "next";
import Register from "@/src/auth/Register";
import RegisterCardSkeleton from "@/src/components/auth/RegisterCardSkeleton";
import { buildRentFlowCarNoIndexMetadata } from "@/src/lib/seo";

export const metadata: Metadata = buildRentFlowCarNoIndexMetadata("สมัครสมาชิก");

export default function Page() {
  return (
    <Suspense fallback={<RegisterCardSkeleton />}>
      <Register />
    </Suspense>
  );
}
