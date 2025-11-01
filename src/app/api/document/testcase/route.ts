import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const page = parseInt(url.searchParams.get("page") || "1", 10); 
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10); 

  try {
    const records = await prisma.testCase.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const total = await prisma.testCase.count();

    return NextResponse.json(
      { success: true, data: records, total },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
