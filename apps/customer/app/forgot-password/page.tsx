import { Suspense } from "react";
import ForgotPassword from "@/src/auth/ForgotPassword";
import ForgotPasswordCardSkeleton from "@/src/components/auth/ForgotPasswordCardSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<ForgotPasswordCardSkeleton />}>
      <ForgotPassword />
    </Suspense>
  );
}
