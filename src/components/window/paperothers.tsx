"use client";
import { ZUSTAND } from "@/zustand";
import {
  Modal,
  Form,
  Input,
  Table,
  DatePicker,
  Select,
  Button,
  message,
} from "antd";
import type { FormProps } from "antd";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState, useCallback, useEffect } from "react";
import { capitalizeFirstLetter, convertUtil } from "@/util/usable";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConfirmMember } from "@/util/action";
import { useSession } from "next-auth/react";

dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

export function PaperOthers() {
  const {
    fetchpaper,
    checkout,
    getCheckout,
    documentid,
    employeeId,
    confirmId,
  } = ZUSTAND();
  const [caseForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();

  const handleCancel = () => {
    getCheckout(-1);
  };
  const router = useRouter();
  const onFinish: FormProps["onFinish"] = async (values) => {
    const merge = values.confirms.map((item: any) => {
      return {
        system: item.system,
        jobs: item.jobs,
        module: item.module,
        version: item.version,
        description: item.description,
        employeeId,
        documentid,
      };
    });

    const response = await ConfirmMember(merge);

    if (response > 0) {
      await axios.patch("/api/document/paper", {
        authUser: session?.user.id,
        paperid: confirmId,
      });
      fetchpaper(Number(session?.user.id));
      router.refresh();
      handleCancel();
    } else {
      messageApi.error("Амжилтгүй боллоо.");
    }
  };

  const detail = async ({ id }: { id: number }) => {
    const request = await axios.post(`/api/document/confirm/detail`, {
      id,
      userid: session?.user.id,
    });
    if (request.data.success) {
      const updatedData = request.data.data?.confirm.map((data: any) => ({
        key: uuidv4(),
        id: data.id,
        employeeId: {
          value: data.id,
          label: `${data.employee.firstname} ${data.employee.lastname}`,
        },
        jobs: data.jobs,
        module: data.module,
        system: data.system,
        version: data.version,
        description: data.description,
      }));
      caseForm.setFieldsValue({
        confirms: updatedData,
        startedDate: dayjs(request.data.data.confirm[0]?.startedDate) || "",
        title: request.data.data.confirm[0]?.title || "",
      });
    }
  };

  useEffect(() => {
    detail({ id: documentid });
  }, [documentid]);

  return (
    <Modal
      open={checkout === 10}
      onCancel={handleCancel}
      title=""
      width={1000}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Болих
        </Button>,
        <Button key="next" type="primary" onClick={() => caseForm.submit()}>
          Цааш
        </Button>,
      ]}
    >
      {contextHolder}
      <div className="">
        <p className="font-bold text-xl">Баталгаажуулах хуудас</p>
      </div>
      <Form form={caseForm} className="p-6" onFinish={onFinish}>
        <div className="mt-8">
          <Form.List name="confirms">
            {(fields, { add, remove }) => (
              <section>
                <Table
                  dataSource={fields}
                  pagination={false}
                  bordered
                  rowKey="key"
                  columns={[
                    {
                      title: "Систем нэр",
                      dataIndex: "system",
                      key: "system",
                      render: (_, __, index) => (
                        <Form.Item name={[index, "system"]}>
                          <Input />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "Хийгдсэн ажлууд",
                      dataIndex: "jobs",
                      key: "jobs",
                      render: (_, __, index) => (
                        <Form.Item
                          name={[index, "jobs"]}
                          rules={[{ required: false }]}
                        >
                          <Input.TextArea
                            rows={1}
                            placeholder=""
                            maxLength={500}
                          />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "Шинэчлэлт хийгдсэн модул",
                      dataIndex: "module",
                      key: "module",
                      render: (_, __, index) => (
                        <Form.Item name={[index, "module"]}>
                          <Input />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "Хувилбар",
                      dataIndex: "version",
                      key: "version",
                      render: (_, __, index) => (
                        <Form.Item name={[index, "version"]}>
                          <Input />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "Тайлбар",
                      dataIndex: "description",
                      key: "description",
                      render: (_, __, index) => (
                        <Form.Item name={[index, "description"]}>
                          <Input />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "",
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
                ></Table>
                <div className="text-end mt-4">
                  <Button
                    type="primary"
                    onClick={() =>
                      add({
                        employeeId: "",
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
      </Form>
    </Modal>
  );
}
