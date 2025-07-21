import { object, string, number, array } from "valibot";

export const DocumentSchema = object({
  title: string(),
  departmentemployee: array(
    object({
      employeeId: number(),
      role: string(),
    })
  ),
  aim: string(),
  intro: string(),
  authuserId: number(),
});

export const SecondActionSchema = object({
  testteam: array(
    object({
      employeeId: number(),
      role: string(),
      startedDate: string(),
      endDate: string(),
    })
  ),
  riskdata: array(
    object({
      riskDescription: string(),
      riskLevel: string(),
      affectionLevel: string(),
      mitigationStrategy: string(),
    })
  ),
  attributeData: array(
    object({
      categoryMain: string(),
      category: string(),
      value: string(),
    })
  ),
  budgetdata: array(
    object({
      productCategory: string(),
      product: string(),
      amount: number(),
      priceUnit: number(),
      priceTotal: number(),
    })
  ),
  bank: object({
    bankname: string(),
    bank: string(),
  }),
  documentid: number(),
});

export const ThirdActionSchema = object({
  testcase: array(
    object({
      category: string(),
      types: string(),
      steps: string(),
      result: string(),
      division: string(),
    })
  ),
  documentid: number(),
});
