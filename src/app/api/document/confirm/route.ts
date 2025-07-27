import { NextRequest, NextResponse } from "next/server";
import { filterEmployee } from "@/util/usable";
import { prisma } from "@/util/prisma";

export async function PUT(req: NextRequest) {
  try {
    const request = await req.json();
    const data = await Promise.all(
      request.map(async (item: any) => {
        try {
          const employeeId =
            typeof item.employeeId === "number"
              ? item.employeeId
              : await filterEmployee(item.employeeId);
          if (employeeId === undefined) {
            return null;
          }
          return {
            employeeId: employeeId,
            system: item.system,
            description: item.description,
            module: item.module,
            version: item.version,
            jobs: item.jobs,
            startedDate: item.startedDate,
            title: item.title,
            documentId: item.documentid,
          };
        } catch (error) {
          return null;
        }
      })
    );

    const record = await prisma.$transaction(async (tx) => {
      const document = await tx.confirmPaper.findFirst({
        where: {
          documentId: request.documentid,
        },
      });
      if (!document) {
        await tx.confirmPaper.createMany({
          data,
        });
      }
      await tx.confirmPaper.deleteMany({
        where: {
          documentId: request.documentid,
        },
      });
      await tx.confirmPaper.createMany({
        data: data,
      });
      return document;
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

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const user = await tx.authUser.findUnique({
        where: {
          id: Number(request.authId),
        },
        include: {
          employee: true,
        },
      });
      const paper =
        user &&
        (await tx.confirmPaper.findMany({
          where: {
            employeeId: user.employee?.id,
          },
        }));
      return paper?.length;
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
