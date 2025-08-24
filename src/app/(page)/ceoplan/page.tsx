"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/util/prisma";
import { ListPage } from "@/components/page/listpage";
import { DefineLevel } from "@/util/checkout";
import { filterByPermissionLevels } from "@/util/checkout";

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
  const record = await prisma.$transaction(async (tx) => {
    const data = await tx.authUser.findUnique({
      where: {
        id: Number(session?.user.id),
      },
      include: {
        employee: true,
      },
    });
    const list = await tx.departmentEmployeeRole.findMany({
      distinct: ["employeeId"],
      orderBy: {
        document: {
          timeCreated: "desc",
        },
      },
      include: {
        employee: {
          include: {
            jobPosition: {
              select: {
                jobPositionGroup: true,
              },
            },
          },
        },
        document: {
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
          },
        },
      },
    });
    const dataWithLevels = list.map((item) => ({
      ...item,
      level: DefineLevel(
        item.employee?.jobPosition?.jobPositionGroup?.name || ""
      ),
    }));

    const filteredData = filterByPermissionLevels(dataWithLevels).filter(
      (item: any) => item.employeeId === data?.employee?.id
    );
    return filteredData;
  });
  const totalCount = record.length;
  return (
    <ListPage
      data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
