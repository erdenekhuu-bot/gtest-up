import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await prisma.$queryRaw`
      SELECT 
          jsonb_agg(
            jsonb_build_object(
              'sub', sub,
              'employeeName', emp.firstname || ' ' || emp.lastname
            )
          ) AS result
        FROM "ConfirmSub" sub
        JOIN "Employee" emp ON emp.id = sub."employeeId"
        WHERE sub."confirmId" = ${Number(id)};
    `;

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
