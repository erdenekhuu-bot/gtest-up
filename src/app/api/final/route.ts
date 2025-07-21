import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";
import { Checking } from "@/util/usable";

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

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.log(error);
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
          documentId: parseInt(request.documentId),
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
    console.log(error);
    return NextResponse.json({ success: false, data: error });
  }
}
