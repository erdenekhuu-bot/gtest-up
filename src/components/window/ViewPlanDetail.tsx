"use client";

import { Form, Input, Table, Flex, Steps, Button, Modal, message } from "antd";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { ActionDetail } from "./MemberPlanDetail";
import { ReadDepartmentEmployee } from "./table/ReadDepartmentEmployee";
import { ReadTestSchedule } from "./table/ReadTestSchedule";
import { ReadTestRisk } from "./table/ReadTestRisk";
import { ReadTestEnv } from "./table/ReadTestEnv";
import { ReadTestCase } from "./table/ReadTestCase";
import { convertName } from "@/util/usable";
import { Badge } from "@/components/ui/badge";
import { ZUSTAND } from "@/zustand";
import axios from "axios";
import { useRouter } from "next/navigation";

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

export function ViewPlanDetail({ document, steps }: any) {
  const [attributeForm] = Form.useForm();
  const { checkout, getCheckout, documentid, getDocumentId } = ZUSTAND();
  const reference = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { data: session } = useSession();
  const [messageApi, contextHolder] = message.useMessage();
  const [append, setAppend] = useState("");
  const router = useRouter();

  const showOTP = () => {
    getCheckout(7);
  };

  const cancelOTP = () => {
    getCheckout(-1);
  };
  const sendOTP = async () => {
    try {
      const response = await axios.put("/api/otp/created", {
        authuserId: Number(session?.user.id),
      });
      if (response.status === 200) {
        messageApi.success("Нэг удаагийн код илгээгдлээ!");
      }
    } catch (error) {
      messageApi.error("Амжилтгүй боллоо.");
      return;
    }
  };

  const checkOTP = async () => {
    try {
      const response = await axios.post("/api/final/", {
        authuserId: Number(session?.user.id),
        otp: Number(append),
        reject: 2,
        check: 2,
        documentId: document.id,
      });
      if (response.data.success && session?.user?.id) {
        cancelOTP();
        router.refresh();
      }
    } catch (error) {
      messageApi.error("Амжилтгүй боллоо.");
      return;
    }
  };

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
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                <Input.TextArea rows={5} style={{ resize: "none" }} readOnly />
              </Form.Item>
            </div>
            <div className="my-4">
              <div className="font-bold my-2 text-lg mx-4">
                2. Төслийн танилцуулга
              </div>
              <Form.Item name="intro">
                <Input.TextArea rows={5} style={{ resize: "none" }} readOnly />
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
                    rules={[{ required: true, message: "Тестийн бэлтгэл үе!" }]}
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
                    rules={[{ required: true, message: "Тестийн гүйцэтгэл!" }]}
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
                <Input.TextArea rows={5} style={{ resize: "none" }} readOnly />
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
        </section>
      </ActionDetail.Provider>
      <div
        className="w-1/4 p-4 mt-8 h-fit"
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
                <p className="opacity-50">{item.employee.jobPosition?.name}</p>
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
                      onClick={showOTP}
                      disabled={
                        Number(session?.user.id) === item.employee.authUser?.id
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
      <Modal
        title=""
        open={checkout === 7}
        onCancel={cancelOTP}
        footer={[
          <Flex justify="space-between">
            <Button key="back" type="link" className="mx-6" onClick={sendOTP}>
              Дахин код авах
            </Button>

            <Button
              key="next"
              type="primary"
              className="mx-6"
              onClick={checkOTP}
            >
              Шалгах
            </Button>
          </Flex>,
        ]}
      >
        {contextHolder}
        <p className="mt-4 text-xl px-2 text-center">
          {session?.user.mobile} дугаарт илгээсэн 6 оронтой кодыг оруулна уу.
        </p>
        <div className="my-4">
          <Flex gap="middle" align="center" vertical>
            <Input.OTP
              size="large"
              onChange={(e: any) => {
                setAppend(e);
              }}
            />
            <Button
              type="primary"
              className="w-[90%]"
              onClick={() => {
                sendOTP();
              }}
            >
              Нууц код авах
            </Button>
          </Flex>
        </div>
      </Modal>
    </Form>
  );
}
