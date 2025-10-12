import { prisma } from "@/util/prisma";
import { UsedPhone } from "@/components/page/usedphone";

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

  const record = await prisma.usedPhone.findMany({
    where: {
      phone: {
        contains: search || ""
      }
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  })
  const totalCount = await prisma.usedPhone.count()
  return <UsedPhone data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}/>;
}
