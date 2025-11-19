"use server";
import { prisma } from "@/util/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PaperDocument } from "@/components/window/paperdocument";

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
  const isAdmin = session?.user.employee.super === "REPORT";
  const hasEdit = session?.user.employee.permission[0].kind.includes("EDIT");
  const user = await prisma.authUser.findUnique({
    where: { id: Number(session?.user.id) },
    select: {
      employee: true,
    },
  });

  const confirm = await prisma.confirmPaper.findMany({
    where:
      hasEdit || isAdmin
        ? {}
        : {
            employeeId: user?.employee?.id,
          },
    orderBy: {
      id: "asc",
    },
    ...(hasEdit || (isAdmin && { distinct: ["documentId"] })),
    include: {
      document: {
        include: {
          detail: true,
        },
      },
    },
  });
  const totalCount = confirm.length;
  
  return (
    <PaperDocument
      data={confirm}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
