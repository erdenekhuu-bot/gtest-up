"use server";
import { prisma } from "@/util/prisma";
import { filterDepartment, convertName } from "./usable";
import * as v from "valibot";
import { DocumentStateEnum } from "@prisma/client";
import { DocumentSchema } from "@/lib/validation";
import { SecondActionSchema } from "@/lib/validation";
import { ThirdActionSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { Checking, filterEmployee } from "./usable";

function stripId(arr: any[]): any[] {
  return arr.map(({ id, ...rest }) => rest);
}

export async function CreateDocument(data: any) {
  try {
    // const validate = v.safeParse(DocumentSchema, data);
    // if (!validate.success) {
    //   return 0;
    // }
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
      const boss = await tx.employee.findMany({
        where: {
          AND: [
            {
              departmentId: authuser?.employee?.department.id,
            },
            {
              isDeleted: false,
            },
          ],
        },
        include: {
          jobPosition: {
            select: {
              jobPositionGroup: true,
            },
          },
        },
      });
      boss.sort(
        (a: any, b: any) =>
          b.jobPosition.jobPositionGroup.jobAuthRank -
          a.jobPosition.jobPositionGroup.jobAuthRank
      );
      const bossItem = data.departmentemployee.find(
        (item: any) => item.employeeId === boss[0].id
      );
      if (bossItem) {
        data.departmentemployee = data.departmentemployee.map((item: any) =>
          item.employeeId === bossItem.employeeId
            ? { ...item, permissionLvl: 10 }
            : { ...item, permissionLvl: null }
        );
      }

      const result = await tx.document.create({
        data: {
          authUserId: authuser?.id,
          userDataId: authuser?.id,
          generate: data.generate,
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
    console.error(error);
    return -1;
  }
}

export async function SecondAction(data: any) {
  try {
    const validate = v.safeParse(SecondActionSchema, data);
    if (!validate.success) {
      return 0;
    }
    const customrelation = data.testteam
      .map((item: any) => {
        if (item.role === "Хяналт тавих, Асуудал шийдвэрлэх") {
          return { ...item, role: "MIDDLE" };
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
        where: { id: Number(data.documentid) },
        data: {
          documentemployee: {
            createMany: {
              data: stripId(data.testteam),
            },
          },
          departmentEmployeeRole: {
            createMany: { data: stripId(customrelation) },
          },
          attribute: { createMany: { data: stripId(data.attributeData) } },
          budget: { createMany: { data: stripId(data.budgetdata) } },
          riskassessment: { createMany: { data: stripId(data.riskdata) } },
          bank: bankData as Prisma.JsonObject,
          isFull: 1,
        },
      });
    });

    return 1;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

export async function ThirdAction(data: any) {
  try {
    const validate = v.safeParse(ThirdActionSchema, data);
    if (!validate.success) {
      return 0;
    }

    await prisma.$transaction(async (tx) => {
      await tx.document.update({
        where: {
          id: Number(data.documentid),
        },
        data: {
          testcase: {
            createMany: {
              data: data.testcase,
              skipDuplicates: true,
            },
          },
        },
      });
    });

    return 1;
  } catch (error) {
    console.error(error);
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
          employeeId:
            typeof item.employeeId !== "number"
              ? item.employeeId.value
              : item.employeeId,
          documentId: item.documentId,
        })),
        userEntry,
      ];
      console.log(merge);

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
          state: "SHARED",
        },
      });
    });

    return 1;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

export async function ShareRP(data: any) {
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
        reportId: data.reportId,
      };

      const merge = [
        ...data.sharegroup.map((item: any) => ({
          employeeId: item.employeeId.value,
          reportId: item.reportId,
        })),
        userEntry,
      ];

      const report = await tx.shareReport.findFirst({
        where: {
          reportId: data.reportId,
        },
      });
      if (!report) {
        await tx.shareReport.createMany({
          data: merge,
        });
      }
      await tx.shareReport.deleteMany({
        where: {
          reportId: data.reportId,
        },
      });
      await tx.shareReport.createMany({
        data: merge,
      });
    });
    return 1;
  } catch (e) {
    console.error(e);
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
    console.error(error);
    return -1;
  }
}

export async function Report(datas: any) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.report.deleteMany({
        where: {
          documentId: Number(datas.documentId),
        },
      });

      await tx.report.create({
        data: {
          reportname: datas.reportname || "",
          reportpurpose: datas.reportpurpose || "",
          reportprocessing: datas.reportprocessing,
          document: {
            connect: {
              id: Number(datas.documentId),
            },
          },
          reportadvice: datas.reportadvice,
          reportconclusion: datas.reportconclusion,
          issue: {
            createMany: {
              data: datas.fixed || [],
            },
          },
          usedphone: {
            createMany: {
              data: datas.usedphone || [],
            },
          },
        },
      });
    });
    return 1;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

