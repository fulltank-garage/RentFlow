import { Suspense } from "react";
import CarsPage from "@/src/components/pages/CarsPage";
import CarsPageSkeleton from "@/src/components/cars/CarsPageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<CarsPageSkeleton />}>
      <CarsPage />
    </Suspense>
  );
}
