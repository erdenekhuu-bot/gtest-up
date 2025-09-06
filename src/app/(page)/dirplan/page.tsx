"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/util/prisma";
import { DirPage } from "@/components/page/dirpage";

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
    const documents = await tx.document.findMany({
      where: {
        departmentEmployeeRole: {
          some: {
            rode: true,
          },
        },
      },
      select: {
        id: true,
        title: true,
        generate: true,
        state: true,
        departmentEmployeeRole: {
          distinct: ["employeeId"],
          where: {
            rode: true,
            employee: {
              jobPosition: {
                jobPositionGroup: {
                  jobAuthRank: 2,
                },
              },
            },
          },
          select: {
            rode: true,
            employee: {
              select: {
                firstname: true,
              },
            },
          },
        },
      },
    });
    const checkout = documents[0].departmentEmployeeRole.every(
      (item) => item.rode === true
    );

    const record = checkout
      ? await prisma.document.findMany({
          where: {
            departmentEmployeeRole: {
              some: {
                rode: true,
              },
            },
          },
          include: {
            user: {
              include: {
                employee: true,
              },
            },
            departmentEmployeeRole: {
              select: {
                rode: true,
                employee: {
                  select: {
                    authUser: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        })
      : [];
    return record;
  });

  const totalCount = record.length;

  return (
    <DirPage data={record} total={totalCount} page={page} pageSize={pageSize} />
  );
}
