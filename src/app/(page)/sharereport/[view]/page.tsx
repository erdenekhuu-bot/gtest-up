import { prisma } from "@/util/prisma";
import { ShareMemberReport } from "@/components/window/share/sharememberreport";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  const record = await prisma.report.findUnique({
    where: {
      id: Number(view),
    },
    include: {
      usedphone: true,
      issue: true,
      document: {
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
          testcase: true,
        },
      },
    },
  });
  return <ShareMemberReport data={record} />;
}
