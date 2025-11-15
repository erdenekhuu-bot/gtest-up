import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const request = await req.json();
   
    // const record = await prisma.testCase.create({
    //   data: {
    //     testType: request.action,
    //     description: request.description,
    //   },
    // });
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      { status: 500 }
    );
  }
}
