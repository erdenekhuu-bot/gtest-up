import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const record = await prisma.rejection.findUnique({
      where: { id: Number(slug) },
    });
    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
