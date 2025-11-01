"use server";
import { prisma } from "@/util/prisma";
import { MemberPlanDetail } from "@/components/window/MemberPlanDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  const record = await prisma.$transaction(async (tx) => {
    const data = await tx.document.findUnique({
      where: {
        id: Number(view),
      },
      include: {
        documentemployee: {
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
          orderBy: {
            startedDate: "asc",
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
      where: { documentId: Number(view) },
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

    // const dataWithLevels = steps
    //   .map((item) => ({
    //     ...item,
    //     level: DefineLevel(
    //       item.employee?.jobPosition?.jobPositionGroup?.name || ""
    //     ),
    //   }))
    //   .sort((a, b) => b.level - a.level);

    return {
      data,
      steps,
    };
  });
  return <MemberPlanDetail document={record.data} steps={record.steps} />;
}
