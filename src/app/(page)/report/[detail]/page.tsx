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
      testcase: {
        orderBy: {
          id: "asc",
        },
        include: {
          testCaseImage: true,
        },
      },
    },
  });
  return <ReportMake id={detail} data={record} />;
}
