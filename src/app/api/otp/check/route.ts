import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";
import { OTP } from "@prisma/client";

export async function PUT(req: NextRequest) {
  try {
    const { authuserId, otp } = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const authuser = await tx.authUser.findUnique({
        where: {
          id: authuserId,
        },
        select: {
          id: true,
          mobile: true,
          otp: true,
        },
      });
      const checkout = await tx.authUser.update({
        where: {
          id: authuser?.id,
        },
        data: {
          checkotp: otp === authuser?.otp ? OTP.ACCESS : OTP.DENY,
        },
        select: {
          checkotp: true,
        },
      });
      return checkout;
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
