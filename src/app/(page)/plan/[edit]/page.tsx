import { prisma } from "@/util/prisma";
import { EditPage } from "@/components/window/document/editpage/Editing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ edit: string }>;
}) {
  const { edit } = await params;
  const session = await getServerSession(authOptions);
  const authuser = await prisma.authUser.findUnique({
    where: {
      id: Number(session?.user.id),
    },
    include: {
      employee: {
        include: {
          department: true,
        },
      },
    },
  });

  const record = await prisma.$transaction(async (tx) => {
    const data = await prisma.document.findUnique({
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
          where: {
            role: {
              not: "MIDDLE",
            },
          },
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

    const steps = await tx.departmentEmployeeRole.findMany({
      where: { documentId: Number(edit) },
      distinct: ["employeeId"],
      include: {
        employee: {
          include: {
            jobPosition: {
              select: { jobPositionGroup: true },
            },
            department: true,
            authUser: true,
          },
        },
      },
    });
    steps.sort((a: any, b: any) => {
      if (a.permissionLvl === null && b.permissionLvl !== null) return -1;
      if (a.permissionLvl !== null && b.permissionLvl === null) return 1;

      return (
        b.employee.jobPosition.jobPositionGroup.jobAuthRank -
        a.employee.jobPosition.jobPositionGroup.jobAuthRank
      );
    });

    return {
      data,
      steps,
    };
  });

  return <EditPage document={record.data} id={edit} steps={record.steps} />;
}
