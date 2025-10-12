"use server";
import { prisma } from "@/util/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TeamReportPage } from "@/components/page/teamreportpage";

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
     const result = await tx.document.findMany({
      where: {
        report: {
          isNot: null
        },
      },
      include: {
        user: {
          select: {
            employee: true
          }
        },
        report: true
      }
     })
     return result;
  });
  const totalCount = record.length;

  return <TeamReportPage
        data={record}
        total={totalCount}
        page={page}
        pageSize={pageSize}
      />;
}
