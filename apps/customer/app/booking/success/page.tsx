import { Suspense } from "react";
import type { Metadata } from "next";
import BookingSuccessPage from "@/src/components/pages/BookingSuccessPage";
import BookingSuccessPageSkeleton from "@/src/components/booking/BookingSuccessPageSkeleton";
import { buildRentFlowCarNoIndexMetadata } from "@/src/lib/seo";
import {
  getInitialRentFlowCarTenantProfile,
  getRentFlowCarRequestHost,
} from "@/src/lib/server-tenant";

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRentFlowCarRequestHost();
  const tenant = await getInitialRentFlowCarTenantProfile(host);
  return buildRentFlowCarNoIndexMetadata({
    host,
    tenant,
    pathname: "/booking/success",
    title: "จองรถสำเร็จ",
  });
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(
  value: string | string[] | undefined,
  fallback = ""
) {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

async function BookingSuccessPageContent({
  params,
}: {
  params: Record<string, string | string[] | undefined>;
}) {
  const bookingId = readParam(params.bookingId, "BK-XXXX");
  const tenantSlug = readParam(params.tenant, "");
  const amount = Number(readParam(params.amount, "0")) || 0;
  const carName = readParam(params.carName, "");
  const customerName = readParam(params.customerName, "");
  const customerPhone = readParam(params.customerPhone, "");
  const bookingCreatedAt = readParam(params.bookingCreatedAt, "");
  const documentType = readParam(params.documentType, "payment_proof");
  const pickupDate = readParam(params.pickupDate, "");
  const returnDate = readParam(params.returnDate, "");
  const pickupPoint = readParam(params.pickupPoint, "");
  const returnPoint = readParam(params.returnPoint, "");
  const shopName = readParam(params.shopName, "");
  const bookingMode = readParam(params.bookingMode, "payment");

  return (
    <BookingSuccessPage
      bookingId={bookingId}
      amount={amount}
      tenantSlug={tenantSlug || undefined}
      carName={carName || undefined}
      customerName={customerName || undefined}
      customerPhone={customerPhone || undefined}
      bookingCreatedAt={bookingCreatedAt || undefined}
      documentType={documentType === "receipt" ? "receipt" : "payment_proof"}
      pickupDate={pickupDate || undefined}
      returnDate={returnDate || undefined}
      pickupPoint={pickupPoint || undefined}
      returnPoint={returnPoint || undefined}
      shopName={shopName || undefined}
      bookingMode={bookingMode}
    />
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const bookingMode = readParam(params.bookingMode, "payment");
  const skeletonMode = bookingMode === "payment" ? "payment" : "chat";

  return (
    <Suspense fallback={<BookingSuccessPageSkeleton mode={skeletonMode} />}>
      <BookingSuccessPageContent params={params} />
    </Suspense>
  );
}
