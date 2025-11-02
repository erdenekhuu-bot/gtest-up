"use client";
import {
  Form,
  message,
  Table,
  Input,
  Select,
  Button,
  Flex,
  Steps,
  Breadcrumb,
} from "antd";
import type { FormProps } from "antd";
import Image from "next/image";
import { convertUtil, capitalizeFirstLetter } from "@/util/usable";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { TestSchedule } from "../../creation/Schedule";
import { TestRisk } from "../../creation/Risk";
import { Addition } from "../../creation/Addition";
import { TestBudget } from "../../creation/Budget";
import { TestCase } from "../../creation/Testcast";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import { ZUSTAND } from "@/zustand";
import { PaperWindow } from "../../paperwindow";
import { FullUpdate } from "@/util/action";
import { parseLocaleNumber, convertName } from "@/util/usable";
import { Badge } from "@/components/ui/badge";
import { DownloadOutlined } from "@ant-design/icons"; //

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";

export function EditPage({ document, id, steps }: any) {
  const [messageApi, contextHolder] = message.useMessage();
  const [mainForm] = Form.useForm();
  const [getEmployee, setEmployee] = useState<any>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const { getCheckout, getDocumentId } = ZUSTAND();
  const reference = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const transformStyle = useMemo(
    () => ({
      transform: `translateY(${scrollPosition}px)`,
      willChange: "transform",
    }),
    [scrollPosition]
  );

  // convert department employee

  const updatedData = document.departmentEmployeeRole.map((data: any) => ({
    key: uuidv4(),
    id: data.employee?.id,
    department: data.employee?.department?.name || "",
    employee: `${data.employee?.firstname} ${data.employee?.lastname}`,
    jobPosition: data.employee?.jobPosition?.name || "",
    role: data.role,
  }));

  //convert document employee
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

  let sortedSteps = steps
    .sort((a: any, b: any) => b.level - a.level)
    .map((item: any, index: number) => ({
      ...item,
      sublevel: index + 1,
    }))
    .sort((a: any, b: any) => a.sublevel - b.sublevel);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
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
    <section className="">
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
      <p className="font-bold text-2xl mb-6">ЖИМОБАЙЛ ХХК</p>
      <Form
        form={mainForm}
        onFinish={onFinish}
        className="p-2 flex overflow-auto scrollbar"
        onScroll={(e: React.UIEvent<HTMLFormElement>) => {
          const currentScroll = e.currentTarget.scrollTop;
          setScrollPosition(currentScroll);
        }}
      >
        <section className="flex-1 w-3/4">
          <Form.Item name="title">
            <Input size="large" placeholder="Тестийн нэр бичнэ үү..." />
          </Form.Item>
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
              />
            </Form.Item>
          </div>
          <div className="pb-4">
            <div className="font-bold my-2 text-lg mx-4">
              2. Тестийн танилцуулга
            </div>
            <Form.Item name="intro">
              <Input.TextArea
                rows={5}
                placeholder="Тестийн танилцуулга бичнэ үү..."
              />
            </Form.Item>
          </div>
          <TestSchedule />

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
          <div className="font-bold my-2 text-lg mx-4">5.3. Тестийн кэйс</div>
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
            {document.state !== "FORWARD" ? (
              <Button
                size="large"
                type="link"
                onClick={() => mainForm.submit()}
              >
                Засаад, хадгалах
              </Button>
            ) : (
              <Badge variant="viewing">Шалгагдаж байгаа</Badge>
            )}

            {document.state !== "FORWARD" && (
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
            )}
          </Flex>
        </section>
        <div
          className="w-1/4 p-4 h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-y-auto"
          ref={reference}
          style={transformStyle}
        >
          <Steps
            current={sortedSteps.findIndex(
              (item: any) => item.state === "ACCESS"
            )}
            direction="vertical"
            items={sortedSteps.map((item: any, index: number) => ({
              title: `${
                item.state === "ACCESS" ? "Баталгаажсан" : "Хүлээгдэж байгаа"
              }`,
              description: (
                <section key={index} className="text-[12px] mb-12">
                  <p className="opacity-50">
                    {item.employee.jobPosition?.name}
                  </p>
                  <p className="opacity-50">{convertName(item.employee)}</p>
                  <p className="opacity-50">
                    {new Date(item.startedDate).toLocaleString()}
                  </p>
                  <div className="mt-4">
                    {item.state === "ACCESS" ? (
                      <Badge variant="info">Баталгаажсан</Badge>
                    ) : (
                      <Button
                        type="primary"
                        disabled={
                          Number(session?.user.id) ===
                          item.employee.authUser?.id
                            ? false
                            : true
                        }
                        onClick={() => {
                          getCheckout(7);
                        }}
                      >
                        Баталгаажуулах
                      </Button>
                    )}
                  </div>
                </section>
              ),
              status: item.state === "ACCESS" ? "process" : "wait",
            }))}
          />
        </div>
      </Form>
      <PaperWindow />
    </section>
  );
}