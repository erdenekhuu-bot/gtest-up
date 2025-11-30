"use client";

import { Form, message, Input, Button, Flex, Breadcrumb, Layout } from "antd";
import type { FormProps } from "antd";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChildSteps } from "../childform/ChildSteps";
import {
  DepartmentEmployeeRole,
  TestSchedule,
  TestRisk,
  Addition,
  TestBudget,
  TestCase,
} from "../childform/ChildDocument";
import { useEffect } from "react";
import { convertName, parseLocaleNumber } from "../../util/usable";
import { FullUpdate } from "../../util/action";
import { PaperWindow } from "../window/paperwindow";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";

export default function ClientEdit({ document, steps }: any) {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const [mainForm] = Form.useForm();

  const onFinish: FormProps["onFinish"] = async (values) => {
    let attributeData = [
      {
        categoryMain: "Тестийн үе шат",
        category: "Бэлтгэл үе",
        value: values.standby || "",
      },
      {
        categoryMain: "Тестийн үе шат",
        category: "Тестийн гүйцэтгэл",
        value: values.execute || "",
      },
      {
        categoryMain: "Тестийн үе шат",
        category: "Тестийн хаалт",
        value: values.terminate || "",
      },
      {
        categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
        category: "Таамаглал",
        value: values.predict || "",
      },
      {
        categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
        category: "Хараат байдал",
        value: values.dependecy || "",
      },
      {
        categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
        category: "Нэмэлт",
        value: values.adding || "",
      },
    ];

    const testteam = (values.testschedule || []).map((item: any) => ({
      employeeId: item.employeeId,
      role: item.role,
      startedDate: dayjs(item.startedDate).format("YYYY-MM-DDTHH:mm:ssZ"),
      endDate: dayjs(item.endDate).format("YYYY-MM-DDTHH:mm:ssZ"),
      authUserId: session?.user.id,
    }));

    const bank = {
      bankname: values.bankname || "",
      bank: values.bank || "",
    };
    const addition = (values.attribute || []).map((item: any) => {
      return {
        categoryMain: "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур",
        category: item.category,
        value: item.value,
      };
    });
    addition.forEach((item: any) => {
      attributeData.push(item);
    });
    const riskdata = (values.testrisk || []).map((item: any) => {
      return {
        affectionLevel: item.affectionLevel,
        mitigationStrategy: item.mitigationStrategy,
        riskDescription: item.riskDescription,
        riskLevel: item.riskLevel,
      };
    });
    const budgetdata = (values.testbudget || []).map((item: any) => ({
      productCategory: item.productCategory,
      product: String(item.product),
      priceUnit: parseLocaleNumber(item.priceUnit),
      priceTotal: parseLocaleNumber(item.priceTotal),
      amount: parseLocaleNumber(item.amount),
    }));

    const testcase = (values.testcase || []).map((item: any) => {
      return {
        category: item.category,
        division: item.division,
        result: item.result,
        steps: item.steps,
        types: item.types,
      };
    });
    const documentId = Number(document.id);
    const merge = {
      ...values,
      riskdata,
      attributeData,
      testcase,
      budgetdata,
      bank,
      testteam,
      authuserId: Number(session?.user.id),
      documentId,
    };
    const update = await FullUpdate(merge);
    if (update > 0) {
      messageApi.success("Амжилттай засагдсан");
    } else {
      messageApi.error("Алдаа гарлаа");
    }
  };
  const updatedData = document.departmentEmployeeRole.map((data: any) => ({
    key: uuidv4(),
    id: data.employee?.id,
    department: data.employee?.department?.name || "",
    employee: convertName(data.employee),
    jobPosition: data.employee?.jobPosition?.name || "",
    role: data.role,
  }));
  const scheduleData = document.documentemployee.map((data: any) => {
    const startedDate =
      data.startedDate && dayjs(data.startedDate, dateFormat)
        ? data.startedDate
        : "";
    const endDate =
      data.endDate && dayjs(data.endDate, dateFormat) ? data.endDate : "";
    return {
      key: uuidv4(),
      id: data.employee.id,
      employee: convertName(data.employee),
      role: data.role || "",
      startedDate,
      endDate,
    };
  });
  const riskData = document.riskassessment.map((data: any) => ({
    key: uuidv4(),
    id: data.id,
    riskDescription: data.riskDescription || "",
    riskLevel: data.riskLevel || "",
    affectionLevel: data.affectionLevel || "",
    mitigationStrategy: data.mitigationStrategy || "",
  }));

  const budgetData = document.budget.map((data: any) => ({
    key: uuidv4(),
    id: Number(data.id),
    productCategory: data.productCategory || "",
    product: data.product || "",
    amount: data.amount || 0,
    priceUnit: data.priceUnit || 0,
    priceTotal: data.priceTotal || 0,
  }));

  const caseData = document.testcase.map((testCase: any) => ({
    key: uuidv4(),
    id: testCase.id,
    category: testCase.category || "",
    types: testCase.types || "",
    steps: testCase.steps || "",
    result: testCase.result || "",
    division: testCase.division || "",
  }));
  useEffect(() => {
    mainForm.setFieldsValue({
      aim: document.detail.aim,
      intro: document.detail.intro,
      departmentemployee: updatedData.map((item: any) => ({
        employeeId: { value: item.id, label: item.employee },
        jobposition: item.jobPosition,
        department: item.department,
        role: item.role,
      })),
      testschedule: scheduleData.map((item: any) => ({
        employeeId: { value: item.id, label: item.employee },
        role: item.role,
        startedDate: item.startedDate ? dayjs(item.startedDate) : null,
        endDate: item.endDate ? dayjs(item.endDate) : null,
      })),
      predict:
        document.attribute.find((attr: any) => attr.category === "Таамаглал")
          ?.value || "",
      dependecy:
        document.attribute.find(
          (attr: any) => attr.category === "Хараат байдал"
        )?.value || "",
      standby:
        document.attribute.find((attr: any) => attr.category === "Бэлтгэл үе")
          ?.value || "",
      execute:
        document.attribute.find(
          (attr: any) => attr.category === "Тестийн гүйцэтгэл"
        )?.value || "",
      terminate:
        document.attribute.find(
          (attr: any) => attr.category === "Тестийн хаалт"
        )?.value || "",
      adding:
        document.attribute.find((attr: any) => attr.category === "Нэмэлт")
          ?.value || "",
      bankname: document.bank?.name,
      bank: document.bank?.address,
      testrisk: riskData,
      testbudget: budgetData,
      testcase: caseData,
      attribute: document.attribute.filter(
        (attr: any) =>
          attr.categoryMain === "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур"
      ),
    });
  }, [document.id]);
  return (
    <Layout>
      <Layout.Content style={{ background: "white" }}>
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[
            {
              title: (
                <span
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => redirect("/plan")}
                >
                  Үндсэн хуудас руу буцах
                </span>
              ),
            },
            {
              title: "Төлөвлөгөө засварлах хуудас",
            },
          ]}
        />
        {contextHolder}
        <Form form={mainForm} onFinish={onFinish} initialValues={document}>
          <div className="mt-4">
            <p className="font-bold my-2 text-lg">Тестийн тоот</p>
            <Form.Item name="generate">
              <Input size="large" placeholder="Тестийн тоот" />
            </Form.Item>
          </div>
          <div className="mt-4">
            <p className="font-bold my-2 text-lg">Тестийн нэр</p>
            <Form.Item name="title">
              <Input size="large" placeholder="Тестийн нэр" />
            </Form.Item>
          </div>
          <div className="my-2">
            <p className="font-bold">Зөвшөөрөл</p>
            <p className="mb-4">
              Доор гарын үсэг зурсан албан тушаалтнууд нь тестийн үйл
              ажиллагааны төлөвлөгөөний баримт бичигтэй танилцаж, түүнтэй санал
              нийлж байгаагаа хүлээн зөвшөөрч, баталгаажуулсан болно. Энэхүү
              төлөвлөгөөний өөрчлөлтийг доор гарын үсэг зурсан эсвэл тэдгээрийн
              томилогдсон төлөөлөгчдийн зөвшөөрлийг үндэслэн зохицуулж,
              нэмэлтээр батална.
            </p>
            <DepartmentEmployeeRole form={mainForm} />
          </div>
          <div className="my-4">
            <div className="font-bold my-2 text-lg mx-4">
              1. Үйл ажиллагааны зорилго
            </div>
            <Form.Item name="aim">
              <Input.TextArea rows={5} placeholder="Тестийн зорилго" />
            </Form.Item>
          </div>
          <div className="pb-4">
            <div className="font-bold my-2 text-lg mx-4">
              2. Тестийн танилцуулга
            </div>
            <Form.Item name="intro">
              <Input.TextArea rows={5} placeholder="Тестийн танилцуулга" />
            </Form.Item>
          </div>
          <TestSchedule form={mainForm} />
          <div className="font-bold my-2 text-lg">
            4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
          </div>
          <li>4.1 Таамаглал</li>
          <div className="mt-2">
            <Form.Item name="predict">
              <Input.TextArea rows={5} />
            </Form.Item>
          </div>
          <TestRisk form={mainForm} />
          <div>
            <li>4.3 Хараат байдал</li>
            <div className="mt-2">
              <Form.Item name="dependecy">
                <Input.TextArea rows={5} />
              </Form.Item>
            </div>
          </div>
          <div className="font-bold my-2 text-lg mx-4">5. Тестийн үе шат</div>
          <div>
            <li>5.1 Бэлтгэл үе</li>
            <div className="mt-2">
              <Form.Item name="standby">
                <Input.TextArea rows={5} />
              </Form.Item>
            </div>
          </div>
          <div>
            <li>5.2 Тестийн гүйцэтгэл</li>
            <div className="mt-2">
              <Form.Item name="execute">
                <Input.TextArea rows={5} />
              </Form.Item>
            </div>
          </div>
          <div>
            <li>5.3 Тестийн хаалт</li>
            <div className="mt-2">
              <Form.Item name="terminate">
                <Input.TextArea rows={5} />
              </Form.Item>
            </div>
          </div>
          <div className="font-bold my-2 text-lg mx-4">
            6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
          </div>
          <div className="my-4">
            <Form.Item name="adding">
              <Input placeholder="" />
            </Form.Item>
          </div>
          <Addition form={mainForm} />
          <TestBudget form={mainForm} />
          <div className="">
            <p className="my-4 font-bold">ТӨСВИЙН ДАНС</p>
            <Flex gap={10}>
              <Form.Item name="bankname" style={{ flex: 1 }}>
                <Input size="middle" placeholder="Дансны эзэмшигч" />
              </Form.Item>
              <Form.Item name="bank" style={{ flex: 1 }}>
                <Input
                  size="middle"
                  type="number"
                  placeholder="Дансны дугаар"
                />
              </Form.Item>
            </Flex>
          </div>
          <TestCase form={mainForm} />
          <Flex justify="center">
            {/* <Button
              type="primary"
              size="large"
              onClick={() => {
                getDocumentId(Number(id));
                getCheckout(5);
              }}
            >
              Батлах хуудас
            </Button> */}
            <Button
              size="large"
              type="primary"
              onClick={() => mainForm.submit()}
            >
              Засаад, хадгалах
            </Button>
            {/* <Button
              size="large"
              type="primary"
              onClick={async () => {
                await axios.put(`/api/final/`, {
                  authuserId: session?.user.id,
                  reject: 1,
                  documentId: id,
                });
                router.refresh();
                messageApi.success("Амжилттай илгээгдлээ");
              }}
            >
              Алдаа байхгүй, Илгээх
            </Button> */}
          </Flex>
        </Form>
        <PaperWindow />
      </Layout.Content>
      <Layout.Sider
        width="25%"
        theme="light"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "visible",
        }}
      >
        <ChildSteps record={steps} />
      </Layout.Sider>
    </Layout>
  );
}
