"use client";

import { Form, Input, Table, Flex, Steps, Button, Breadcrumb } from "antd";
import { useState, createContext, useRef, useEffect, useMemo } from "react";
import { ReadDepartmentEmployee } from "./table/ReadDepartmentEmployee";
import { ReadTestSchedule } from "./table/ReadTestSchedule";
import { ReadTestRisk } from "./table/ReadTestRisk";
import { ReadTestEnv } from "./table/ReadTestEnv";
import { ReadTestCase } from "./table/ReadTestCase";
import { convertName } from "@/util/usable";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { redirect, useRouter } from "next/navigation";
import { ZUSTAND } from "@/zustand";
import axios from "axios";
import { Rejection } from "./reject/rejection";
import { PaperRegister } from "./reject/PaperRegister";

const columns = [
  {
    title: "Ангилал",
    dataIndex: "category",
    key: "id",
  },
  {
    title: "Шалгуур",
    dataIndex: "value",
    key: "value",
  },
];

export const ActionDetail = createContext<any | null>(null);

export function MemberPlanDetail({ document, steps }: any) {
  const [attributeForm] = Form.useForm();
  const reference = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { data: session } = useSession();
  const [alertShown, setAlertShown] = useState(false);
  const { getDocumentId, getCheckout } = ZUSTAND();
  const router = useRouter();

  const transformStyle = useMemo(
    () => ({
      transform: `translateY(${scrollPosition}px)`,
      willChange: "transform",
    }),
    [scrollPosition]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      if (Number(window.scrollY) + Number(window.innerHeight) >= 500) {
        setAlertShown(true);
      } else {
        setAlertShown(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alertShown]);

  useEffect(() => {
    if (reference.current) {
      Object.assign(reference.current.style, transformStyle);
    }
    attributeForm.setFieldsValue({
      title: document.title,
      aim: document.detail.aim,
      intro: document.detail.intro,
      bankname: document.bank?.name,
      bank: document.bank?.address,
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
    });
  }, [transformStyle, scrollPosition]);

  return (
    <section>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: (
              <span
                style={{
                  cursor: "pointer",
                }}
              >
                Үндсэн хуудас руу буцах
              </span>
            ),
            onClick: () => redirect("/teamplan"),
          },
          {
            title: "Төлөвлөгөөг хянах хуудас",
          },
        ]}
      />
      <Form
        form={attributeForm}
        className="p-2 flex  overflow-auto scrollbar"
        onScroll={(e: React.UIEvent<HTMLFormElement>) => {
          const currentScroll = e.currentTarget.scrollTop;
          setScrollPosition(currentScroll);
        }}
      >
        <ActionDetail.Provider value={document}>
          <section className="flex-1 w-3/4">
            <div className="first-column p-6">
              <div className="flex justify-between text-xl mb-6">
                <b>"ЖИМОБАЙЛ" ХХК</b>
              </div>
              <div className="mt-8">
                <Form.Item name="title">
                  <Input size="large" readOnly />
                </Form.Item>
              </div>
              <div className="my-4">
                <div className="font-bold my-2 text-lg">Зөвшөөрөл</div>
                <p className="mb-4">
                  Дор гарын үсэг зурсан албан тушаалтнууд нь тестийн үйл
                  ажиллагааны төлөвлөгөөний баримт бичигтэй танилцаж, түүнтэй
                  санал нийлж байгаагаа хүлээн зөвшөөрч, баталгаажуулсан болно.
                  Энэхүү төлөвлөгөөний өөрчлөлтийг доор гарын үсэг зурсан эсвэл
                  тэдгээрийн томилогдсон төлөөлөгчдийн зөвшөөрлийг үндэслэн
                  зохицуулж, нэмэлтээр батална.
                </p>
                <ReadDepartmentEmployee />
              </div>
              <div className="my-4">
                <div className="font-bold my-2 text-lg mx-4">
                  1. Үйл ажиллагааны зорилго
                </div>
                <Form.Item name="aim">
                  <Input.TextArea
                    rows={5}
                    style={{ resize: "none" }}
                    readOnly
                  />
                </Form.Item>
              </div>
              <div className="my-4">
                <div className="font-bold my-2 text-lg mx-4">
                  2. Төслийн танилцуулга
                </div>
                <Form.Item name="intro">
                  <Input.TextArea
                    rows={5}
                    style={{ resize: "none" }}
                    readOnly
                  />
                </Form.Item>
              </div>
              <ReadTestSchedule />
              <div className="font-bold my-2 text-lg mx-4">
                4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
              </div>
              <ReadTestRisk />
              <Form.Item name="execute">
                <div>
                  <li>4.2 Таамаглал</li>
                  <div className="mt-2">
                    <Form.Item
                      name="predict"
                      rules={[{ required: true, message: "Тестийн нэр!" }]}
                    >
                      <Input.TextArea
                        rows={5}
                        style={{ resize: "none" }}
                        readOnly
                      />
                    </Form.Item>
                  </div>
                </div>

                <div>
                  <li>4.3 Хараат байдал</li>
                  <div className="mt-2">
                    <Form.Item
                      name="dependecy"
                      rules={[{ required: true, message: "Тестийн нэр!" }]}
                    >
                      <Input.TextArea
                        rows={5}
                        style={{ resize: "none" }}
                        readOnly
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="font-bold my-2 text-lg mx-4">
                  5. Тестийн үе шат
                </div>
                <div>
                  <li>5.1 Бэлтгэл үе</li>
                  <div className="mt-2">
                    <Form.Item
                      name="standby"
                      rules={[
                        { required: true, message: "Тестийн бэлтгэл үе!" },
                      ]}
                    >
                      <Input.TextArea
                        rows={5}
                        style={{ resize: "none" }}
                        readOnly
                      />
                    </Form.Item>
                  </div>
                </div>

                <div>
                  <li>5.2 Тестийн гүйцэтгэл</li>
                  <div className="mt-2">
                    <Form.Item
                      name="execute"
                      rules={[
                        { required: true, message: "Тестийн гүйцэтгэл!" },
                      ]}
                    >
                      <Input.TextArea
                        rows={5}
                        style={{ resize: "none" }}
                        readOnly
                      />
                    </Form.Item>
                  </div>
                </div>
              </Form.Item>
            </div>
            <div>
              <li>5.3 Тестийн хаалт</li>
              <div className="mt-2">
                <Form.Item
                  name="terminate"
                  rules={[{ required: true, message: "Тестийн хаалт!" }]}
                >
                  <Input.TextArea
                    rows={5}
                    style={{ resize: "none" }}
                    readOnly
                  />
                </Form.Item>
              </div>
            </div>
            <div className="font-bold my-2 text-lg mx-4">
              6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
            </div>
            <div className="my-4">
              <Form.Item name="adding">
                <Input.TextArea
                  rows={1}
                  placeholder=""
                  maxLength={500}
                  readOnly
                />
              </Form.Item>
            </div>
            <Table
              rowKey="id"
              dataSource={document.attribute.filter(
                (attr: any) =>
                  attr.categoryMain ===
                  "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур"
              )}
              columns={columns}
              pagination={false}
              bordered
            />
            <ReadTestEnv />
            <div className="">
              <p className="my-4 font-bold">ТӨСӨВИЙН ДАНС</p>
              <Flex gap={10}>
                <Form.Item name="bankname" style={{ flex: 1 }}>
                  <Input size="middle" placeholder="Дансны эзэмшигч" readOnly />
                </Form.Item>
                <Form.Item name="bank" style={{ flex: 1 }}>
                  <Input
                    size="middle"
                    type="number"
                    placeholder="Дансны дугаар"
                    readOnly
                  />
                </Form.Item>
              </Flex>
            </div>
            <div className="font-bold my-2 text-lg mx-4">5.3. Тестийн кэйс</div>
            <ReadTestCase />
            {alertShown && session?.user.employee.super == "REPORT" ? (
              <div className="fixed bottom-0 w-full h-20 bg-white flex items-center gap-40 transition-transform">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    getDocumentId(document.id);
                    getCheckout(14);
                  }}
                >
                  Баталгаажуулах хуудас
                </Button>
                <Button
                  type="link"
                  size="large"
                  onClick={() => {
                    getDocumentId(document.id);
                    getCheckout(12);
                  }}
                >
                  Буцаах
                </Button>
                <Button
                  size="large"
                  type="primary"
                  onClick={async () => {
                    await axios.put(`/api/final/`, {
                      authuserId: session?.user.id,
                      reject: 2,
                      documentId: document.id,
                    });
                    await axios.patch(`/api/final`, {
                      authuserId: session?.user.id,
                      reject: 3,
                      documentId: document.id,
                    });
                    router.refresh();
                  }}
                >
                  Зөвшөөрөх
                </Button>
              </div>
            ) : null}
          </section>
        </ActionDetail.Provider>
        <div
          className="w-1/4 p-4 h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-y-auto"
          ref={reference}
          style={transformStyle}
        >
          <Steps
            current={steps.findIndex((item: any) => item.state === "ACCESS")}
            direction="vertical"
            items={steps.map((item: any, index: number) => ({
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
                          session?.user.id === item.employee.authUser?.id
                            ? false
                            : true
                        }
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

      <Rejection />
      <PaperRegister />
    </section>
  );
}
