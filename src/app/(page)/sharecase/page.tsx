import { prisma } from "@/util/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DocumentStateEnum } from "@prisma/client";
import { AllShareTestCase } from "@/components/window/share/AllShareTestCase";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 10;
  const isAdmin = session?.user.employee.super === "ADMIN";
  const authUser = await prisma.authUser.findUnique({
    where: {
      id: Number(session?.user.id),
    },
    include: {
      employee: true,
    },
  });

  const record = await prisma.$transaction(async (tx) => {
    const document =
      authUser &&
      (await tx.shareGroup.findMany({
        where: {
          document: {
            departmentEmployeeRole: {
              every: {
                state: DocumentStateEnum.ACCESS,
              },
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        distinct: ["documentId"],
        include: {
          employee: true,
          document: {
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
              file: true,
              report: true,
              departmentEmployeeRole: true,
            },
          },
        },
      }));
    return document;
  });
  const totalCount = await prisma.shareGroup.count({
    where: {
      employeeId: Number(authUser?.employee?.id),
    },
  });

  return (
    <AllShareTestCase
      data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
