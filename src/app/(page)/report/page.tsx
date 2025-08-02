"use server";
import { prisma } from "@/util/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DocumentStateEnum } from "@prisma/client";
import { ReportPage } from "@/components/page/reportpage";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 10;
  const session = await getServerSession(authOptions);

  const record = await prisma.document.findMany({
    where: {
      AND: [
        {
          authUserId: Number(session?.user.id),
        },

        {
          departmentEmployeeRole: {
            every: {
              state: DocumentStateEnum.ACCESS,
            },
          },
        },
      ],
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      user: {
        select: {
          employee: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
        },
      },
      file: true,
      report: true,
      departmentEmployeeRole: true,
    },
    orderBy: {
      timeCreated: "asc",
    },
  });
  const totalCount = record.length;

  return (
    <ReportPage
      data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
