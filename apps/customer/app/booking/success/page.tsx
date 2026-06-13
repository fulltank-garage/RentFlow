import { Suspense } from "react";
import BookingSuccessPage from "@/src/components/pages/BookingSuccessPage";
import BookingSuccessPageSkeleton from "@/src/components/booking/BookingSuccessPageSkeleton";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(
  value: string | string[] | undefined,
  fallback = ""
) {
  return Array.isArray(value) ? value[0] ?? fallback : value ?? fallback;
}

async function BookingSuccessPageContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const bookingId = readParam(params.bookingId, "BK-XXXX");
  const tenantSlug = readParam(params.tenant, "");
  const amount = Number(readParam(params.amount, "0")) || 0;
  const carName = readParam(params.carName, "");
  const customerName = readParam(params.customerName, "");
  const customerPhone = readParam(params.customerPhone, "");
  const pickupDate = readParam(params.pickupDate, "");
  const returnDate = readParam(params.returnDate, "");
  const pickupPoint = readParam(params.pickupPoint, "");
  const returnPoint = readParam(params.returnPoint, "");
  const shopName = readParam(params.shopName, "");
  const bookingMode = readParam(params.bookingMode, "chat");

  return (
    <BookingSuccessPage
      bookingId={bookingId}
      amount={amount}
      tenantSlug={tenantSlug || undefined}
      carName={carName || undefined}
      customerName={customerName || undefined}
      customerPhone={customerPhone || undefined}
      pickupDate={pickupDate || undefined}
      returnDate={returnDate || undefined}
      pickupPoint={pickupPoint || undefined}
      returnPoint={returnPoint || undefined}
      shopName={shopName || undefined}
      bookingMode={bookingMode}
    />
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<BookingSuccessPageSkeleton />}>
      <BookingSuccessPageContent searchParams={searchParams} />
    </Suspense>
  );
}
