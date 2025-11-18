import { prisma } from "@/util/prisma";
import { DocumentStateEnum } from "@prisma/client";

export const convertUtil = (data: any[]) => {
  const converting = data.map((index: any, key: number) => {
    return {
      id: key,
      value: index.id,
      label: `${convertName(index)}`,
    };
  });
  return converting;
};
export const convertAdmin = (data: any[]) => {
  const converting = data.map((index: any, key: number) => {
    return {
      id: key,
      value: index.id,
      label: index.name,
    };
  });
  return converting;
};
export const convertName = (arg: any) => {
  return arg?.lastname[0] + "." + arg?.firstname;
};
export const someConvertName = (arg: string) => {
  const parts = arg.split(" ");
  if (parts.length >= 2) {
    return toInitialName([parts[1], parts[0]]);
  }
  return arg;
};
function toInitialName([first, last]: [string, string]): string {
  return `${first[0]}.${last}`;
}
export const capitalizeFirstLetter = (arg: any) => {
  return arg.charAt(0).toUpperCase() + arg.slice(1);
};
export const filterEmployeeStat = async (name: any): Promise<any> => {
  try {
    const { value } = name;
    return value;
  } catch (error) {
    return undefined;
  }
};
export const removeDepartment = (data: any) => {
  if (data && Array.isArray(data.departmentemployee)) {
    data.departmentemployee = data.departmentemployee.map((item: any) => {
      if (item.department) {
        const { department, ...rest } = item;
        return rest;
      }
      return item;
    });
  }
  return data;
};
export const filterDepartment = (department: any) => {
  return department
    .split(" ")
    .map((word: string) => word[0].toUpperCase())
    .join("");
};
export function Checking(arg: any) {
  switch (arg) {
    case 0:
      return "DENY";
    case 1:
      return "PENDING";
    case 2:
      return "FORWARD";
    case 3:
      return "ACCESS";
    case 4:
      return "SHARED";
    default:
      return "DENY";
  }
}
export const mongollabel = (label: string) => {
  switch (label) {
    case "ACCESS":
      return "Зөвшөөрөгдсөн";
    case "DENY":
      return "Буцаагдсан";
    case "FORWARD":
      return "Уншсан";
    case "wait":
      return "Бүрэн бус";
    case "finish":
      return "Дууссан";
    case "CREATED":
      return "Үүссэн";
    case "STARTED":
      return "Эхэлсэн";
    case "ENDED":
      return "Дууссан";
    case "ACCESSER":
      return "Тестийн төсвийг хянан баталгаажуулах";
    case "VIEWER":
      return "Баримт бичгийг хянан баталгаажуулах";
    case "PERPAID":
      return "Урьдчилсан төлбөрт";
    case "POSTPAID":
      return "Дараа төлбөрт";

    default:
      return "Хянаагүй";
  }
};
export const papercheck = (arg: boolean) => {
  switch (arg) {
    case true:
      return "Шалгагдсан";
    default:
      return "Шалгагдаагүй";
  }
};
export const formatHumanReadable = (arg: string) => {
  return (
    arg.substring(0, 4) + "/" + arg.substring(5, 7) + "/" + arg.substring(8, 10)
  );
};
export const filterEmployee = async (id: any): Promise<number | undefined> => {
  if (typeof id !== "string") return undefined;

  const names = id.trim().split(/\s+/);
  if (names.length < 2) return undefined;

  try {
    const result = await prisma.employee.findFirst({
      where: {
        AND: [
          { firstname: { equals: names[0], mode: "insensitive" } },
          { lastname: { equals: names[1], mode: "insensitive" } },
        ],
      },
      select: { id: true },
    });

    return result?.id;
  } catch (error) {
    console.error("Error filtering employee:", error);
    return undefined;
  }
};
export const subLetter = (arg: string) => {
  return arg.substring(0, 2).toUpperCase();
};
export function MiddleCheck(arg: any) {
  switch (arg) {
    case 1:
      return DocumentStateEnum.MIDDLE;
    case 2:
      return DocumentStateEnum.ACCESS;
    default:
      return DocumentStateEnum.FORWARD;
  }
}
export const convertStatus = (arg: string) => {
  switch (arg) {
    case "HIGH":
      return "warning";
    case "MEDIUM":
      return "processing";
    default:
      return "success";
  }
};
export const mergeLetter = (letter: any) => {
  return letter?.firstname.substring(0, 1) + letter?.lastname.substring(0, 1);
};
export const parseLocaleNumber = (value: any): number => {
  return Number(String(value).replace(/[.\s]/g, ""));
};
export const parseGermanNumber = (str: string): number => {
  return parseFloat(str.replace(/\./g, "").replace(",", "."));
};

