import { Suspense } from "react";
import ContactPage from "@/src/components/pages/ContactPage";
import ContactPageSkeleton from "@/src/components/contact/ContactPageSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactPage />
    </Suspense>
  );
}