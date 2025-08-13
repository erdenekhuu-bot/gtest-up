"use client";

import { Modal, Input, Form, Table } from "antd";
import { ZUSTAND } from "@/zustand";
import { useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { papercheck } from "@/util/usable";

export function PaperRegister() {
  const { documentid, getCheckout, checkout } = ZUSTAND();
  const [mainForm] = Form.useForm();

  const detail = async function name(id: number) {
    const response = await axios.get("/api/paper/" + id);
    if (response.data.success) {
      console.log(response.data.data);
      const updatedData = response.data.data?.confirm.map((data: any) => ({
        key: uuidv4(),
        id: data.id,
        jobs: data.jobs,
        module: data.module,
        system: data.system,
        version: data.version,
        description: data.description,
        employeeId: `${data.employee.firstname} ${data.employee.lastname}`,
        check: papercheck(data.check),
      }));
      mainForm.setFieldsValue({
        confirms: updatedData,
      });
    }
  };
  useEffect(() => {
    detail(Number(documentid));
  }, [documentid]);
  const handleCancel = () => {
    getCheckout(-1);
  };

  return (
    <Modal
      open={checkout === 14}
      onCancel={handleCancel}
      width={1000}
      title=""
      onOk={handleCancel}
    >
      <Form form={mainForm}>
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
                    {
                      title: "Хариуцагч",
                      dataIndex: "employeeId",
                      render: (_, __, index) => (
                        <Form.Item name={[index, "employeeId"]}>
                          <Input.TextArea readOnly rows={3} />
                        </Form.Item>
                      ),
                    },
                    {
                      title: "Хянагдсан тухай",
                      dataIndex: "check",
                      render: (_, __, index) => (
                        <Form.Item name={[index, "check"]}>
                          <Input readOnly />
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
