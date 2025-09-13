import { prisma } from "@/util/prisma";
import { PlanPage } from "@/components/page/planpage";
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
      AND: [
        {
          authUserId: Number(session?.user.id),
        },
        {
          title: {
            contains: search || "",
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
      departmentEmployeeRole: true,
      reject: true,
      file: true,
    },
    orderBy: {
      timeCreated: "asc",
    },
  });
  const totalCount = await prisma.document.count({
    where: {
      authUserId: Number(session?.user.id),
    },
  });

  return (
    <PlanPage
      data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
