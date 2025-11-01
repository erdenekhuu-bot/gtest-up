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
        select: {
          confirm: {
            distinct: ["employeeId"],
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
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
