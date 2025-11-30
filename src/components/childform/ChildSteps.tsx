"use client";
import { Steps, Button, message, Flex, Modal, Input, Popover } from "antd";
import { Badge } from "../ui/badge";
import { convertName } from "../../util/usable";
import { useSession } from "next-auth/react";
import { ZUSTAND } from "../../zustand";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Rejection } from "../window/reject/rejection";
import { RejectCause } from "../window/reject/rejectcause";

export function ChildSteps({ record, id }: any) {
  const { data: session } = useSession();
  const router = useRouter();
  const { checkout, getCheckout, getDocumentId, getOTP, documentid } =
    ZUSTAND();
  const [append, setAppend] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
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
        documentId: Number(id),
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
  const content = (
    <Flex gap={10}>
      <Button
        size="large"
        onClick={async () => {
          getCheckout(7);
          getOTP(Number(session?.user.id));
        }}
      >
        Зөвшөөрөх
      </Button>
      <Button
        size="large"
        type="link"
        onClick={() => {
          getDocumentId(Number(id));
          getCheckout(12);
        }}
      >
        Буцаах
      </Button>
    </Flex>
  );

  const rejectcontent = (
    <Flex gap={10}>
      <Button
        size="large"
        onClick={async () => {
          getDocumentId(Number(id));
          getCheckout(13);
        }}
      >
        Шалтгаан
      </Button>
      <Button
        size="large"
        onClick={async () => {
          getCheckout(7);
          getOTP(Number(session?.user.id));
        }}
      >
        Зөвшөөрөх
      </Button>
    </Flex>
  );
  return (
    <section>
      <Steps
        style={{ height: "100vh", zIndex: 10, overflow: "auto" }}
        current={record[0].result.findIndex(
          (item: any) => item.state === "ACCESS"
        )}
        direction="vertical"
        items={record[0].result.map((item: any, index: number) => {
          return {
            title: `${
              item.state === "ACCESS" ? "Баталгаажсан" : "Хүлээгдэж байгаа"
            }`,
            description: (
              <section key={index} className="text-[12px] mb-12">
                <p className="opacity-50">{item.jobPosition}</p>
                <p className="opacity-50">{convertName(item.employee)}</p>
                <p className="opacity-50">
                  {new Date(item.startedDate).toLocaleString()}
                </p>
                <div className="mt-4">
                  {item.state === "ACCESS" ? (
                    <Badge variant="info">Баталгаажсан</Badge>
                  ) : Number(session?.user.id) === item.authUser ? (
                    <div>
                      {item.rejection.authUser === Number(session?.user.id) ? (
                        <Popover content={rejectcontent} title="">
                          <Badge variant="destructive">Буцаасан</Badge>
                        </Popover>
                      ) : (
                        <Popover content={content} title="">
                          <Button type="primary">Баталгаажуулах</Button>
                        </Popover>
                      )}
                    </div>
                  ) : null}
                </div>
              </section>
            ),
            status: item.state === "ACCESS" ? "process" : "wait",
          };
        })}
      />
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
      <Rejection />
      <RejectCause />
    </section>
  );
}
