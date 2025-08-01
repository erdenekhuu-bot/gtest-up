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

dayjs.extend(customParseFormat);
const dateFormat = "YYYY/MM/DD";

export function PaperWindow() {
  const { checkout, getCheckout, documentid } = ZUSTAND();
  const [caseForm] = Form.useForm();
  const [getEmployee, setEmployee] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();
  const handleCancel = () => {
    getCheckout(-1);
  };
  const onFinish: FormProps["onFinish"] = async (values) => {
    try {
      const data = values.confirms.map((item: any) => {
        return {
          employeeId: item.employeeId,
          system: item.system,
          description: item.description,
          module: item.module,
          version: item.version,
          jobs: item.jobs,
          startedDate: dayjs(values.startedDate).format("YYYY-MM-DDTHH:mm:ssZ"),
          title: values.title,
          documentid,
        };
      });

      const response = await axios.put("/api/document/confirm", data);
      if (response.data.success) {
        messageApi.success("Батлах хуудас үүслээ");
        router.refresh();
        handleCancel();
      }
    } catch (error) {
      messageApi.error("Амжилтгүй боллоо.");
    }
  };

  const detail = async ({ id }: { id: number }) => {
    try {
      const request = await axios.get(`/api/document/confirm/${id}`);

      if (request.data.success) {
        const updatedData = request.data.data.confirm.map((data: any) => ({
          key: uuidv4(),
          id: data.id,
          employeeId:
            `${data.employee.firstname} ${data.employee.lastname}` || "",
          system: data.system,
          description: data.description,
          module: data.module,
          version: data.version,
          jobs: data.jobs,
        }));

        caseForm.setFieldsValue({
          confirms: updatedData,
          startedDate: dayjs(request.data.data.confirm[0]?.startedDate) || "",
          title: request.data.data.confirm[0]?.title || "",
        });
      }
    } catch (error) {
      return;
    }
  };
  const findEmployee = async (id: number) => {
    try {
      const response = await axios.get("/api/employee/" + id);
      return response.data.data;
    } catch (error) {}
  };
  const handleSearch = (value: any) => {
    setSearch(capitalizeFirstLetter(value));
  };
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

  useEffect(() => {
    search ? fetchEmployees(search) : setEmployee([]);
  }, [search, fetchEmployees]);

  useEffect(() => {
    detail({ id: documentid });
  }, [documentid]);

  return (
    <Modal
      open={checkout === 5}
      onCancel={handleCancel}
      width={800}
      title=""
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
        <div className="mt-4">
          <p className="my-2 font-bold text-lg">Газар, хэлтэс, алба:</p>
          <Form.Item name="title">
            <Input size="large" placeholder="Газар, хэлтэс, алба :" />
          </Form.Item>
        </div>
        <div className="mt-8">
          <p className="my-2 font-bold text-lg">Огноо:</p>
          <Form.Item name="startedDate">
            <DatePicker format={dateFormat} placeholder="Огноо" />
          </Form.Item>
        </div>
        <div className="mt-8">
          {/* <p className="text-lg text-center my-2">{documentName}</p> */}
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
                      title: "Хариуцагч",
                      dataIndex: "name",
                      key: "name",
                      render: (_, __, index) => (
                        <Form.Item name={[index, "employeeId"]}>
                          <Select
                            style={{ width: "100%" }}
                            options={convertUtil(getEmployee)}
                            onSearch={handleSearch}
                            filterOption={false}
                            showSearch
                            onChange={async (value, option) => {
                              const selectedEmployee = await findEmployee(
                                value
                              );
                              if (selectedEmployee) {
                                caseForm.setFieldsValue({
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