export async function ReportUpdate(data: any) {
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.authUser.findUnique({
        where: { id: Number(data.userid) },
        include: {
          employee: true,
        },
      });

      const result: any = {
        reportId: data.id,
        employeeId: user?.employee?.id,
      };
      const report = await tx.shareReport.findFirst({
        where: {
          reportId: data.id,
        },
      });
      if (!report) {
        await tx.shareReport.createMany({
          data: result,
        });
      }
      await tx.reportIssue.deleteMany({
        where: { reportId: Number(data.id) },
      });
      await tx.usedPhone.deleteMany({
        where: { reportId: Number(data.id) },
      });
      await tx.report.update({
        where: {
          id: Number(data.id),
        },
        data: {
          reportname: data.values.reportname,
          reportpurpose: data.values.reportpurpose,
          reportprocessing: data.values.reportprocessing,
          reportconclusion: data.values.reportconclusion,
          reportadvice: data.values.reportadvice,
          issue: {
            createMany: {
              data: data.reporttesterror,
            },
          },
          usedphone: {
            createMany: {
              data: data.usedphone,
            },
          },
        },
      });
    });
    return 1;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

export async function FullUpdate(data: any) {
  try {
    const result = data.departmentemployee.map((item: any) => {
      return {
        employeeId:
          typeof item.employeeId !== "number"
            ? item.employeeId.value
            : item.employeeId,
        role: item.role,
      };
    });

    const team = data.testteam.map((item: any) => {
      return {
        employeeId:
          typeof item.employeeId !== "number"
            ? item.employeeId.value
            : item.employeeId,
        role: item.role,
        startedDate: item.startedDate,
        endDate: item.endDate,
      };
    });
    const customrelation = data.testteam
      .map((item: any) => {
        if (item.role === "Хяналт тавих, Асуудал шийдвэрлэх") {
          return {
            employeeId:
              typeof item.employeeId !== "number"
                ? item.employeeId.value
                : item.employeeId,

            role: "MIDDLE",
          };
        }
        return null;
      })
      .filter((item: any) => item !== null);

    const finalMerged = [...result, ...customrelation];

    await prisma.$transaction(async (tx) => {
      await tx.documentAttribute.deleteMany({
        where: { documentId: Number(data.id) },
      });
      await tx.riskAssessment.deleteMany({
        where: { documentId: Number(data.id) },
      });
      await tx.documentBudget.deleteMany({
        where: { documentId: Number(data.id) },
      });
      await tx.testCase.deleteMany({
        where: { documentId: Number(data.id) },
      });
      await tx.departmentEmployeeRole.deleteMany({
        where: { documentId: Number(data.id) },
      });
      await tx.documentEmployee.deleteMany({
        where: { documentId: Number(data.id) },
      });

      await tx.document.update({
        where: { id: Number(data.id) },
        data: {
          title: data.title,
          generate: data.generate,
          bank: {
            name: data.bank.bankname,
            address: data.bank.bank,
          },
          detail: {
            update: {
              where: { documentId: Number(data.id) },
              data: {
                intro: data.intro,
                aim: data.aim,
              },
            },
          },
          departmentEmployeeRole: {
            createMany: {
              data: finalMerged,
            },
          },
          documentemployee: {
            createMany: {
              data: team,
            },
          },
          attribute: {
            createMany: {
              data: data.attributeData,
            },
          },
          riskassessment: {
            createMany: {
              data: data.riskdata,
            },
          },
          budget: {
            createMany: {
              data: data.budgetdata,
            },
          },
          testcase: {
            createMany: {
              data: data.testcase,
              skipDuplicates: true,
            },
          },
        },
      });
    });
    return 1;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

export async function AddTestCase(data: any) {
  try {
    await prisma.document.update({
      where: { id: Number(data.documentid) },
      data: {
        testcase: {
          createMany: {
            data: data.testcase,
            skipDuplicates: true,
          },
        },
      },
    });
    return 1;
  } catch (e) {
    console.error(e);
    return -1;
  }
}

export async function ConfirmDoc(data: any) {
  try {
    const result = data.map((item: any) => {
      return {
        employeeId:
          typeof item.employeeId !== "number"
            ? item.employeeId.value
            : item.employeeId,
        documentId: item.documentId,
        rode: {
          employeeId:
            typeof item.employeeId !== "number"
              ? item.employeeId.value
              : item.employeeId,
          rode: false,
        },
        title: item.title,
      };
    });
    await prisma.$transaction(async (tx) => {
      const document = await tx.confirmPaper.findFirst({
        where: {
          documentId: Number(data[0].documentId),
        },
      });
      if (!document) {
        await tx.confirmPaper.createMany({
          data: result,
        });
      }
      await tx.confirmPaper.deleteMany({
        where: {
          documentId: Number(data[0].documentId),
        },
      });
      await tx.confirmPaper.createMany({
        data: result,
      });
    });

    return 1;
  } catch (error) {
    console.error(error);
    return -1;
  }
}

// export async function ConfirmMember(data: any) {
//   try {
//     await prisma.$transaction(async (tx) => {
//       const confirmId = Number(data.confirmId);

//       // ✅ Find the employee
//       const employee = await tx.employee.findUnique({
//         where: { id: data.employeeId },
//       });
//       if (!employee) throw new Error("Employee not found");

//       // ✅ Ensure the confirm paper exists
//       const paper = await tx.confirmPaper.findUnique({
//         where: { id: confirmId },
//       });
//       if (!paper) throw new Error("ConfirmPaper not found");

//       // ✅ Remove previous confirmSub records linked to this confirm paper
//       await tx.confirmSub.deleteMany({
//         where: { confirmId },
//       });

//       // ✅ Add new confirmSub records (you can loop or expand this as needed)
//       await tx.confirmSub.createMany({
//         data: [
//           {
//             confirmId: paper.id,
//             employeeId: data.employeeId,
//             system: data.system,
//             jobs: data.jobs,
//             module: data.module,
//             version: data.version,
//             description: data.description,
//             title: data.title,
//             check: true,
//           },
//         ],
//       });

//       // ✅ Update confirmPaper with rode info or any other field
//       await tx.confirmPaper.update({
//         where: { id: confirmId },
//         data: {
//           rode: {
//             employee: convertName(employee),
//             rode: true,
//           },
//           check: true, // optional — marks as confirmed
//           title: data.title ?? paper.title, // keep old title if not provided
//         },
//       });
//     });

//     return 1; // success
//   } catch (error) {
//     console.error("ConfirmMember error:", error);
//     return -1;
//   }
// }
export async function ConfirmMember(data: any) {
  try {
    await prisma.$transaction(async (tx) => {
      const confirmId = Number(data.confirmId);

      const employee = await tx.employee.findUnique({
        where: { id: data.employeeId },
      });
      if (!employee) throw new Error("Employee not found");

      const paper = await tx.confirmPaper.findUnique({
        where: { id: confirmId },
      });
      if (!paper) throw new Error("ConfirmPaper not found");

      await tx.confirmSub.create({
        data: {
          confirmId: paper.id,
          employeeId: data.employeeId,
          system: data.system,
          jobs: data.jobs,
          module: data.module,
          version: data.version,
          description: data.description,
          title: data.title,
          check: true,
        },
      });
      await tx.confirmPaper.update({
        where: { id: confirmId },
        data: {
          rode: {
            employee: convertName(employee),
            rode: true,
          },
          check: true,
          title: data.title ?? paper.title,
        },
      });
    });

    return 1;
  } catch (error) {
    console.error("ConfirmMember error:", error);
    return -1;
  }
}

export async function CheckActionPaper(data: any) {
  try {
    await prisma.confirmPaper.update({
      where: { id: data },
      data: {
        check: true,
        sub: {
          updateMany: {
            where: {},
            data: {
              check: true,
            },
          },
        },
      },
    });

    return 1;
  } catch (error) {
    return -1;
  }
}

export async function BossCheckPaper(data: any) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.confirmPaper.updateMany({
        where: {
          documentId: Number(data.documentid),
        },
        data: {
          check: true,
        },
      });
    });
    return 1;
  } catch (error) {
    return -1;
  }
}

