import { Suspense } from "react";
import PrivacyPage from "@/src/components/pages/PrivacyPage";
import PrivacyPageSkeleton from "@/src/components/privacy/PrivacyPageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<PrivacyPageSkeleton />}>
      <PrivacyPage />
    </Suspense>
  );
}
