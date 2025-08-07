import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    const record = await prisma.document.update({
      where: {
        id: Number(id),
      },
      data: {
        state: "PENDING",
      },
    });
    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
