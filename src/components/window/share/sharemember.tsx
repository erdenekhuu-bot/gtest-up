"use client";
import { Form, message, Table, Input, Select, Button, Flex } from "antd";
import type { FormProps } from "antd";
import Image from "next/image";
import { convertUtil, capitalizeFirstLetter } from "@/util/usable";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { TestSchedule } from "../creation/Schedule";
import { TestRisk } from "../creation/Risk";
import { Addition } from "../creation/Addition";
import { TestBudget } from "../creation/Budget";
import { TestCase } from "../creation/Testcast";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { PaperWindow } from "../paperwindow";
import { useSession } from "next-auth/react";
import { selectConvert } from "@/util/usable";
import { FullUpdate } from "@/util/action";
import { ZUSTAND } from "@/zustand";
import { useRouter } from "next/navigation";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";

export function ShareMember({ document, id }: any) {
  const [messageApi, contextHolder] = message.useMessage();
  const [mainForm] = Form.useForm();
  const [getEmployee, setEmployee] = useState<any>([]);
  const [search, setSearch] = useState("");
  const { data: session } = useSession();
  const { getCheckout, getDocumentId } = ZUSTAND();
  const router = useRouter();

  // convert department employee
  const updatedData = document.departmentEmployeeRole.map((data: any) => ({
    key: uuidv4(),
    id: data.employee.id,
    department: data.employee.department?.name || "",
    employee: `${data.employee.firstname} ${data.employee.lastname}`,
    jobPosition: data.employee.jobPosition?.name || "",
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
      employee: `${data.employee?.firstname} ${data.employee?.lastname}`,
      role: data.role || "",
      startedDate,
      endDate,
    };
  });

  //riskassesment huvirgah
  const riskData = document.riskassessment.map((data: any) => ({
    key: uuidv4(),
    id: data.id,
    riskDescription: data.riskDescription || "",
    riskLevel: data.riskLevel || "",
    affectionLevel: data.affectionLevel || "",
    mitigationStrategy: data.mitigationStrategy || "",
  }));

  //budget huvirgah
  const budgetData = document.budget.map((data: any) => ({
    key: uuidv4(),
    id: data.id,
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

  const fetchEmployees = useCallback(async (searchValue: string) => {
    try {
      const response = await axios.post("/api/employee", {
        firstname: searchValue,
      });

      if (response.data.success) {
        setEmployee(response.data.data);
      }
    } catch (error) {}
  }, []);

  const findEmployee = async (id: number) => {
    try {
      const response = await axios.get("/api/employee/" + id);
      return response.data.data;
    } catch (error) {}
  };
  const handleSearch = (value: any) => {
    setSearch(capitalizeFirstLetter(value));
  };

  const onFinish: FormProps["onFinish"] = async (values) => {
    let attributeData = [
      {
        categoryMain: "Тестийн үе шат",
        category: "Бэлтгэл үе",
        value: values.predict || "",
      },
      {
        categoryMain: "Тестийн үе шат",
        category: "Тестийн гүйцэтгэл",
        value: values.dependecy || "",
      },
      {
        categoryMain: "Тестийн үе шат",
        category: "Тестийн хаалт",
        value: values.standby || "",
      },
      {
        categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
        category: "Таамаглал",
        value: values.execute || "",
      },
      {
        categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
        category: "Хараат байдал",
        value: values.terminate || "",
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
        affectionLevel: selectConvert(item.affectionLevel),
        mitigationStrategy: item.mitigationStrategy,
        riskDescription: item.riskDescription,
        riskLevel: selectConvert(item.riskLevel),
      };
    });
    const budgetdata = (values.testenv || []).map((item: any) => ({
      productCategory: String(item.productCategory),
      product: String(item.product),
      priceUnit: Number(item.priceUnit),
      priceTotal: Number(item.priceTotal),
      amount: Number(item.amount),
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
    const merge = {
      ...values,
      riskdata,
      attributeData,
      testcase,
      budgetdata,
      bank,
      testteam,
      id,
    };
    const update = await FullUpdate(merge);
    if (update > 0) {
      messageApi.success("Амжилттай засагдсан");
    } else {
      messageApi.error("Алдаа гарлаа");
    }
  };

  useEffect(() => {
    search ? fetchEmployees(search) : setEmployee([]);
    mainForm.setFieldsValue({
      title: document.title,
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
  }, [document, fetchEmployees]);

  useEffect(() => {
    search ? fetchEmployees(search) : setEmployee([]);
  }, [search]);
  return (
    <section>
      {contextHolder}
      <p className="font-bold text-2xl mb-6">ЖИМОБАЙЛ ХХК</p>
      <Form form={mainForm} onFinish={onFinish}>
        <Form.Item name="title">
          <Input size="large" placeholder="Тестийн нэр бичнэ үү..." />
        </Form.Item>
        <div className="my-2">
          <p className="font-bold">Зөвшөөрөл</p>
          <p className="mb-4">
            Доор гарын үсэг зурсан албан тушаалтнууд нь тестийн үйл ажиллагааны
            төлөвлөгөөний баримт бичигтэй танилцаж, түүнтэй санал нийлж
            байгаагаа хүлээн зөвшөөрч, баталгаажуулсан болно. Энэхүү
            төлөвлөгөөний өөрчлөлтийг доор гарын үсэг зурсан эсвэл тэдгээрийн
            томилогдсон төлөөлөгчдийн зөвшөөрлийг үндэслэн зохицуулж, нэмэлтээр
            батална.
          </p>
          <Form.List name="departmentemployee">
            {(fields, { add, remove }) => (
              <section>
                <Table
                  rowKey="id"
                  dataSource={fields}
                  pagination={false}
                  bordered
                  columns={[
                    {
                      title: "Нэр",
                      dataIndex: "name",
                      key: "name",

                      render: (_, __, index) => (
                        <Form.Item name={[index, "employeeId"]}>
                          <Select
                            options={convertUtil(getEmployee)}
                            onSearch={handleSearch}
                            filterOption={false}
                            showSearch
                            onChange={async (value, option) => {
                              const selectedEmployee = await findEmployee(
                                value
                              );
                              if (selectedEmployee) {
                                mainForm.setFieldsValue({
                                  departmentemployee: {
                                    [index]: {
                                      employeeId: value,
                                      department:
                                        selectedEmployee.jobPosition?.name ||
                                        "",
                                    },
                                  },
                                });
                              }
                            }}
                          />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "Албан тушаал",
                      dataIndex: "department",
                      key: "department",

                      render: (_, __, index) => (
                        <Form.Item name={[index, "department"]}>
                          <Input readOnly />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "Үүрэг",
                      dataIndex: "role",
                      key: "role",

                      render: (_, __, index) => (
                        <Form.Item name={[index, "role"]}>
                          <Select
                            tokenSeparators={[","]}
                            options={[
                              {
                                value: "ACCESSER",
                                label: "Тестийн төсвийг хянан баталгаажуулах",
                              },
                              {
                                value: "VIEWER",
                                label: "Баримт бичгийг хянан баталгаажуулах",
                              },
                            ]}
                          />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "Устгах",
                      key: "id",
                      render: (_, __, index) => (
                        <Image
                          src="/trash.svg"
                          alt=""
                          className="hover:cursor-pointer"
                          width={20}
                          height={20}
                          onClick={() => remove(index)}
                        />
                      ),
                    },
                  ]}
                />
                <div className="text-end mt-4">
                  <Button
                    type="primary"
                    onClick={() =>
                      add({
                        employeeId: "",
                        department: "",
                        role: "",
                      })
                    }
                  >
                    Мөр нэмэх
                  </Button>
                </div>
              </section>
            )}
          </Form.List>
        </div>
        <div className="my-4">
          <div className="font-bold my-2 text-lg mx-4">
            1. Үйл ажиллагааны зорилго
          </div>
          <Form.Item name="aim">
            <Input.TextArea
              rows={5}
              placeholder="Тестийн зорилго бичнэ үү..."
              style={{ resize: "none" }}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>
        <div className="pb-4">
          <div className="font-bold my-2 text-lg mx-4">
            2. Тестийн танилцуулга
          </div>
          <Form.Item name="intro">
            <Input.TextArea
              maxLength={500}
              rows={5}
              placeholder="Тестийн танилцуулга бичнэ үү..."
              style={{ resize: "none" }}
              showCount
            />
          </Form.Item>
        </div>
        <TestSchedule />
        <div className="font-bold my-2 text-lg">
          4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
        </div>
        <li>
          4.1 Таамаглал
          <ul className="ml-8">
            • Эхний оруулсан таамаглал энэ форматын дагуу харагдах. Хэдэн ч мөр
            байх боломжтой.
          </ul>
        </li>
        <div className="mt-2">
          <Form.Item name="predict">
            <Input.TextArea
              rows={5}
              style={{ resize: "none" }}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>
        <TestRisk form={mainForm} />
        <div>
          <li>
            4.3 Хараат байдал
            <ul className="ml-8">
              • Эхний оруулсан хараат байдал энэ форматын дагуу харагдах. Хэдэн
              ч мөр байх боломжтой.
            </ul>
          </li>
          <div className="mt-2">
            <Form.Item name="dependecy">
              <Input.TextArea
                rows={5}
                style={{ resize: "none" }}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>
        </div>
        <div className="font-bold my-2 text-lg mx-4">5. Тестийн үе шат</div>
        <div>
          <li>
            5.1 Бэлтгэл үе
            <ul className="ml-8">
              • Эхний оруулсан бэлтгэл үе энэ форматын дагуу харагдах. Хэдэн ч
              мөр байх боломжтой.
            </ul>
          </li>
          <div className="mt-2">
            <Form.Item name="standby">
              <Input.TextArea
                rows={5}
                style={{ resize: "none" }}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <li>
            5.2 Тестийн гүйцэтгэл
            <ul className="ml-8">
              • Эхний оруулсан тестийн гүйцэтгэл энэ форматын дагуу харагдах.
              Хэдэн ч мөр байх боломжтой.
            </ul>
          </li>
          <div className="mt-2">
            <Form.Item name="execute">
              <Input.TextArea
                rows={5}
                style={{ resize: "none" }}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <li>
            5.3 Тестийн хаалт
            <ul className="ml-8">
              • Эхний оруулсан тестийн хаалт энэ форматын дагуу харагдах. Хэдэн
              ч мөр байх боломжтой.
            </ul>
          </li>
          <div className="mt-2">
            <Form.Item name="terminate">
              <Input.TextArea
                rows={5}
                style={{ resize: "none" }}
                showCount
                maxLength={500}
              />
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
          <p className="my-4 font-bold">ТӨСӨВИЙН ДАНС</p>
          <Flex gap={10}>
            <Form.Item name="bankname" style={{ flex: 1 }}>
              <Input size="middle" placeholder="Дансны эзэмшигч" />
            </Form.Item>
            <Form.Item name="bank" style={{ flex: 1 }}>
              <Input size="middle" type="number" placeholder="Дансны дугаар" />
            </Form.Item>
          </Flex>
        </div>
        <TestCase form={mainForm} />
        <Flex justify="space-between" gap={20} style={{ marginTop: 40 }}>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              getDocumentId(Number(id));
              getCheckout(5);
            }}
          >
            Батлах хуудас
          </Button>

          <Button
            size="large"
            type="text"
            htmlType="submit"
            onClick={() => mainForm.submit()}
          >
            Засаад, хадгалах
          </Button>
          <Button
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
          </Button>
        </Flex>
      </Form>
      <PaperWindow />
    </section>
  );
}
