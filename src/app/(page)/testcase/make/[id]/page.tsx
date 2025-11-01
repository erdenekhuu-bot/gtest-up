import { EditCaseCard } from "@/components/window/case/editcase";

export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditCaseCard documentId={Number(id)} />;
}
