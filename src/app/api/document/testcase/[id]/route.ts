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
        id: parseInt(id),
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
    console.log(error);
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
        id: parseInt(id),
      },
      data: {
        testType: request.action,
        description: request.description,
      },
    });

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
