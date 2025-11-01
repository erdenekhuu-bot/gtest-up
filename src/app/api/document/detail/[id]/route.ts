import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const record = await prisma.$transaction(async (tx) => {
      const detail = await tx.document.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          user: {
            select: {
              employee: {
                select: {
                  firstname: true,
                  lastname: true,
                  jobPosition: true,
                  department: true,
                },
              },
            },
          },
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
            where: {
              role: "ACCESSER"
            },
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

              file: true,
              usedphone: true,
            },
          },
          confirm: {
            include: {
              employee: true,
            },
          },
        },
      });

      return detail;
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
