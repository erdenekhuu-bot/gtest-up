import { prisma } from "@/util/prisma";
import { EditPage } from "@/components/window/document/editpage/Editing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ edit: string }>;
}) {
  const { edit } = await params;
  const session = await getServerSession(authOptions);
  const authuser = await prisma.authUser.findUnique({
    where: {
      id: Number(session?.user.id),
    },
    include: {
      employee: {
        include: {
          department: true,
        },
      },
    },
  });

  const record = await prisma.$transaction(async (tx) => {
    const data = await prisma.document.findUnique({
      where: {
        id: Number(edit),
      },
      include: {
        documentemployee: {
          distinct: ["employeeId"],
          select: {
            employee: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                jobPosition: true,
                department: true,
              },
            },
            role: true,
            startedDate: true,
            endDate: true,
          },
        },
        departmentEmployeeRole: {
          distinct: ["employeeId"],
          where: {
            role: {
              not: "MIDDLE",
            },
          },
          orderBy: {
            permissionLvl: "asc",
          },
          select: {
            employee: {
              include: {
                jobPosition: true,
                department: true,
                authUser: true,
              },
            },
            role: true,
            state: true,
            startedDate: true,
            endDate: true,
          },
        },
        attribute: true,
        detail: true,
        riskassessment: true,
        testcase: {
          orderBy: {
            id: "asc",
          },
          include: {
            testCaseImage: true,
          },
        },
        budget: true,
        file: true,
        report: {
          include: {
            budget: true,
            issue: true,
            team: true,
            testcase: true,
            file: true,
            usedphone: true,
          },
        },
      },
    });

    const steps = await prisma.$queryRaw`
        SELECT json_agg(
            json_build_object(
              'documentId', dep."documentId",
              'id', dep.id,
              'role', dep.role,
              'rode', dep.rode,
              'employee', json_build_object(
                'firstname', emp.firstname,
                'lastname', emp.lastname
              ),
              'jobPosition', job.name,
              'state', dep.state,
              'authUser', authUser.id,
            'startedDate', dep.time_created,
              'permission_level_category', 
              CASE 
                  WHEN emp.firstname = 'Ууганбаяр' THEN 1
                  WHEN jobgroup.job_auth_rank = 6 THEN 6
                  WHEN jobgroup.job_auth_rank = 4 THEN 4
                  WHEN jobgroup.job_auth_rank = 2 THEN 2
                  ELSE 0
              END
            )
            ORDER BY 
              CASE 
                  WHEN emp.firstname = 'Ууганбаяр' THEN 1
                  WHEN jobgroup.job_auth_rank = 6 THEN 6
                  WHEN jobgroup.job_auth_rank = 4 THEN 4
                  WHEN jobgroup.job_auth_rank = 2 THEN 2
                  ELSE 0
              END DESC
          ) AS result
          FROM (
            SELECT DISTINCT ON (dep.employee_id) 
              dep."documentId",
              dep.id,
              dep.role,
              dep.rode,
              dep.employee_id,
              dep.state,
              dep.time_created
            FROM public."DepartmentEmployeeRole" AS dep
            WHERE dep."documentId" = ${Number(edit)}
          ) AS dep
          LEFT JOIN public."Employee" AS emp ON emp.id = dep.employee_id
          LEFT JOIN public."JobPosition" AS job ON job.id = emp.job_position_id
          LEFT JOIN public."JobPositionGroup" AS jobgroup ON jobgroup.id = job."jobGroupId"
          LEFT JOIN public."AuthUser" AS authUser ON authUser.id = emp.auth_user_id
        WHERE dep."documentId" = ${Number(edit)};
    `;

    return {
      data,
      steps,
    };
  });

  return <EditPage document={record.data} id={edit} steps={record.steps} />;
}
