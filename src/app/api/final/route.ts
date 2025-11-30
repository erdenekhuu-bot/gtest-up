import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";
import { Checking } from "@/util/usable";
import { OTP } from "@prisma/client";
import { MiddleCheck } from "@/util/usable";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const authuser = await prisma.authUser.findUnique({
      where: {
        id: request.authuserId,
      },
      select: {
        id: true,
        mobile: true,
        otp: true,
        employee: true,
      },
    });

    if (request.otp !== authuser?.otp) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    const record = await prisma.$transaction(async (tx) => {
      const checkout = await tx.authUser.update({
        where: {
          id: authuser?.id,
        },
        data: {
          checkotp: OTP.ACCESS,
        },
        select: {
          checkotp: true,
        },
      });

      checkout.checkotp === "ACCESS" &&
        (await tx.document.update({
          where: {
            id: Number(request.documentId),
          },
          data: {
            state: "FORWARD",
          },
        }));

      const updating = await tx.departmentEmployeeRole.updateMany({
        where: {
          employeeId: authuser?.employee?.id,
          documentId: Number(request.documentId),
        },
        data: {
          state: "ACCESS",
          rode: true,
          endDate: new Date(),
        },
      });
      return updating;
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json({ success: false, data: error });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const authuser = await tx.authUser.findUnique({
        where: {
          id: Number(request.authuserId),
        },
        include: {
          employee: true,
        },
      });
      const updating =
        authuser &&
        (await tx.document.update({
          where: {
            id: Number(request.documentId),
          },
          data: {
            state: Checking(request.reject),
            departmentEmployeeRole: {
              updateMany: {
                where: {
                  documentId: Number(request.documentId),
                },
                data: {
                  rode: false,
                  state: "DENY",
                },
              },
            },
          },
        }));

      return updating;
    });
    await prisma.rejection.delete({
      where: { documentId: Number(request.documentId) },
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json({ success: false, data: error });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const request = await req.json();
    const authuser = await prisma.authUser.findUnique({
      where: {
        id: Number(request.authuserId),
      },
      select: {
        id: true,
        mobile: true,
        otp: true,
        employee: true,
      },
    });

    const record = await prisma.$transaction(async (tx) => {
      const updating = await tx.departmentEmployeeRole.updateMany({
        where: {
          employeeId: authuser?.employee?.id,
          documentId: Number(request.documentId),
        },
        data: {
          state: Checking(request.reject),
          rode: true,
        },
      });

      return updating;
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json({ success: false, data: error });
  }
}

export async function GET() {
  try {
    const record = await prisma.departmentEmployeeRole.findMany({
      include: {
        employee: {
          select: {
            firstname: true,
            jobPosition: {
              select: {
                jobPositionGroup: true,
              },
            },
          },
        },
        document: {
          select: {
            title: true,
          },
        },
      },
    });
    const result = record.filter(
      (item) =>
        Number(item.employee?.jobPosition?.jobPositionGroup?.jobAuthRank) < 4
    );

    const merge = result.every((item) => item.rode === true);

    return NextResponse.json({ success: true, data: merge ? result : 0 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error });
  }
}
