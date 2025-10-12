"use server";
import { prisma } from "@/util/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TeamPlanPage } from "@/components/page/teamplanpage";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 10;
  const session = await getServerSession(authOptions);
  const authuser = await prisma.authUser.findUnique({
    where: {
      id: Number(session?.user.id),
    },
    include: {
      employee: {
        include: {
          department: true,
        },
      },
    },
  });
  const record = await prisma.$transaction(async (tx) => {
    const result = await tx.employee.findMany({
      where: {
        AND: [
          {
            departmentId: authuser?.employee?.department.id,
          },
          {
            isDeleted: false,
          },
        ],
      },
      include: {
        jobPosition: {
          select: {
            jobPositionGroup: true
          }
        },
        authUser: {
          select: {
            id: true,
            Document: {
              where: {
                state: {
                  not: "DENY",
                },
              },
              include: {
                reject: true
              }
            },
          },
        },
      },
    });
    return result;
  });

  record.sort((a:any, b:any) => b.jobPosition.jobPositionGroup.jobAuthRank - a.jobPosition.jobPositionGroup.jobAuthRank)
  const totalCount = record.length;
  
  return (
    <TeamPlanPage
      data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
