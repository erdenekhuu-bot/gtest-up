"use client";
import { Form, Input, Table, Flex, Select } from "antd";
import Image from "next/image";
import * as XLSX from "xlsx";
import type { FormInstance } from "antd/es/form";


export function UsedPhone({ form }: { form: FormInstance }) {
  const handleFileUpload = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.onload = (event: any) => {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);
  
        const dataWithKeys = sheetData.map((item: any, index: number) => ({
          ...item,
          id: index.toString(),
        }));
        form.setFieldsValue({ usedphone: dataWithKeys });
      };
  
      reader.readAsBinaryString(file);
    };

  return (
     <Form.List name="usedphone">
          {(fields, {add,remove})=>(
                <section>
                    <Table
                     rowKey="id"
                     dataSource={fields}
                     pagination={false}
                     bordered
                     columns={[
                       {
                            title: "Дугаарын төрөл",
                            dataIndex: "type",
                            key: "type",
                            render: (_, __, index) => (
                              <Form.Item name={[index, "type"]}>
                                <Select
                                  options={[
                                    {
                                      label: "Урьдчилсан төлбөрт",
                                      value: "PERPAID",
                                    },
                                    {
                                      label: "Дараа төлбөрт",
                                      value: "POSTPAID",
                                    },
                                  ]}
                                  showSearch
                                  filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                  }
                                />
                              </Form.Item>
                            ),
                        },
                        {
                          title: "Дугаар",
                          dataIndex: "phone",
                          key: "phone",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "phone"]}>
                              <Input placeholder="" />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Тайлбар",
                          dataIndex: "description",
                          key: "description",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "description"]}>
                              <Input placeholder="" />
                            </Form.Item>
                          ),
                        },
                        {
                          title: "Сиреал дугаар",
                          dataIndex: "serial",
                          key: "serial",
                          render: (_, __, index) => (
                            <Form.Item name={[index, "serial"]}>
                              <Input placeholder="" />
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
                    />
                    <Flex style={{ marginTop: 10, marginBottom: 30 }}>
                      <label
                        htmlFor="usedphone"
                        className="bg-blue-500 text-white p-3 cursor-pointer rounded-lg active:opacity-50 transition-opacity"
                      >
                        Хүснэгт оруулах
                      </label>

                      <Input
                        id="usedphone"
                        type="file"
                        hidden
                        onChange={handleFileUpload}
                      />
                    </Flex>
                  </section>
                )}
      </Form.List>
  );
}
