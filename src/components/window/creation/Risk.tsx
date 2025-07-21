"use client";
import { Form, Input, Table, Button, Select } from "antd";
import Image from "next/image";

export function TestRisk() {
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
            <div className="text-end mt-4">
              <Button
                type="primary"
                onClick={() =>
                  add({
                    riskDescription: "",
                    riskLevel: "",
                    affectionLevel: "",
                    mitigationStrategy: "",
                  })
                }
              >
                Мөр нэмэх
              </Button>
            </div>
          </section>
        )}
      </Form.List>
    </section>
  );
}
