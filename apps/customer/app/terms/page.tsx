import { Suspense } from "react";
import TermsPage from "@/src/components/pages/TermsPage";
import TermsPageSkeleton from "@/src/components/terms/TermsPageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<TermsPageSkeleton />}>
      <TermsPage />
    </Suspense>
  );
}