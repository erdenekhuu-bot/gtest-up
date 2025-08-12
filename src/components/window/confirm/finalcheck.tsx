"use client";
import { ZUSTAND } from "@/zustand";
import { Modal, Form, Input, Table, Button, message } from "antd";
import type { FormProps } from "antd";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import { CheckActionPaper } from "@/util/action";

export function FinalCheck() {
  const [caseForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { checkout, getCheckout, employeeId, confirmpaperid } = ZUSTAND();
  const handleCancel = () => {
    getCheckout(-1);
  };

  const onFinish: FormProps["onFinish"] = async () => {
    const result = await CheckActionPaper(confirmpaperid);
    if (result > 0) {
      messageApi.success("Батлах хуудсыг шалгаж дууслаа");
      getCheckout(-1);
    } else {
      messageApi.error("Алдаа гарлаа");
    }
  };

  const detail = async ({ id }: { id: number }) => {
    const request = await axios.put(`/api/document/confirm/detail`, {
      id,
    });
    if (request.data.success) {
      const updatedData = request.data.data?.confirm.map((data: any) => ({
        key: uuidv4(),
        id: data.id,
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
    detail({ id: employeeId });
  }, [employeeId]);

  return (
    <Modal
      open={checkout === 11}
      onCancel={handleCancel}
      title=""
      width={1000}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Болих
        </Button>,
        <Button key="next" type="primary" onClick={() => caseForm.submit()}>
          Хянаж дуусгах
        </Button>,
      ]}
    >
      <div className="">
        <p className="font-bold text-xl">Баталгаажуулах хуудас</p>
      </div>
      {contextHolder}
      <Form form={caseForm} className="p-6" onFinish={onFinish}>
        <div className="mt-8">
          <Form.List name="confirms">
            {(fields) => (
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
                          <Input.TextArea readOnly rows={3} />
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
                          <Input.TextArea readOnly rows={3} />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "Шинэчлэлт хийгдсэн модул",
                      dataIndex: "module",
                      key: "module",
                      render: (_, __, index) => (
                        <Form.Item name={[index, "module"]}>
                          <Input.TextArea readOnly rows={3} />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "Хувилбар",
                      dataIndex: "version",
                      key: "version",
                      render: (_, __, index) => (
                        <Form.Item name={[index, "version"]}>
                          <Input.TextArea readOnly rows={3} />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "Тайлбар",
                      dataIndex: "description",
                      key: "description",
                      render: (_, __, index) => (
                        <Form.Item name={[index, "description"]}>
                          <Input.TextArea readOnly rows={3} />
                        </Form.Item>
                      ),
                    },
                  ]}
                ></Table>
              </section>
            )}
          </Form.List>
        </div>
      </Form>
    </Modal>
  );
}
