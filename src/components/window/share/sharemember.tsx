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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ZUSTAND } from "@/zustand";
import { PaperWindow } from "../paperwindow";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";

export function ShareMember(document: any) {
  const [messageApi, contextHolder] = message.useMessage();
  const [mainForm] = Form.useForm();
  const [getEmployee, setEmployee] = useState<any>([]);
  const [search, setSearch] = useState("");
  // convert department employee
  const updatedData = document.document.departmentEmployeeRole.map(
    (data: any) => ({
      key: uuidv4(),
      id: data.employee.id,
      department: data.employee.department?.name || "",
      employee: `${data.employee.firstname} ${data.employee.lastname}`,
      jobPosition: data.employee.jobPosition?.name || "",
      role: data.role,
    })
  );

  //convert document employee
  const scheduleData = document.document.documentemployee.map((data: any) => {
    const startedDate =
      data.startedDate && dayjs(data.startedDate, dateFormat)
        ? data.startedDate
        : "";
    const endDate =
      data.endDate && dayjs(data.endDate, dateFormat) ? data.endDate : "";
    return {
      key: uuidv4(),
      id: data.employee.id,
      employeeId: `${data.employee.firstname} ${data.employee.lastname}` || "",
      role: data.role || "",
      startedDate,
      endDate,
    };
  });

  //riskassesment huvirgah
  const riskData = document.document.riskassessment.map((data: any) => ({
    key: uuidv4(),
    id: data.id,
    riskDescription: data.riskDescription || "",
    riskLevel: data.riskLevel || "",
    affectionLevel: data.affectionLevel || "",
    mitigationStrategy: data.mitigationStrategy || "",
  }));

  //budget huvirgah
  const budgetData = document.document.budget.map((data: any) => ({
    key: uuidv4(),
    id: data.id,
    productCategory: data.productCategory || "",
    product: data.product || "",
    amount: data.amount || 0,
    priceUnit: data.priceUnit || 0,
    priceTotal: data.priceTotal || 0,
  }));

  const caseData = document.document.testcase.map((testCase: any) => ({
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
    console.log(values);
  };

  useEffect(() => {
    search ? fetchEmployees(search) : setEmployee([]);
    mainForm.setFieldsValue({
      title: document.document.title,
      aim: document.document.detail[0].aim,
      intro: document.document.detail[0].intro,
      departmentemployee: updatedData.map((item: any) => ({
        employeeId: { value: item.id, label: item.employee },
        jobposition: item.jobPosition,
        department: item.department,
        role: item.role,
      })),
      testschedule: scheduleData.map((item: any) => ({
        ...item,
        startedDate: item.startedDate ? dayjs(item.startedDate) : null,
        endDate: item.endDate ? dayjs(item.endDate) : null,
      })),
      predict:
        document.document.attribute.find(
          (attr: any) => attr.category === "Таамаглал"
        )?.value || "",
      dependecy:
        document.document.attribute.find(
          (attr: any) => attr.category === "Хараат байдал"
        )?.value || "",
      standby:
        document.document.attribute.find(
          (attr: any) => attr.category === "Бэлтгэл үе"
        )?.value || "",
      execute:
        document.document.attribute.find(
          (attr: any) => attr.category === "Тестийн гүйцэтгэл"
        )?.value || "",
      terminate:
        document.document.attribute.find(
          (attr: any) => attr.category === "Тестийн хаалт"
        )?.value || "",
      adding:
        document.document.attribute.find(
          (attr: any) => attr.category === "Нэмэлт"
        )?.value || "",
      bankname: document.document.bank?.name,
      bank: document.document.bank?.address,
      testrisk: riskData,
      testbudget: budgetData,
      testcase: caseData,
      attribute: document.document.attribute.filter(
        (attr: any) =>
          attr.categoryMain === "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур"
      ),
    });
  }, [search, fetchEmployees]);
  return (
    <section>
      {contextHolder}
      <p className="font-bold text-2xl mb-6">ЖИМОБАЙЛ ХХК</p>
      <Form form={mainForm} onFinish={onFinish}>
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Тестийн нэр бичнэ үү" }]}
        >
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
          <Form.Item
            name="aim"
            rules={[
              {
                required: true,
                message: "Үйл ажиллагааны зорилгоо бичнэ үү",
              },
            ]}
          >
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
          <Form.Item
            name="intro"
            rules={[
              {
                required: true,
                message: "Танилцуулгаа бичнэ үү",
              },
            ]}
          >
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
          <Form.Item
            name="predict"
            rules={[{ required: true, message: "Таамаглалаа бичнэ үү" }]}
          >
            <Input.TextArea
              rows={5}
              style={{ resize: "none" }}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>
        <TestRisk />
        <div>
          <li>
            4.3 Хараат байдал
            <ul className="ml-8">
              • Эхний оруулсан хараат байдал энэ форматын дагуу харагдах. Хэдэн
              ч мөр байх боломжтой.
            </ul>
          </li>
          <div className="mt-2">
            <Form.Item
              name="dependecy"
              rules={[{ required: true, message: "Хараат байдлыг бичнэ үү" }]}
            >
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
            <Form.Item
              name="standby"
              rules={[{ required: true, message: "Бэлтгэл үеийг бичнэ үү" }]}
            >
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
            <Form.Item
              name="execute"
              rules={[
                { required: true, message: "Тестийн гүйцэтгэлээ бичнэ үү" },
              ]}
            >
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
            <Form.Item
              name="terminate"
              rules={[{ required: true, message: "Тестийн хаалт бичнэ үү" }]}
            >
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
        <Addition />
        <TestBudget />
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
        <TestCase />
        <Flex justify="space-between" gap={20} style={{ marginTop: 40 }}>
          <Button type="dashed" size="large">
            Батлах хуудас
          </Button>
          {document.state === "DENY" && (
            <Button
              size="large"
              type="link"
              htmlType="submit"
              onClick={() => mainForm.submit()}
            >
              Засаад, хадгалах
            </Button>
          )}
          <Button size="large" type="primary">
            Алдаа байхгүй, Илгээх
          </Button>
        </Flex>
      </Form>
      <PaperWindow />
    </section>
  );
}
