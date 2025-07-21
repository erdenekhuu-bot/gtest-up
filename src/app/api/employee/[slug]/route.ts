import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const detail = await prisma.employee.findUnique({
      where: {
        id: Number(slug),
      },
      include: {
        jobPosition: {
          include: {
            jobPositionGroup: true,
          },
        },
        department: true,
        authUser: true,
      },
    });

    return NextResponse.json({ success: true, data: detail }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
