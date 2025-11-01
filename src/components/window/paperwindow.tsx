"use client";
import { ZUSTAND } from "@/zustand";
import { Modal, Form, Input, Table, Select, Button, message } from "antd";
import type { FormProps } from "antd";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState, useCallback, useEffect } from "react";
import { capitalizeFirstLetter, convertUtil } from "@/util/usable";
import Image from "next/image";
import { ConfirmDoc } from "@/util/action";

dayjs.extend(customParseFormat);

export function PaperWindow() {
  const { checkout, getCheckout, documentid } = ZUSTAND();
  const [caseForm] = Form.useForm();
  const [getEmployee, setEmployee] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const handleCancel = () => {
    getCheckout(-1);
  };
  const onFinish: FormProps["onFinish"] = async (values) => {
    const data = values.confirms.map((item: any) => {
      return {
        employeeId: item.employeeId,
        rode: {
          employee: item.employeeId,
          rode: false,
        },
        documentId: documentid,
        title: values.title,
      };
    });

    const response = await ConfirmDoc(data);
    if (response > 0) {
      messageApi.success("Батлах хуудас үүслээ");
      handleCancel();
    } else {
      messageApi.error("Амжилтгүй боллоо.");
    }
  };

  const detail = async ({ id }: { id: number }) => {
    const request = await axios.get(`/api/document/confirm/${id}`);
    if (request.data.success) {
      const updatedData = request.data.data?.confirm.map((data: any) => ({
        key: uuidv4(),
        id: data.id,
        employeeId: {
          value: data.id,
          label: `${data.employee.firstname} ${data.employee.lastname}`,
        },
      }));

      caseForm.setFieldsValue({
        confirms: updatedData,
        startedDate: dayjs(request.data.data.confirm[0]?.startedDate) || "",
        title: request.data.data.confirm[0]?.title || "",
      });
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
        <div className="mt-8">
          <div className="">
            <p className="font-bold mb-2">Гарчиг</p>
            <Form.Item name="title">
              <Input />
            </Form.Item>
          </div>
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
                      title: "Хариуцагч",
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
