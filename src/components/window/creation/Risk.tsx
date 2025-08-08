"use client";
import { Form, Input, Table, Flex, Select } from "antd";
import Image from "next/image";
import * as XLSX from "xlsx";
import type { FormInstance } from "antd/es/form";

export function TestRisk({ form }: { form: FormInstance }) {
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
      form.setFieldsValue({ testrisk: dataWithKeys });
    };

    reader.readAsBinaryString(file);
  };
  return (
    <section>
      <li className="mb-2 mt-4">4.2 Эрсдэл</li>
      <Form.List name="testrisk">
        {(fields, { add, remove }) => (
          <section>
            <Table
              rowKey="id"
              dataSource={fields}
              pagination={false}
              bordered
              columns={[
                {
                  title: "Эрсдэл",
                  dataIndex: "riskDescription",
                  key: "riskDescription",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "riskDescription"]}
                      rules={[
                        { required: true, message: "Тестийн нэр бичнэ үү" },
                      ]}
                    >
                      <Input.TextArea rows={1} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Эрсдлийн магадлал",
                  dataIndex: "riskLevel",
                  key: "riskLevel",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "riskLevel"]}
                      rules={[
                        { required: true, message: "Тестийн нэр бичнэ үү" },
                      ]}
                    >
                      <Select
                        placeholder=""
                        style={{ width: "100%" }}
                        options={[
                          {
                            label: "HIGH",
                            value: 1,
                          },
                          {
                            label: "MEDIUM",
                            value: 2,
                          },
                          {
                            label: "LOW",
                            value: 3,
                          },
                        ]}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: "Эрсдлийн нөлөөлөл",
                  dataIndex: "affectionLevel",
                  key: "affectionLevel",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "affectionLevel"]}
                      rules={[
                        { required: true, message: "Тестийн нэр бичнэ үү" },
                      ]}
                    >
                      <Select
                        placeholder=""
                        style={{ width: "100%" }}
                        options={[
                          {
                            label: "HIGH",
                            value: 1,
                          },
                          {
                            label: "MEDIUM",
                            value: 2,
                          },
                          {
                            label: "LOW",
                            value: 3,
                          },
                        ]}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: "Бууруулах арга зам",
                  dataIndex: "mitigationStrategy",
                  key: "mitigationStrategy",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "mitigationStrategy"]}
                      rules={[
                        { required: true, message: "Тестийн нэр бичнэ үү" },
                      ]}
                    >
                      <Input.TextArea rows={1} />
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
                htmlFor="testrisk"
                className="bg-blue-500 text-white p-3 cursor-pointer rounded-lg active:opacity-50 transition-opacity"
              >
                Хүснэгт оруулах
              </label>

              <Input
                id="testrisk"
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </Flex>
          </section>
        )}
      </Form.List>
    </section>
  );
}
