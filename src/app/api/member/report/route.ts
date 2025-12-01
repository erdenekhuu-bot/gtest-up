import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function POST(req: NextRequest) {
  try {
    const { tm } = await req.json();
    const record = await prisma.report.findMany({
      where: {
        id: Number(tm),
      },
    });
    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { tm } = await req.json();
    const result = await prisma.report.findUnique({
      where: {
        id: Number(tm),
      },
      select: {
        document: {
          select: {
            documentemployee: {
              include: {
                employee: true,
              },
            },
            testcase: true,
            report: {
              include: {
                issue: true,
                usedphone: true,
              },
            },
            budget: true,
          },
        },
      },
    });
    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      { status: 500 }
    );
  }
}
