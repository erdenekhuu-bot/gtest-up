import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

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
          confirm: {
            where: {
              employeeId: Number(user?.employee?.id),
            },
            select: {
              employee: true,
            },
          },
        },
      });
      return detail;
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
