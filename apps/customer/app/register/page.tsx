import { Suspense } from "react";
import Register from "@/src/auth/Register";
import RegisterCardSkeleton from "@/src/components/auth/RegisterCardSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<RegisterCardSkeleton />}>
      <Register />
    </Suspense>
  );
}
