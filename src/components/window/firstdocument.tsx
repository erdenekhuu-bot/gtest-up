"use client";
import { Modal, Form, Input, Button, Table, Select, message } from "antd";
import { ZUSTAND } from "@/zustand";
import type { FormProps } from "antd";
import {
  convertUtil,
  capitalizeFirstLetter,
  removeDepartment,
} from "@/util/usable";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import { CreateDocument } from "@/util/action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function FirstDocument() {
  const { checkout, getCheckout, getTitle, getDocumentId } = ZUSTAND();
  const handleCancel = () => {
    getCheckout(-1);
  };
  const [messageApi, contextHolder] = message.useMessage();
  const [mainForm] = Form.useForm();
  const [getEmployee, setEmployee] = useState<any>([]);
  const [search, setSearch] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const onFinish: FormProps["onFinish"] = async (values) => {
    getTitle(values.title);
    let converting = {
      ...removeDepartment(values),
      authuserId: Number(session?.user.id),
    };
    let cleanedData = { ...converting };
    delete cleanedData.key;
    const result = await CreateDocument(converting);
    getDocumentId(result);
    if (result > 0) {
      messageApi.success("Амжилттай хадгалагдлаа!");
      getCheckout(2);
      router.refresh();
      mainForm.resetFields();
    } else {
      messageApi.error("Алдаа гарлаа");
    }
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

  const findEmployee = async (id: number) => {
    try {
      const response = await axios.get("/api/employee/" + id);
      return response.data.data;
    } catch (error) {}
  };

  useEffect(() => {
    search ? fetchEmployees(search) : setEmployee([]);
  }, [search, fetchEmployees]);

  return (
    <section>
      <Modal
        open={checkout === 1}
        onOk={onFinish}
        onCancel={handleCancel}
        title="ЖИМОБАЙЛ ХХК"
        width="60%"
        className="scrollbar"
        style={{ overflowY: "auto", maxHeight: "800px" }}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Болих
          </Button>,
          <Button key="next" type="primary" onClick={() => mainForm.submit()}>
            Цааш
          </Button>,
        ]}
      >
        {contextHolder}

        <Form form={mainForm} onFinish={onFinish}>
          <div className="mt-8">
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Тестийн нэр бичнэ үү" }]}
            >
              <Input size="large" placeholder="Тестийн нэр бичнэ үү..." />
            </Form.Item>
          </div>
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
                        width: 300,
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
                        width: 300,
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
                        width: 300,
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
               
                rows={5}
                placeholder="Тестийн танилцуулга бичнэ үү..."
                
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </section>
  );
}
