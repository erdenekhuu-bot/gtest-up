import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";

export async function GET(req: NextRequest) {
  try {
    const record = await prisma.$transaction(async (tx) => {
    const result = await tx.document.findMany({
      where: {
        confirm: {
          some: {},
        },
      },
      include: {
        confirm: {
          include: {
            sub: true,
          },
        },
      },
    });
    return result;
  });
    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      {
        status: 500,
      }
    );
  }
}
