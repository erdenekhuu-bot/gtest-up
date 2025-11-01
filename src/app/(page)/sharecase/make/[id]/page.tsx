import { ReportCard } from "@/components/window/report/ReportCard";

export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReportCard documentId={Number(id)} />;
}
