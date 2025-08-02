import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const record = await prisma.$transaction(async (tx) => {
      const authuser = await tx.authUser.findUnique({
        where: {
          id: Number(slug),
        },
        include: {
          employee: {
            include: {
              department: true,
            },
          },
        },
      });

      const document = await tx.employee.findMany({
        where: {
          AND: [
            {
              departmentId: authuser?.employee?.department.id,
            },
            {
              isDeleted: false,
            },
            {
              jobPosition: {
                name: {
                  not: "Дарга",
                },
              },
            },

            {
              authUser: {
                Document: {
                  some: {},
                },
              },
            },
          ],
        },
        include: {
          authUser: {
            select: {
              Document: {
                where: {
                  state: "PENDING",
                },
                include: {
                  file: true,
                  user: {
                    select: {
                      employee: {
                        select: {
                          firstname: true,
                          lastname: true,
                        },
                      },
                    },
                  },
                },
                orderBy: {
                  timeCreated: "asc",
                },
              },
            },
          },
          jobPosition: true,
        },
      });
      return document;
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
