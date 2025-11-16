import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { id } = await req.json();
    // const clonerecord = await prisma.testCase.findUnique({
    //   where: { id },
    // });
    // delete clonerecord.id;
    // clonerecord.testType = "TESTENV";

    // await prisma.testCase.create({
    //   data: clonerecord,
    // });

    return NextResponse.json({
      success: true,
      data: id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
