import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";
import { convertName } from "@/util/usable";

export async function PATCH(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const user = await tx.authUser.findUnique({
        where: {
          id: Number(request.authUser),
        },
        include: {
          employee: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      });
      const update =
        user &&
        (await tx.confirmPaper.update({
          where: {
            // employeeId: user.employee?.id,
            id: request.paperid,
          },
          data: {
            rode: { employee: convertName(user.employee), rode: true },
          },
        }));
      return update;
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
