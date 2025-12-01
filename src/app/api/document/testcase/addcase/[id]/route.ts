import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../../../util/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.document.findUnique({
      where: { id: Number(id) },
      select: {
        testcase: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