export async function RejectAction(data: any) {
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.authUser.findUnique({
        where: {
          id: Number(data.userid),
        },
        include: {
          employee: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
        },
      });
      await tx.rejection.upsert({
        where: {
          documentId: data.documentid,
        },
        update: {
          description: data.values.description,
          employee: {
            employee: convertName(user?.employee),
          } as Prisma.JsonObject,
        },
        create: {
          documentId: data.documentid,
          description: data.values.description,
          employee: {
            employee: convertName(user?.employee),
          } as Prisma.JsonObject,
        },
      });
      await tx.document.update({
        where: {
          id: data.documentid,
        },
        data: {
          state: "DENY",
        },
      });
    });
    return 1;
  } catch (error) {
    return -1;
  }
}

export async function TriggerSuper(employeeId: number) {
  try {
    await prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        super: "REPORT",
      },
    });
    return 1;
  } catch (error) {
    return -1;
  }
}

export async function setAdmin(employeeId: number, status: number) {
  try {
    await prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        super: status === 1 ? "ADMIN" : "VIEWER",
      },
    });
    return 1;
  } catch (e) {
    return -1;
  }
}

export async function ChangeStatus(data: any) {
  try {
    await prisma.employee.update({
      where: {
        id: Number(data.employeeId),
      },
      data: {
        super: data.super,
      },
    });
    return 1;
  } catch (error) {
    console.error("Error updating employee:", error);
    return -1;
  }
}

export async function UpdateCase(data: any) {
  try {
    await prisma.testCase.update({
      where: {
        id: Number(data.caseid),
      },
      data: {
        testType: data.values.testType,
        description: data.values.description,
      },
    });
    return 1;
  } catch (e) {
    console.error(e);
    return -1;
  }
}

export async function DeleteConfirmPaper(id: number) {
  await prisma.confirmPaper.delete({ where: { id } });
}
