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
  const isAdmin = session?.user.employee.super === "ADMIN";

  const record = await prisma.$transaction(async (tx) => {
    const user = await tx.authUser.findUnique({
      where: { id: Number(session?.user.id) },
      select: {
        employee: true,
      },
    });
    const confirm = await tx.confirmPaper.findMany({
      where: {
        ...(isAdmin ? {} : { employeeId: user?.employee?.id }),
      },
      distinct: ["documentId"],
      orderBy: {
        id: "asc",
      },
      include: {
        document: {
          include: {
            detail: true,
          },
        },
      },
    });
    return confirm;
  });
  const totalCount = record.length;

  return (
    <PaperDocument
      data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
