import { prisma } from "@/util/prisma";
import { SuperComponent } from "@/components/admin/super";

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

  const record = await prisma.employee.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      AND: [
        {
          isDeleted: false,
        },
        {
          firstname: {
            contains: search || "",
          },
        },
      ],
    },
    include: {
      jobPosition: true,
      department: true,
    },
  });
  const totalCount = await prisma.employee.count();
  return (
    <SuperComponent
      data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
