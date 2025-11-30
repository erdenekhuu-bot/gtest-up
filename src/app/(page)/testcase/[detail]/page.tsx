import { prisma } from "@/util/prisma";
import { ReportMake } from "@/components/page/reportmake";

export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ detail: string }>;
}) {
  const { detail } = await params;
  const record = await prisma.document.findUnique({
    where: {
      id: Number(detail),
    },
    include: {
      detail: true,
      documentemployee: {
        include: {
          employee: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
        },
      },
      budget: true,
      report: {
        include: {
          issue: true,
          usedphone: true,
        },
      },
    },
  });
  return <ReportMake id={detail} data={record} />;
}
