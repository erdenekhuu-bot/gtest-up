import { prisma } from "@/util/prisma";
import ViewReport from "../viewreport/page";

export default async function Page({
  params,
}: {
  params: Promise<{ tm: string }>;
}) {
  const { tm } = await params;

  const result = await prisma.report.findUnique({
    where: {
      id: Number(tm)
    },
    select: {
      document: {
        select: {
          documentemployee: {
            include: {
              employee: true
            }
          },
          testcase: true,
          report: {
            include: {
              issue: true,
              usedphone: true
            }
          },
          budget: true
        }
      }
    }
  })
  return <ViewReport data={result}/>
}
