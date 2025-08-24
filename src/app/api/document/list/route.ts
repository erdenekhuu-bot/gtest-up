import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";

export async function POST(req: NextRequest) {
  try {
    const { user } = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const authuser = await prisma.authUser.findUnique({
        where: {
          id: Number(user),
        },
        include: {
          employee: {
            include: {
              department: true,
            },
          },
        },
      });
      const result = await tx.employee.findMany({
        where: {
          AND: [
            {
              departmentId: authuser?.employee?.department.id,
            },
            {
              isDeleted: false,
            },
          ],
        },
        include: {
          authUser: {
            include: {
              Document: {
                where: {
                  state: {
                    equals: "PENDING",
                  },
                },
              },
            },
          },
        },
      });

      return result;
    });
    const allDocuments = record.flatMap((item: any) => item.authUser.Document);
    return NextResponse.json(
      { success: true, data: allDocuments.length },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
