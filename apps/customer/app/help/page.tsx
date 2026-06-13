import { Suspense } from "react";
import HelpPage from "@/src/components/pages/HelpPage";
import HelpPageSkeleton from "@/src/components/help/HelpPageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<HelpPageSkeleton />}>
      <HelpPage />
    </Suspense>
  );
}