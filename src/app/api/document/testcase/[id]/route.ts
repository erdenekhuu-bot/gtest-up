import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.testCase.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        testCaseImage: true,
        document: {
          select: {
            documentemployee: {
              select: {
                employee: true,
              },
            },
          },
        },
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const request = await req.json();
    const record = await prisma.testCase.update({
      where: {
        id: Number(id),
      },
      data: {
        testType: request.action,
        description: request.description,
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
