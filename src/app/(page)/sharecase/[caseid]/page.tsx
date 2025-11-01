import { prisma } from "@/util/prisma";
import { TestCaseAction } from "@/components/window/report/TestCaseAction";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ caseid: string }>;
}) {
  const { caseid } = await params;
  const record = await prisma.testCase.findUnique({
    where: {
      id: Number(caseid),
    },
    include: {
      document: {
        select: {
          documentemployee: {
            select: {
              employee: true,
            },
          },
        },
      },
    },
  });
  return <TestCaseAction record={record} />;
}
