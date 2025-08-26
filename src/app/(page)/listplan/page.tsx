"use server";
import { ListPage } from "@/components/page/listpage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/util/prisma";

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
        employee: {
          select: {
            id: true,
            jobPosition: {
              select: {
                jobPositionGroup: true
              }
            }
          }
        },
        
      },
    });
    
    const list = await tx.departmentEmployeeRole.findMany({
      where: {
        AND: [
          {
            employeeId: data?.employee?.id,
          },
          {
            document: {
              state: "FORWARD",
            },
          },
        ],
      },
      distinct: ["documentId"],
      orderBy: {
        document: {
          timeCreated: "desc",
        },
      },
      include: {
        employee: {
          select: {
            firstname: true,
            lastname: true,
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
    return list;
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
