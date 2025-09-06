import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";

export async function POST(req: NextRequest) {
  try {
    const { employeeId } = await req.json();
    const list = await prisma.departmentEmployeeRole.findMany({
      where: {
        employeeId: {
          not: employeeId,
        },
      },
      distinct: ["employeeId"],
      select: {
        rode: true,
        employee: {
          select: {
            firstname: true,
          },
        },
        document: true,
      },
    });

    const checkout = list.every((item) => item.rode === true);

    const record = checkout
      ? await prisma.departmentEmployeeRole.findMany({
          where: {
            employeeId,
          },
        })
      : [];

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      {
        status: 500,
      }
    );
  }
}
