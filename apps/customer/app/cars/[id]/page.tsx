import CarDetailPage from "@/src/components/pages/CarDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CarDetailPage carId={id} />;
}
