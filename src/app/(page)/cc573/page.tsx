"use server";
import { prisma } from "@/util/prisma";
import { CCpage } from "@/components/page/cc";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
      departmentEmployeeRole: {
        every: {
          state: "ACCESS",
        },
      },
    },
    include: {
      detail: true,
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
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      timeCreated: "asc",
    },
  });
  const totalCount = record.length;
  console.log(record);
  return (
    <CCpage
      document={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
