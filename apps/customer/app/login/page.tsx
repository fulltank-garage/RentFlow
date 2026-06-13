import { Suspense } from "react";
import Login from "@/src/auth/Login";
import LoginCardSkeleton from "@/src/components/auth/LoginCardSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<LoginCardSkeleton />}>
      <Login />
    </Suspense>
  );
}
