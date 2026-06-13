import ClassPage from "@/src/components/pages/ClassPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ClassPage slug={slug} />;
}
