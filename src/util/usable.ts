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

export const convertName = (arg: any) => {
  return arg?.lastname[0] + "." + arg?.firstname;
};

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

export const selectConvert = (arg: number) => {
  switch (arg) {
    case 1:
      return "HIGH";
    case 2:
      return "MEDIUM";
    case 3:
      return "LOW";
    default:
      return "LOW";
  }
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
      return "Хянагдсан";
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

export const formatHumanReadable = (arg: string) => {
  return (
    arg.substring(0, 4) + "/" + arg.substring(5, 7) + "/" + arg.substring(8, 10)
  );
};

export const filterEmployee = async (id: any): Promise<number | undefined> => {
  if (typeof id !== "string" || id.split(" ").length < 2) {
    return undefined;
  }

  try {
    const result = await prisma.employee.findFirst({
      where: {
        AND: [{ firstname: id.split(" ")[0] }, { lastname: id.split(" ")[1] }],
      },
      select: {
        id: true,
      },
    });

    if (!result) {
      return undefined;
    }

    return result.id;
  } catch (error) {
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
