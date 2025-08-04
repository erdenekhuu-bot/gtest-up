"use server";
import { prisma } from "@/util/prisma";
import { filterDepartment } from "./usable";
import * as v from "valibot";
import { DocumentStateEnum } from "@prisma/client";
import { DocumentSchema } from "@/lib/validation";
import { SecondActionSchema } from "@/lib/validation";
import { ThirdActionSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { Checking, filterEmployeeStat, filterEmployee } from "./usable";

export async function CreateDocument(data: any) {
  try {
    const validate = v.safeParse(DocumentSchema, data);
    if (!validate.success) {
      console.log(validate);
      return 0;
    }
    const record = await prisma.$transaction(async (tx) => {
      const authuser = await tx.authUser.findUnique({
        where: {
          id: data.authuserId,
        },
        include: {
          employee: {
            include: {
              department: true,
            },
          },
        },
      });
      const initials = filterDepartment(authuser?.employee?.department?.name);
      const numbering = "-ТӨ-" + initials;
      const lastdocument = await tx.document.findFirst({
        orderBy: {
          generate: "desc",
        },
      });
      const lastNumber = lastdocument?.generate
        ? parseInt(lastdocument.generate.replace(numbering, ""), 10)
        : 0;
      const generate = String(lastNumber + 1).padStart(3, "0") + numbering;
      const result = await tx.document.create({
        data: {
          authUserId: authuser?.id,
          userDataId: authuser?.id,
          generate,
          state: DocumentStateEnum.DENY,
          title: data.title,
          detail: {
            create: {
              intro: data.intro,
              aim: data.aim,
            },
          },
          departmentEmployeeRole: {
            createMany: {
              data: data.departmentemployee,
            },
          },
        },
      });
      return result;
    });

    return record.id;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function SecondAction(data: any) {
  try {
    const validate = v.safeParse(SecondActionSchema, data);
    if (!validate.success) {
      console.log(validate);
      return 0;
    }

    const customrelation = data.testteam
      .map((item: any) => {
        if (item.role === "Хяналт тавих, Асуудал шийдвэрлэх") {
          return { ...item, role: "VIEWER" };
        }
        return null;
      })
      .filter((item: any) => item !== null);

    const bankData = {
      name: data.bank.bankname,
      address: data.bank.bank,
    };

    await prisma.$transaction(async (tx) => {
      await tx.document.update({
        where: {
          id: Number(data.documentid),
        },
        data: {
          documentemployee: {
            createMany: {
              data: data.testteam,
            },
          },
          departmentEmployeeRole: {
            createMany: {
              data: customrelation,
            },
          },
          attribute: {
            createMany: {
              data: data.attributeData,
            },
          },
          budget: {
            createMany: {
              data: data.budgetdata,
            },
          },
          riskassessment: {
            createMany: {
              data: data.riskdata,
            },
          },
          bank: bankData as Prisma.JsonObject,
          isFull: 1,
        },
      });
    });
    return 1;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function ThirdAction(data: any) {
  try {
    const validate = v.safeParse(ThirdActionSchema, data);
    if (!validate.success) {
      console.log(validate);
      return 0;
    }
    await prisma.document.update({
      where: {
        id: Number(data.documentid),
      },
      data: {
        testcase: {
          createMany: {
            data: data.testcase,
          },
        },
        isFull: 2,
      },
    });
    return 1;
  } catch (error) {
    return -1;
  }
}

export async function FullUpdateDocument(data: any) {
  try {
    const mhn = await Promise.all(
      data.departmentemployee.map(async (item: any) => {
        return {
          employeeId: await filterEmployeeStat(item.employeeId),
          role: item.role,
        };
      })
    );
    await prisma.$transaction(async (tx) => {
      const authuser = await tx.authUser.findUnique({
        where: {
          id: data.authuserId,
        },
        include: {
          employee: {
            include: {
              department: true,
            },
          },
        },
      });
      const initials = filterDepartment(authuser?.employee?.department?.name);
      const numbering = "-ТӨ-" + initials;
      const lastDocument = await tx.document.findFirst({
        orderBy: { generate: "desc" },
      });
      const lastNumber = lastDocument?.generate
        ? parseInt(lastDocument.generate.replace(numbering, ""), 10)
        : 0;

      const generate = String(lastNumber + 1).padStart(3, "0") + numbering;
      await tx.departmentEmployeeRole.deleteMany({
        where: { documentId: data.documentId },
      });
      await tx.documentDetail.deleteMany({
        where: { documentId: data.documentId },
      });
      const doc = await tx.document.update({
        where: { id: data.documentId },
        data: {
          authUserId: data.authuserId,
          userDataId: data.authuserId,
          generate,
          state: DocumentStateEnum.DENY,
          title: data.title,
          detail: {
            create: {
              intro: data.intro,
              aim: data.aim,
            },
          },
          departmentEmployeeRole: {
            createMany: {
              data: mhn,
            },
          },
        },
      });
      return doc;
    });
    return 1;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function ShareGR(data: any) {
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.authUser.findUnique({
        where: {
          id: data.authuser,
        },
        select: {
          employee: true,
        },
      });
      const userEntry = {
        employeeId: user?.employee?.id,
        documentId: data.documentid,
      };

      const merge = [
        ...data.sharegroup.map((item: any) => ({
          employeeId: item.employeeId,
          documentId: item.documentId,
        })),
        userEntry,
      ];

      const document = await tx.shareGroup.findFirst({
        where: {
          documentId: data.documentid,
        },
      });
      if (!document) {
        await tx.shareGroup.createMany({
          data: merge,
        });
      }
      await tx.shareGroup.deleteMany({
        where: {
          documentId: data.documentid,
        },
      });
      await tx.shareGroup.createMany({
        data: merge,
      });
      await tx.document.update({
        where: {
          id: data.documentid,
        },
        data: {
          state: Checking(data.share),
        },
      });
    });
    return 1;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

export async function EditShareGRP(data: any) {
  try {
    const processedItems = await Promise.all(
      data.sharegroup.map(async (item: any) => {
        const employeeId =
          typeof item.employeeId === "number"
            ? item.employeeId
            : await filterEmployee(item.employeeId);

        return {
          employeeId: employeeId,
          documentId: item.documentId,
        };
      })
    );
    await prisma.$transaction(async (tx) => {
      const document = await tx.shareGroup.findFirst({
        where: {
          documentId: data.documentid,
        },
      });
      if (!document) {
        await tx.shareGroup.createMany({
          data: processedItems,
        });
      }
      await tx.shareGroup.deleteMany({
        where: {
          documentId: data.documentid,
        },
      });
      await tx.shareGroup.createMany({
        data: processedItems,
      });
      await tx.document.update({
        where: {
          id: data.documentid,
        },
        data: {
          state: Checking(data.share),
        },
      });
    });

    return 1;
  } catch (error) {
    return -1;
  }
}

export async function Report(data: any) {
  try {
    await prisma.$transaction(async (tx) => {
      console.log(data);
    });
    return 1;
  } catch (error) {
    return -1;
  }
}

export async function DeleteAll(data: any[]) {
  try {
    for (const item of data) {
      await prisma.document.delete({
        where: { id: Number(item) },
      });
    }
    return 1;
  } catch (error) {
    console.log(error);
    return -1;
  }
}
