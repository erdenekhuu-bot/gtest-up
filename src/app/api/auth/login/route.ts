import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    let result=[]
    const request = await req.json();
    const record = await prisma.authUser.findFirst({
      where: {
        username: request.username,
      },
      include: {
        employee: {
          select: {
            id:true,
            jobPosition: {
              select: {
                jobPositionGroup: true,
              },
            },
          },
        },
      },
    });
    if(Number(record?.employee?.jobPosition?.jobPositionGroup?.jobAuthRank) > 1){
      result.push("READ")
    }
    else {
      result.push('EDIT')
    }
    const existingPermission = await prisma.permission.findFirst({
      where: {
        employee: {
          some: {
            id: Number(record?.employee?.id),
          },
        },
      },
    });

    if (existingPermission) {
      await prisma.permission.update({
        where: { id: existingPermission.id },
        data: {
          kind: result,
        },
      });
    } else {
      await prisma.permission.create({
        data: {
          kind: result,
          employee: {
            connect: { id: Number(record?.employee?.id) },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: existingPermission,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
