import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function POST(req: NextRequest) {
  try {
    const { tm } = await req.json();
    const record = await prisma.document.findMany({
      where: {
        authUserId: Number(tm),
      },
      include: {
        departmentEmployeeRole: {
          include: {
            employee: {
              select: {
                authUser: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      { status: 500 }
    );
  }
}
