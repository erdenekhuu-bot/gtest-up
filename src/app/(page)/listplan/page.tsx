"use server";
import { ListPage } from "@/components/page/listpage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/util/prisma";

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
  const offset = (page - 1) * pageSize;

  const data = await prisma.authUser.findUnique({
      where: {
        id: Number(session?.user.id),
      },
      include: {
        employee: true,
      },
    });

  const record:any = await prisma.$queryRaw`
          SELECT  emp.id,
                  emp.firstname,
                  jpg."job_auth_rank",
                  doc.id,
                  doc.generate,
                  doc.title,
                  doc.state,
                  useremployee.firstname,
                  doc."timeCreated",
                  der.rode
          FROM public."Employee" AS emp 
                        JOIN "JobPosition"  AS jp ON emp."job_position_id" = jp.id
                        JOIN "JobPositionGroup" AS jpg ON jp."jobGroupId" = jpg.id
                        JOIN "DepartmentEmployeeRole" AS der ON der."employee_id" = emp.id
                        JOIN "Document" AS doc ON doc.id = der."documentId"
                        JOIN "AuthUser" AS authuser ON authuser.id = doc."authUserId"
                        JOIN "Employee" useremployee ON authuser.id = useremployee.auth_user_id
          WHERE emp."is_deleted" = false AND emp.id = ${data?.employee?.id} AND doc.state = 'FORWARD'
              AND (
                    (jpg."job_auth_rank" = 2)
                          OR (jpg."job_auth_rank" = 4 AND NOT EXISTS (
                                  SELECT 1 
                                  FROM "DepartmentEmployeeRole" AS der2
                                  JOIN "Employee" AS e2 ON der2."employee_id" = e2.id
                                  JOIN "JobPosition" AS jp2 ON e2."job_position_id" = jp2.id
                                  JOIN "JobPositionGroup" AS jpg2 ON jp2."jobGroupId" = jpg2.id
                                  WHERE der2."documentId" = der."documentId"
                                    AND jpg2."job_auth_rank" = 2
                                    AND der2.rode = false
                              ))
                          OR 
                              (jpg."job_auth_rank" = 6 AND NOT EXISTS (
                                    SELECT 1 
                                    FROM "DepartmentEmployeeRole" AS der2
                                    JOIN "Employee" AS e2 ON der2."employee_id" = e2.id
                                    JOIN "JobPosition" AS jp2 ON e2."job_position_id" = jp2.id
                                    JOIN "JobPositionGroup" AS jpg2 ON jp2."jobGroupId" = jpg2.id
                                    WHERE der2."documentId" = der."documentId"
                                      AND jpg2."job_auth_rank" IN (2,4)
                                      AND der2.rode = false
                                ))
                    )
            ORDER BY doc."timeCreated" DESC
            LIMIT ${pageSize} OFFSET ${offset}
                    

  `;
  const totalCount = record.length > 0 ? Number(record[0].total_count) : 0;

    return (
    <ListPage
      data={record}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
