import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";
import { check } from "valibot";

export async function POST(req: NextRequest) {
  try {
    const { id, userid } = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const user = await tx.authUser.findUnique({
        where: { id: Number(userid) },
        select: {
          employee: true,
        },
      });
      const detail = await tx.document.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          confirm: {
            where: {
              employeeId: Number(user?.employee?.id),
            },
            select: {
              id: true,
              sub: {
                include: {
                  employee: true,
                },
              },
            },
          },
        },
      });
      return detail;
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id } = await req.json();
    const record = await prisma.employee.findUnique({
      where: {
        id,
      },
      select: {
        confirm: {
          include: {
            employee: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    await prisma.confirmSub.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

