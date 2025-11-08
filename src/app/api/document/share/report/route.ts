import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";

export async function PUT(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const paper = await tx.shareReport.findMany({
        where: {
          reportId: Number(request.id),
        },
        select: {
          employee: {
            select: {
              id: true,
              firstname: true,
            },
          },
        },
      });
      return paper;
    });
    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