export const mainquery = async (id: number, pageSize: number, page: number) => {
  const result = await prisma.$queryRaw`
            SELECT json_build_object(
                'id', doc.id,
                'generate', doc.generate,
                'title', doc.title,
                'employee', emp.firstname,
                'timeCreated', doc."timeCreated",
                'state', doc.state,
                'papers', COALESCE(
                  json_agg(
                    DISTINCT jsonb_build_object(
                      'id', confirm.id
                    )
                  ) FILTER (WHERE confirm.id IS NOT NULL),
                  '[]'::json
                ),
                'departmentRoles', COALESCE(
                  json_agg(
                    DISTINCT jsonb_build_object(
                      'id', dep.id,
                      'role', dep.role,
                      'state', dep.state
                    )
                  ) FILTER (WHERE dep.id IS NOT NULL),
                  '[]'::json
                )
              ) AS data
            FROM public."Document" AS doc
                LEFT JOIN public."AuthUser" AS authuser ON authuser.id = doc."authUserId"
                LEFT JOIN public."Employee" AS emp ON emp."auth_user_id" = authuser.id
                LEFT JOIN public."ConfirmPaper" AS confirm ON confirm."documentId" = doc.id
                LEFT JOIN public."DepartmentEmployeeRole" AS dep ON dep."documentId" = doc.id
            WHERE emp.id = ${id}
            GROUP BY doc.id, emp.firstname, doc.generate, doc.title,doc.state
            LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize};
          `;
  return result;
};

export const primequery = async (
  id: number,
  pageSize: number,
  page: number
) => {
  const result = await prisma.$queryRaw`
        SELECT json_build_object(
              'id', doc.id,
              'generate', doc.generate,
              'title', doc.title,
              'state', doc.state,
              'employee', useremployee.firstname,
              'job_auth_rank', jpg."job_auth_rank",
              'timeCreated', doc."timeCreated",
              'papers', COALESCE(
                  json_agg(
                      DISTINCT jsonb_build_object(
                          'id', confirm.id
                      )
                  ) FILTER (WHERE confirm.id IS NOT NULL),
                  '[]'::json
              ),
              'departmentRoles', COALESCE(
                  json_agg(
                      DISTINCT jsonb_build_object(
                          'id', der.id,
                          'role', der.rode,
                          'state', der.state
                      )
                  ) FILTER (WHERE der.id IS NOT NULL),
                  '[]'::json
              )
          ) AS data
          FROM public."Employee" AS emp
          JOIN "JobPosition" AS jp ON emp."job_position_id" = jp.id
          JOIN "JobPositionGroup" AS jpg ON jp."jobGroupId" = jpg.id
          JOIN "Document" AS doc ON doc.id IN (
              SELECT DISTINCT "documentId" 
              FROM "DepartmentEmployeeRole" 
              WHERE "employee_id" = emp.id
          )
          JOIN "AuthUser" AS authuser ON authuser.id = doc."authUserId"
          JOIN "Employee" AS useremployee ON useremployee.auth_user_id = authuser.id
          LEFT JOIN "DepartmentEmployeeRole" AS der ON der."documentId" = doc.id
          LEFT JOIN "ConfirmPaper" AS confirm ON confirm."documentId" = doc.id
          WHERE emp."is_deleted" = false
              AND emp.id = ${id}
              AND doc.state = 'FORWARD'
              AND (
                  jpg."job_auth_rank" = 2
                  OR (
                      jpg."job_auth_rank" = 4 AND NOT EXISTS (
                          SELECT 1
                          FROM "DepartmentEmployeeRole" AS der2
                          JOIN "Employee" AS e2 ON der2."employee_id" = e2.id
                          JOIN "JobPosition" AS jp2 ON e2."job_position_id" = jp2.id
                          JOIN "JobPositionGroup" AS jpg2 ON jp2."jobGroupId" = jpg2.id
                          WHERE der2."documentId" = doc.id AND jpg2."job_auth_rank" = 2 AND der2.rode = false
                      )
                  )
                  OR (
                      jpg."job_auth_rank" = 6 AND NOT EXISTS (
                          SELECT 1
                          FROM "DepartmentEmployeeRole" AS der2
                          JOIN "Employee" AS e2 ON der2."employee_id" = e2.id
                          JOIN "JobPosition" AS jp2 ON e2."job_position_id" = jp2.id
                          JOIN "JobPositionGroup" AS jpg2 ON jp2."jobGroupId" = jpg2.id
                          WHERE der2."documentId" = doc.id AND jpg2."job_auth_rank" IN (2, 4) AND der2.rode = false
                      )
                  )
              )
          GROUP BY
              doc.id, emp.firstname, doc.generate, doc.title, doc.state,
              jpg."job_auth_rank", useremployee.firstname, doc."timeCreated"
            `;
  return result;
};
