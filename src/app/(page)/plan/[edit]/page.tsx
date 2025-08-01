import { prisma } from "@/util/prisma";
import { EditPage } from "@/components/window/document/editpage/Editing";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ edit: string }>;
}) {
  const { edit } = await params;
  const record = await prisma.document.findUnique({
    where: {
      id: Number(edit),
    },
    include: {
      documentemployee: {
        distinct: ["employeeId"],
        select: {
          employee: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              jobPosition: true,
              department: true,
            },
          },
          role: true,
          startedDate: true,
          endDate: true,
        },
      },
      departmentEmployeeRole: {
        distinct: ["employeeId"],
        select: {
          employee: {
            include: {
              jobPosition: true,
              department: true,
              authUser: true,
            },
          },
          role: true,
          state: true,
          startedDate: true,
          endDate: true,
        },
      },
      attribute: true,
      detail: true,
      riskassessment: true,
      testcase: {
        orderBy: {
          id: "asc",
        },
        include: {
          testCaseImage: true,
        },
      },
      budget: true,
      file: true,
      report: {
        include: {
          budget: true,
          issue: true,
          team: true,
          testcase: true,
          file: true,
          usedphone: true,
        },
      },
    },
  });

  return <EditPage document={record} id={edit} />;
}
