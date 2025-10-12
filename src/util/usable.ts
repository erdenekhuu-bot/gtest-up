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
export const convertAdmin = (data: any[])=>{
  const converting = data.map((index:any, key:number)=>{
     return {
      id: key,
      value: index.id,
      label: index.name,
    };
  })
  return converting
}
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

