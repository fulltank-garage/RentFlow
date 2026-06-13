import { Suspense } from "react";

import ShopsPage from "@/src/components/pages/ShopsPage";
import ShopsPageSkeleton from "@/src/components/shops/ShopsPageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<ShopsPageSkeleton />}>
      <ShopsPage />
    </Suspense>
  );
}
