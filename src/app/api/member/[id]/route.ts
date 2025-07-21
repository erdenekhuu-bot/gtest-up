import { NextResponse } from "next/server";
import { prisma } from "@/util/prisma";

export async function GET({ params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const record = await prisma.document.findMany({
      where: {
        authUserId: Number(id),
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
