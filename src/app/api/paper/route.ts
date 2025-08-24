import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { tm } = await req.json();
    const record = await prisma.employee.findUnique({
      where: { id: Number(tm) },
      include: {
        confirm: {
          include: {
            document: true,
          },
        },
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

export async function PATCH(req: NextRequest) {
  try {
    const { id } = await req.json();
    const record = await prisma.confirmPaper.update({
      where: {
        id,
      },
      data: {
        check: true,
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

export async function POST(req: NextRequest) {
  try {
    const { tm } = await req.json();
    const record = await prisma.confirmPaper.findUnique({
      where: {
        id: tm,
      },
      include: {
        employee: true,
        sub: {
          include: {
            employee: true,
          },
        },
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
