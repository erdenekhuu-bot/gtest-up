import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const userId = await prisma.authUser.findUnique({
      where: {
        id: request.authId,
      },
      include: {
        employee: true,
      },
    });
    const record =
      userId &&
      (await prisma.shareGroup.findMany({
        where: {
          employeeId: userId.employee?.id,
        },
      }));

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
