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
  const offset = (page - 1) * pageSize;

  const record: any = await prisma.$queryRaw`
    SELECT 
      JSON_BUILD_OBJECT(
        'id', d.id,
        'title', d.title,
        'timeCreated', d."timeCreated",
        'confirmation_id', cp.id,
        'check_status', cp.check
      ) as result
    FROM "Document" d
        INNER JOIN (
          SELECT DISTINCT ON ("documentId") *
          FROM "ConfirmPaper"
          ORDER BY "documentId", "startedDate" DESC
        ) cp ON cp."documentId" = d.id
        WHERE d."isDeleted" = false
        ORDER BY d."timeCreated" DESC
        LIMIT ${pageSize} OFFSET ${offset}
  `;

  const totalCount: any = await prisma.$queryRaw`
    SELECT COUNT(DISTINCT d.id) as total
    FROM "Document" d
    INNER JOIN "ConfirmPaper" cp ON cp."documentId" = d.id
    WHERE d."isDeleted" = false
  `;

  const data = record.map((item: any) => item.result);
  const total = Number(totalCount[0]?.total) || 0;
  return (
    <TeamPaperPage data={data} total={total} page={page} pageSize={pageSize} />
  );
}
