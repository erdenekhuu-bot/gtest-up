"use server";
import { prisma } from "@/util/prisma";
import { TeamPaperPage } from "@/components/page/teampaperpage";

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

  const record = await prisma.$transaction(async (tx) => {
    const result = await tx.document.findMany({
      where: {
        confirm: {
          some: {},
        },
      },
      include: {
        confirm: {
          include: {
            sub: true,
          },
        },
      },
    });
    return result;
  });


  const totalCount = record.length;
  return (
    <TeamPaperPage
      data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
