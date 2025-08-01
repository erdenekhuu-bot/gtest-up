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

  const record = await prisma.document.findMany({
    where: {
      authUserId: Number(session?.user.id),
    },
    include: {
      detail: true,
    },
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
