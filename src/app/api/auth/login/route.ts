import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.authUser.findFirst({
      where: {
        username: request.username,
      },
      include: {
        employee: {
          select: {
            jobPosition: {
              select: {
                jobPositionGroup: true,
              },
            },
            departmentEmployeeRole: {
              where: {
                rode: false,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
