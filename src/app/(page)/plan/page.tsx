import { prisma } from "@/util/prisma";
import { PlanPage } from "@/components/page/planpage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mainquery, primequery } from "@/util/usable";

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
  const userId = session?.user.employee.id;
  const checkout = Number(
    session?.user.employee.jobPosition?.jobPositionGroup?.jobAuthRank
  );
  const record: any =
    checkout >= 2
      ? await primequery(Number(userId), pageSize, page)
      : await mainquery(Number(userId), pageSize, page);
  const totalCount = (await prisma.$queryRaw`
    SELECT COUNT(*)::int AS total
      FROM public."Document" AS doc
        LEFT JOIN public."AuthUser" AS authuser ON authuser.id = doc."authUserId"
      WHERE authuser.id = ${userId};
    `) as number;
  return (
    <PlanPage 
      data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
